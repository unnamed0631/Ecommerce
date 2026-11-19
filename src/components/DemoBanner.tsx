import { useState } from "react";
import { X } from "lucide-react";

const DemoBanner = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || import.meta.env.VITE_DEMO_MODE !== "true") {
    return null;
  }

  return (
    <div
      role="status"
      className="flex w-full items-center justify-center gap-3 bg-amber-100 px-4 py-2 text-center text-sm font-medium text-amber-900"
    >
      <p>Demo store — checkout is mocked; no real payment is taken.</p>
      <button
        type="button"
        onClick={() => setIsDismissed(true)}
        aria-label="Dismiss demo notice"
        className="rounded-full p-1 transition-colors hover:bg-amber-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
};

export default DemoBanner;
