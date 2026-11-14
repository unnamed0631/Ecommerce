import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { figureSeries } from "@/data/categories";
import SectionHeading from "@/components/ui/SectionHeading";

const SeriesShortcuts = () => (
  <section className="border-y border-slate-200 bg-white py-14 lg:py-16">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading title="Browse by series" />

      <div className="mt-8 flex flex-wrap gap-3">
        {figureSeries.map((series) => (
          <Link
            key={series.name}
            to={series.path}
            className="noEffect group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-primary/30 hover:bg-blue-50 hover:text-primary"
          >
            <span className="h-2 w-2 rounded-full bg-primary transition-transform group-hover:scale-125" />
            {series.name}
            <ArrowUpRight className="h-3.5 w-3.5 text-gray-400 transition-colors group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default SeriesShortcuts;
