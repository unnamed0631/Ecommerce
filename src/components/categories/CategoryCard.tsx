import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { StoreCategory } from "@/data/categories";
import ProductPreviewImage from "./ProductPreviewImage";

interface CategoryCardProps {
  category: StoreCategory;
  featured?: boolean;
  priority?: boolean;
}

const CategoryCard = ({ category, featured = false, priority = false }: CategoryCardProps) => (
  <Link
    to={category.path}
    aria-label={`${category.name} — explore collection`}
    className={`group relative overflow-hidden rounded-3xl bg-slate-900 shadow-lg ring-1 ring-slate-900/10 transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${
      featured ? "sm:col-span-2" : ""
    }`}
  >
    <div className={`relative ${featured ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
      <ProductPreviewImage
        src={category.image}
        alt={category.imageAlt}
        loading={priority ? "eager" : "lazy"}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/40 to-slate-950/5" />

      <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
        {category.badge}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <h3 className="text-xl font-bold text-white sm:text-2xl">{category.name}</h3>
        <p className="mt-1.5 line-clamp-2 max-w-md text-sm leading-relaxed text-slate-200/90">
          {category.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white">
          Explore collection
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </div>
  </Link>
);

export default CategoryCard;
