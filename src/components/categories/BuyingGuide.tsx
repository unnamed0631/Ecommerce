import { Link } from "react-router-dom";
import { ArrowRight, CalendarClock, Ruler, Sparkles, type LucideIcon } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

interface BuyingTip {
  title: string;
  body: string;
  Icon: LucideIcon;
}

const BUYING_TIPS: readonly BuyingTip[] = [
  {
    title: "Know your scale",
    body: "1/7 scale is the collector sweet spot. 1/4 and 1/6 pieces make bigger statements, while non-scale figures are easier on shelf space.",
    Icon: Ruler,
  },
  {
    title: "Chibi or scale?",
    body: "Nendoroids and chibi figures trade realism for personality. Scale figures go all-in on sculpt, costume detail and dramatic bases.",
    Icon: Sparkles,
  },
  {
    title: "Pre-orders & releases",
    body: "Popular figures sell out before release. Secure a pre-order early, then keep an eye on restocks and limited re-releases.",
    Icon: CalendarClock,
  },
];

const BuyingGuide = () => (
  <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
    <SectionHeading
      title="New to the site?"
      description="Three quick things to know before your first pre-order."
      variant="stacked"
    />

    <div className="mt-8 grid gap-4 md:grid-cols-3">
      {BUYING_TIPS.map(({ title, body, Icon }) => (
        <article
          key={title}
          className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-primary">
            <Icon className="h-5 w-5" />
          </span>
          <h3 className="mt-5 text-lg font-bold text-gray-900">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">{body}</p>
        </article>
      ))}
    </div>

    <div className="mt-12 flex flex-col gap-6 rounded-3xl border border-gray-200 bg-white px-6 py-10 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-12">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          Can't pick a favourite?
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-500">
          Browse the full catalog and let the shelf decide. New figures land every week.
        </p>
      </div>
      <Link
        to="/products"
        className="noEffect inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
      >
        Browse all products
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  </section>
);

export default BuyingGuide;
