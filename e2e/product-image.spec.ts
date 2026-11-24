import { test, expect, type Page } from "@playwright/test";
import type { Product } from "../src/types";
import { mockProductsApi } from "./helpers";

// Real CDN URL so the request can be intercepted and delayed; the fixture in
// helpers.ts uses a data URI that decodes before the placeholder can be seen.
const slowImage = "https://resize.cdn.otakumode.com/ex/500.600/shop/product/slow.jpg";

const slowProduct: Product = {
  _id: "6adc50615c949c7a1efaa3c9",
  id: "slow-product",
  title: "Slow Loading Figure",
  price: 59.99,
  discount: null,
  image: slowImage,
  moreImages: [],
  tags: ["figure"],
  inStock: true,
  isNewProduct: false,
  ratings: [{ stars: 4, count: 3 }],
  description: { body1: "Loads slowly on purpose.", body2: "" },
};

const svgBody =
  "<svg xmlns='http://www.w3.org/2000/svg' width='500' height='600'><rect width='500' height='600' fill='#a5b4fc'/></svg>";

const delayImages = async (page: Page, delayMs: number): Promise<void> => {
  await page.route(/^https:\/\/resize\.cdn\.otakumode\.com\//, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    await route.fulfill({ status: 200, contentType: "image/svg+xml", body: svgBody });
  });
};

test.describe("product image placeholder", () => {
  test("holds the space with a placeholder until the image decodes", async ({ page }) => {
    await mockProductsApi(page, [slowProduct]);
    await delayImages(page, 1500);

    await page.goto("/");

    const image = page.locator(`img[alt="${slowProduct.title}"]`).first();
    const placeholder = page
      .locator(`a[href="/product/${slowProduct._id}"] .animate-pulse`)
      .first();

    await expect(image).toHaveCSS("opacity", "0");
    await expect(placeholder).toBeVisible();

    await expect(image).toHaveCSS("opacity", "1", { timeout: 10_000 });
    await expect(placeholder).toHaveCount(0);
  });

  test("shows an explicit fallback when the image fails", async ({ page }) => {
    await mockProductsApi(page, [slowProduct]);
    await page.route(/^https:\/\/resize\.cdn\.otakumode\.com\//, (route) =>
      route.fulfill({ status: 500, body: "" }),
    );

    await page.goto("/");

    await expect(page.getByRole("img", { name: /image unavailable/i }).first()).toBeVisible();
    await expect(page.getByText("Image unavailable").first()).toBeVisible();
  });
});
