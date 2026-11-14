import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { ArrowUpDown, Search, X } from "lucide-react";

const SORT_OPTIONS = [
  { value: "", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top rated" },
  { value: "asc", label: "Price: low to high" },
  { value: "desc", label: "Price: high to low" },
];

const SEARCH_DEBOUNCE_MS = 400;

interface ProductToolbarProps {
  searchQuery: string;
  sortParam: string;
  onSearch: (query: string) => void;
  onClear: () => void;
  onSortChange: (sort: string) => void;
}

const Searchbar = memo(function ProductToolbar({
  searchQuery,
  sortParam,
  onSearch,
  onClear,
  onSortChange,
}: ProductToolbarProps) {
  const [value, setValue] = useState(searchQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelDebounce = useCallback(() => {
    if (debounceRef.current !== null) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }, []);

  // Keep the field in sync with external URL changes (back/forward, submit, clear).
  useEffect(() => {
    cancelDebounce();
    setValue(searchQuery);
  }, [cancelDebounce, searchQuery]);

  useEffect(() => cancelDebounce, [cancelDebounce]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    cancelDebounce();

    const nextQuery = nextValue.trim();
    if (nextQuery === searchQuery) return;

    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      onSearch(nextQuery);
    }, SEARCH_DEBOUNCE_MS);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    cancelDebounce();
    onSearch(value.trim());
  };

  const handleClear = () => {
    cancelDebounce();
    setValue("");
    onClear();
  };

  return (
    <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
      {/* featured dropdown */}
      <label className="relative col-span-1 flex items-center">
        <span className="sr-only">Sort products</span>
        <ArrowUpDown
          className="pointer-events-none absolute left-3 h-4 w-4 text-gray-400"
          aria-hidden="true"
        />
        <select
          value={sortParam}
          onChange={(event) => onSortChange(event.target.value)}
          className="w-full cursor-pointer appearance-none rounded-2xl border border-gray-200 bg-white py-3 pl-9 pr-9 text-sm font-medium text-gray-700 shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      {/*search bar*/}
      <form
        onSubmit={handleSubmit}
        role="search"
        className="col-span-2 w-full flex-1 lg:col-span-3"
      >
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={value}
            onChange={handleChange}
            placeholder="Search products..."
            aria-label="Search products"
            autoComplete="off"
            className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-32 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 [&::-webkit-search-cancel-button]:hidden"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="absolute right-24 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
});

export default Searchbar;
