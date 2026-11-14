import { useState } from "react";
import { ImageOff } from "lucide-react";
import { imageAt, imageSrcSet, type ImageVariant } from "@/lib/images";

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

/** Responsive catalog image with a graceful fallback when the CDN fails. */
const ProductPreviewImage = ({
  src,
  alt,
  className = "",
  sizes,
  loading = "lazy",
}: ProductPreviewImageProps) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        aria-hidden="true"
        className={`${className} flex items-center justify-center bg-slate-800 text-slate-500`}
      >
        <ImageOff className="h-8 w-8" />
      </div>
    );
  }

  return (
    <img
      src={imageAt(src, "600.600")}
      srcSet={imageSrcSet(src, PREVIEW_SOURCES) || undefined}
      sizes={sizes}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};

export default ProductPreviewImage;
