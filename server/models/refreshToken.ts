import mongoose, { Schema, type Model, type Types } from "mongoose";

export interface RefreshToken {
  tokenHash: string;
  expiresAt: Date;
  userId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  revokedAt?: Date | null;
  replacedBy?: string | null;
}

const refreshTokenSchema = new Schema<RefreshToken>(
  {
    // Only the SHA-256 hex digest of the raw JWT is persisted.
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    revokedAt: { type: Date, default: null },
    // SHA-256 digest of the token that replaced this one, if any.
    replacedBy: { type: String, default: null },
  },
  { timestamps: true },
);

// Let MongoDB remove expired rows; the controller still checks expiresAt.
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshTokenModel: Model<RefreshToken> =
  (mongoose.models.RefreshToken as Model<RefreshToken> | undefined) ??
  mongoose.model<RefreshToken>("RefreshToken", refreshTokenSchema);

export default RefreshTokenModel;
