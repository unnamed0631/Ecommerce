import type { ImageVariant } from "@/lib/images";
import ProductImage from "@/components/ui/ProductImage";

const PREVIEW_SOURCES: readonly ImageVariant[] = [
  { width: 400, size: "400.400" },
  { width: 600, size: "600.600" },
  { width: 900, size: "900.900" },
];

interface ProductPreviewImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  loading?: "eager" | "lazy";
}

/**
 * Responsive catalog image for the category artwork: placeholder while it
 * loads, fallback when the CDN fails. Sizing comes from `className`, which
 * styles the wrapper, so callers can position it like they used to.
 */
const ProductPreviewImage = ({
  src,
  alt,
  className = "",
  sizes,
  loading = "lazy",
}: ProductPreviewImageProps) => (
  <ProductImage
    src={src}
    size="600.600"
    variants={PREVIEW_SOURCES}
    sizes={sizes}
    alt={alt}
    loading={loading}
    className={className}
  />
);

export default ProductPreviewImage;
