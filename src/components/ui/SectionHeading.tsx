interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  /** `split` places the description beside the title; `stacked` keeps it below. */
  variant?: "split" | "stacked";
}

const heading = (title: string, eyebrow?: string) => (
  <div>
    {eyebrow && (
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
        {eyebrow}
      </p>
    )}
    <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
      {title}
    </h2>
  </div>
);

const SectionHeading = ({
  eyebrow,
  title,
  description,
  variant = "split",
}: SectionHeadingProps) => {
  if (variant === "stacked") {
    return (
      <div className="max-w-2xl">
        {heading(title, eyebrow)}
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-gray-500 sm:text-base">{description}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      {heading(title, eyebrow)}
      {description ? (
        <p className="max-w-md text-sm leading-relaxed text-gray-500">{description}</p>
      ) : null}
    </div>
  );
};

export default SectionHeading;
