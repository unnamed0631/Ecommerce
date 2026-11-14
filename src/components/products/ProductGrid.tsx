import { memo, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { StarVotes } from "@/components";
import { motion } from "motion/react";
import { ImageOff } from "lucide-react";
import { imageAt, imageSrcSet, type ImageVariant } from "@/lib/images";
import type { Product as ProductType } from "@/types";
import FlyToCart from "../ui/flyToCart";

const GRID_IMAGE_SOURCES: readonly ImageVariant[] = [
  { width: 256, size: "256.256" },
  { width: 400, size: "400.400" },
  { width: 600, size: "600.600" },
];

const GRID_IMAGE_SIZES =
  "(min-width: 1280px) 18vw, (min-width: 1024px) 22vw, (min-width: 864px) 30vw, 45vw";

const ProductGridCard = memo(function ProductGridCard({ product }: { product: ProductType }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Cached images may finish before React attaches the load listener.
  useEffect(() => {
    const image = imgRef.current;

    if (image?.complete && image.naturalWidth > 0) {
      setImageLoaded(true);
    }
  }, []);

  const discount = Number(product.discount) || 0;
  const effectivePrice =
    discount > 0
      ? Math.round((product.price * (1 - discount / 100) + Number.EPSILON) * 100) / 100
      : product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative overflow-hidden bg-gray-50">
        <Link
          to={`/product/${product._id}`}
          state={{ productData: product }}
          className="relative block aspect-square w-full overflow-hidden bg-gray-100"
        >
          {!imageFailed && (
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 animate-pulse bg-gray-200 transition-opacity duration-300 ${
                imageLoaded ? "opacity-0" : "opacity-100"
              }`}
            />
          )}

          <img
            src={imageAt(product.image, "400.400")}
            srcSet={imageSrcSet(product.image, GRID_IMAGE_SOURCES) || undefined}
            sizes={GRID_IMAGE_SIZES}
            alt={product.title}
            width={400}
            height={400}
            ref={imgRef}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageFailed(true)}
            className={`relative h-full w-full object-cover transition duration-400 group-hover:scale-105 ${
              imageLoaded && !imageFailed ? "opacity-100" : "opacity-0"
            }`}
          />

          {imageFailed && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-100 px-3 text-center text-gray-400">
              <ImageOff className="h-7 w-7" />
              <span className="text-[10px] font-semibold uppercase tracking-wide">
                Image unavailable
              </span>
            </div>
          )}
        </Link>

        <div className="pointer-events-none absolute inset-x-2 top-2 flex items-start justify-between gap-2">
          {product.isNewProduct ? (
            <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
              New
            </span>
          ) : (
            <span />
          )}
          {discount > 0 ? (
            <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              -{discount}%
            </span>
          ) : null}
        </div>
        <FlyToCart product={product} />
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <Link
          to={`/product/${product._id}`}
          state={{ productData: product }}
          className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-text transition-colors hover:text-primary sm:text-base"
        >
          {product.title}
        </Link>

        <div className="mt-1">
          <StarVotes product={product} />
        </div>

        <div className="mt-auto flex flex-wrap items-baseline gap-2 pt-2">
          {discount > 0 ? (
            <>
              <span className="text-sm font-bold text-rose-600 sm:text-base">
                ${effectivePrice}
              </span>
              <span className="text-xs text-gray-400 line-through">${product.price}</span>
            </>
          ) : (
            <span className="text-sm font-bold text-text sm:text-base">${product.price}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default ProductGridCard;
