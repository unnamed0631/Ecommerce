import { BuyingGuide, CategoryCard, CategoryHero, SeriesShortcuts } from "@/components/categories";
import SectionHeading from "@/components/ui/SectionHeading";
import { storeCategories } from "@/data/categories";

const Categories = () => (
  <div className="min-h-screen bg-background">
    <CategoryHero />

    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <SectionHeading eyebrow="Explore the vault" title="Pick your figure flavour" />

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {storeCategories.map((category, index) => (
          <CategoryCard
            key={category.name}
            category={category}
            featured={index === 0}
            priority={index < 3}
          />
        ))}
      </div>
    </section>

    <SeriesShortcuts />
    <BuyingGuide />
  </div>
);

export default Categories;
