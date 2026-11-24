import { useEffect, useRef, useState } from "react";
import { ImageOff } from "lucide-react";
import { imageAt, imageSrcSet, type ImageVariant } from "@/lib/images";

export interface ProductImageProps {
  /** Raw catalog URL. CDN links are resized to `size` / `variants`. */
  src: string;
  alt: string;
  /** CDN size token used for the plain `src`, e.g. `"400.400"`. */
  size: string;
  variants?: readonly ImageVariant[];
  sizes?: string;
  width?: number;
  height?: number;
  /** Classes for the wrapper that defines the image box. */
  className?: string;
  /** Extra classes for the `<img>` itself (hover scale, rounding, ...). */
  imgClassName?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  /** Icon-only fallback, for thumbnails too small for the caption. */
  compactFallback?: boolean;
}

interface ImageStatus {
  src: string;
  loaded: boolean;
  failed: boolean;
}

/**
 * Catalog image that never shows a blank box: a pulsing placeholder holds the
 * space until the image decodes, then the image fades in. Failed loads fall
 * back to an explicit "image unavailable" state instead of a broken-image icon.
 */
const ProductImage = ({
  src,
  alt,
  size,
  variants,
  sizes,
  width,
  height,
  className = "",
  imgClassName = "",
  loading = "lazy",
  fetchPriority,
  compactFallback = false,
}: ProductImageProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [status, setStatus] = useState<ImageStatus>({ src, loaded: false, failed: false });

  // A changed `src` (gallery navigation, recycled card) must start from the
  // placeholder again rather than keep the previous image's state.
  const current: ImageStatus = status.src === src ? status : { src, loaded: false, failed: false };

  // Cached images can finish before React attaches the load listener.
  useEffect(() => {
    const image = imgRef.current;

    if (image?.complete && image.naturalWidth > 0) {
      setStatus((previous) =>
        previous.src === src && previous.loaded ? previous : { src, loaded: true, failed: false },
      );
    }
  }, [src]);

  const markLoaded = () => setStatus({ src, loaded: true, failed: false });
  const markFailed = () => setStatus({ src, loaded: false, failed: true });

  const visible = current.loaded && !current.failed;

  return (
    <span className={`relative block overflow-hidden ${className}`}>
      {!current.failed && (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 bg-gray-200 transition-opacity duration-300 ${
            visible ? "opacity-0" : "animate-pulse opacity-100"
          }`}
        />
      )}

      {!current.failed && (
        <img
          ref={imgRef}
          src={imageAt(src, size)}
          srcSet={
            variants && variants.length > 0 ? imageSrcSet(src, variants) || undefined : undefined
          }
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding="async"
          onLoad={markLoaded}
          onError={markFailed}
          className={`relative h-full w-full object-cover transition duration-500 ${
            visible ? "opacity-100" : "opacity-0"
          } ${imgClassName}`}
        />
      )}

      {current.failed && (
        <span
          role="img"
          aria-label={`${alt} — image unavailable`}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-100 px-3 text-center text-gray-400"
        >
          <ImageOff className={compactFallback ? "h-4 w-4" : "h-7 w-7"} />
          {!compactFallback && (
            <span className="text-[10px] font-semibold uppercase tracking-wide">
              Image unavailable
            </span>
          )}
        </span>
      )}
    </span>
  );
};

export default ProductImage;
