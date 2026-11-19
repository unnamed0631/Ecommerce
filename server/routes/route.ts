import { Hono } from "hono";
import mongoose from "mongoose";
import { z } from "zod";
import AuthController from "../controllers/auth.ts";
import AdminController from "../controllers/admin.ts";
import OrdersController from "../controllers/orders.ts";
import PaymentController from "../controllers/paypal.ts";
import ProductsController from "../controllers/products.ts";
import ProfileController from "../controllers/profile.ts";
import {
  authenticate,
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  REFRESH_TOKEN_GRACE_MS,
  verifyAccessToken,
  verifyRefreshToken,
} from "../controllers/token.ts";
import { readRequestBody } from "../lib/request.ts";
import Profile from "../models/profile.ts";
import RefreshToken from "../models/refreshToken.ts";
import User from "../models/user.ts";
import type { AppEnv, AuthUser, TokenUser } from "../types.ts";

const app = new Hono<AppEnv>();

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

const logoutSchema = z.object({
  id: z.string().optional(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
});

app.get("/", (c) => c.json({ message: "Ecommerce API" }));

app.route("/auth", AuthController);
app.route("/admin", AdminController);
app.route("/payment", PaymentController);
app.route("/products", ProductsController);
app.route("/orders", OrdersController);
app.route("/profile", ProfileController);

app.put("/refresh-token", async (c) => {
  const parsed = refreshTokenSchema.safeParse(await readRequestBody(c));

  if (!parsed.success) {
    return c.json({ message: "No refresh token provided" }, 401);
  }

  let decoded: AuthUser;

  try {
    decoded = verifyRefreshToken(parsed.data.refreshToken);
  } catch (error) {
    console.error("refresh-token", error);
    return c.json({ message: "Invalid or expired refresh token" }, 403);
  }

  try {
    const tokenHash = hashRefreshToken(parsed.data.refreshToken);
    const storedToken = await RefreshToken.findOne({ tokenHash });

    if (!storedToken) {
      return c.json({ message: "Invalid refresh token" }, 403);
    }

    if (storedToken.expiresAt.getTime() <= Date.now()) {
      return c.json({ message: "Invalid refresh token" }, 403);
    }

    if (decoded.id !== storedToken.userId.toString()) {
      return c.json({ message: "Invalid refresh token" }, 403);
    }

    const user = await User.findById(storedToken.userId);

    if (!user) {
      return c.json({ message: "User not found" }, 404);
    }

    const tokenUser: TokenUser = {
      id: user._id.toString(),
      role: user.role,
    };

    const issueTokenPair = async (): Promise<{
      accessToken: string;
      refreshToken: string;
    }> => ({
      accessToken: generateAccessToken(tokenUser),
      refreshToken: await generateRefreshToken(tokenUser),
    });

    if (!storedToken.revokedAt) {
      // Active token: rotate it. Only the old row is revoked; other sessions
      // (tabs/devices) keep their own active tokens.
      const tokens = await issueTokenPair();

      await RefreshToken.updateOne(
        { _id: storedToken._id },
        {
          $set: {
            revokedAt: new Date(),
            replacedBy: hashRefreshToken(tokens.refreshToken),
          },
        },
      );

      return c.json(tokens);
    }

    const revokedAt = new Date(storedToken.revokedAt).getTime();

    if (Number.isFinite(revokedAt) && Date.now() - revokedAt <= REFRESH_TOKEN_GRACE_MS) {
      // A second tab raced the first rotation: issue a fresh pair without
      // revoking the other active sessions.
      return c.json(await issueTokenPair());
    }

    // Reuse of a revoked token outside the grace window: treat it as stolen
    // and revoke every active session for that user.
    await RefreshToken.updateMany(
      { userId: storedToken.userId, revokedAt: null },
      { $set: { revokedAt: new Date() } },
    );

    return c.json({ message: "Invalid refresh token" }, 403);
  } catch (error) {
    console.error("refresh-token", error);
    return c.json({ message: "Invalid or expired refresh token" }, 403);
  }
});

app.post("/logout", async (c) => {
  const parsed = logoutSchema.safeParse(await readRequestBody(c));

  if (!parsed.success) {
    return c.json({ message: "Invalid token" }, 401);
  }

  try {
    let userId: string | undefined;

    if (parsed.data.accessToken) {
      userId = verifyAccessToken(parsed.data.accessToken).id;
    } else if (parsed.data.refreshToken) {
      userId = verifyRefreshToken(parsed.data.refreshToken).id;
    }

    if (!userId) {
      return c.json({ message: "No token provided" }, 401);
    }

    if (parsed.data.id !== undefined && parsed.data.id !== userId) {
      return c.json({ message: "Forbidden" }, 403);
    }

    await RefreshToken.deleteMany({
      userId: new mongoose.Types.ObjectId(userId),
    });

    return c.json({ message: "Logged out" }, 200);
  } catch (error) {
    console.error("logout", error);
    return c.json({ message: "Invalid token" }, 401);
  }
});

app.delete("/account", authenticate, async (c) => {
  const user = c.get("user");
  const userId = new mongoose.Types.ObjectId(user.id);

  try {
    await Profile.findOneAndDelete({ userId });
    await RefreshToken.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    return c.json({ message: "Account deleted successfully" }, 200);
  } catch (error) {
    console.error("delete-account", error);
    return c.json({ message: "Failed to delete account" }, 500);
  }
});

export default app;
