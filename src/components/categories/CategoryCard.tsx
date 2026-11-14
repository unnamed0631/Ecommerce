import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { StoreCategory } from "@/data/categories";
import ProductPreviewImage from "./ProductPreviewImage";

interface CategoryCardProps {
  category: StoreCategory;
  priority?: boolean;
}

const CategoryCard = ({ category, priority = false }: CategoryCardProps) => (
  <Link
    to={category.path}
    aria-label={`${category.name} — explore collection`}
    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
  >
    <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
      <ProductPreviewImage
        src={category.image}
        alt={category.imageAlt}
        loading={priority ? "eager" : "lazy"}
        sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />
      <span className="absolute left-4 top-4 rounded-full bg-black/40 text-white backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]">
        {category.badge}
      </span>
    </div>

    <div className="flex flex-1 flex-col p-5">
      <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-gray-600">
        {category.description}
      </p>
      <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-semibold text-primary">
        Explore collection
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </div>
  </Link>
);

export default CategoryCard;
