import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { heroShowcase, heroStats } from "@/data/categories";
import ProductPreviewImage from "./ProductPreviewImage";

const HERO_ACTIONS = [
  {
    to: "/products?tags=Figures",
    label: "Browse all figures",
    Icon: ArrowRight,
    className: "bg-primary text-white shadow-sm hover:bg-primary/90",
  },
  {
    to: "/products?sort=newest",
    label: "New arrivals",
    Icon: ArrowUpRight,
    className:
      "border border-gray-300 bg-white text-gray-700 shadow-sm hover:border-gray-400 hover:bg-gray-50",
  },
] as const;

const HERO_CARD_LAYOUTS = [
  {
    wrapper:
      "absolute right-0 top-0 w-[82%] rotate-1 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl",
    image: "h-60 w-full object-cover",
  },
  {
    wrapper:
      "absolute bottom-0 left-0 w-[74%] -rotate-1 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg",
    image: "h-54 w-full object-cover",
  },
] as const;

const CategoryHero = () => (
  <section className="border-b border-gray-200 bg-white">
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            AniMerch collections
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Anime Figure
            <span className="block text-primary">Categories</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Find your next collection. From dramatic 1/7 scale sculpts to cute and tiny Nendoroids
            and shelf-hogging plushies, every collection starts here.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {HERO_ACTIONS.map(({ to, label, Icon, className }) => (
              <Link
                key={to}
                to={to}
                className={`noEffect inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors ${className}`}
              >
                {label}
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>

          <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
            {heroStats.map((stat) => (
              <div key={stat} className="rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3">
                <p className="text-sm font-semibold text-gray-700">{stat}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Product showcase */}
        <div className="relative mx-auto hidden h-107.5 w-full max-w-md lg:block">
          {heroShowcase.map((feature, i) => {
            const layout = HERO_CARD_LAYOUTS[i];

            return (
              <div key={feature.title} className={layout.wrapper}>
                <div className="relative">
                  <ProductPreviewImage
                    src={feature.image}
                    alt={feature.imageAlt}
                    loading="eager"
                    className={layout.image}
                  />
                  <div className="absolute left-3 top-3 rounded-2xl bg-black/40 backdrop-blur px-3 py-2 shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white">
                      {/*badge*/}
                      {feature.eyebrow}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

export default CategoryHero;
