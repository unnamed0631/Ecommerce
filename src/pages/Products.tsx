import {
  useCallback,
  useContext,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Pagination } from "@/components";
import { ProductCardSkeleton } from "@/components/ui/skeletons";
import { Search, X } from "lucide-react";
import { ProductsContext } from "@/context/ProductsContext";
import { Searchbar, SideSearchBar, ProductGridCard } from "@/components/products";

const Product = () => {
  const { page = "1" } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q")?.trim() ?? "";
  const sortParam = searchParams.get("sort")?.trim() ?? "";
  const tagsParam = searchParams.get("tags")?.trim() ?? "";
  const [filters, setFilters] = useState<Record<string, string>>({});

  const {
    products,
    productsLoading,
    totalPages,
    totalProducts,
    notFound,
    loadProducts,
    filterProducts,
  } = useContext(ProductsContext);

  const currentPage = parseInt(page, 10);

  useEffect(() => {
    const params: Record<string, string> = {};

    if (searchQuery) params.q = searchQuery;
    if (sortParam) params.sort = sortParam;
    if (tagsParam) params.tags = tagsParam;

    void loadProducts(currentPage, params);
  }, [currentPage, loadProducts, searchQuery, sortParam, tagsParam]);

  const handleSortChange = useCallback(
    (sort: string) => {
      const params = new URLSearchParams(searchParams);

      if (sort) {
        params.set("sort", sort);
      } else {
        params.delete("sort");
      }

      const queryString = params.toString();
      void navigate(queryString ? `/products?${queryString}` : "/products", { replace: true });
    },
    [navigate, searchParams],
  );

  const handleSearch = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      const params = new URLSearchParams(searchParams);

      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }

      const queryString = params.toString();
      void navigate(queryString ? `/products?${queryString}` : "/products", { replace: true });

      // Navigating to the same URL does not retrigger the data effect.
      if (trimmed && trimmed === searchQuery && currentPage === 1) {
        const replay: Record<string, string> = { q: trimmed };

        if (sortParam) replay.sort = sortParam;
        if (tagsParam) replay.tags = tagsParam;

        void loadProducts(1, replay);
      }
    },
    [currentPage, loadProducts, navigate, searchParams, searchQuery, sortParam, tagsParam],
  );

  const handleClear = useCallback(() => {
    const params = new URLSearchParams(searchParams);

    if (!params.has("q")) return;

    params.delete("q");
    const queryString = params.toString();
    void navigate(queryString ? `/products?${queryString}` : "/products", { replace: true });
  }, [navigate, searchParams]);

  const handleClearTags = useCallback(() => {
    const params = new URLSearchParams(searchParams);

    if (!params.has("tags")) return;

    params.delete("tags");
    const queryString = params.toString();
    void navigate(queryString ? `/products?${queryString}` : "/products", { replace: true });
  }, [navigate, searchParams]);

  const handleFilterChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const merged = {
      ...Object.fromEntries(searchParams.entries()),
      ...filters,
      [name]: `0,${value}`,
    };
    const queryString = new URLSearchParams(merged).toString();
    void filterProducts(Object.fromEntries(new URLSearchParams(queryString)));
  };

  const handleCustomPrice = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const minPrice = (form.elements.namedItem("minPrice") as HTMLInputElement).value;
    const maxPrice = (form.elements.namedItem("maxPrice") as HTMLInputElement).value;
    if (minPrice || maxPrice) setFilters({ ...filters, price: `${minPrice},${maxPrice}` });
  };

  return (
    <div className="min-h-screen bg-background pb-12 sm:pb-16">
      <div className="mx-auto w-full max-w-[1600px] px-4 pt-6 sm:px-6 lg:px-10">
        <h1 className="sr-only">Products</h1>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="min-w-0 flex-1">
            <Searchbar
              searchQuery={searchQuery}
              sortParam={sortParam}
              onSearch={handleSearch}
              onClear={handleClear}
              onSortChange={handleSortChange}
            />

            {tagsParam && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 py-1.5 pl-3.5 pr-1.5 text-sm font-semibold text-indigo-700 ring-1 ring-indigo-100">
                  Category: {tagsParam}
                  <button
                    type="button"
                    onClick={handleClearTags}
                    aria-label="Clear category filter"
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-indigo-500 transition-colors hover:bg-indigo-100 hover:text-indigo-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              </div>
            )}

            {/*products*/}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
              {productsLoading
                ? Array.from({ length: 10 }, (_, index) => <ProductCardSkeleton key={index} />)
                : products?.map((p) => <ProductGridCard key={p.id} product={p} />)}

              {notFound && (
                <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
                    <Search className="h-6 w-6" />
                  </span>
                  <h2 className="mt-4 text-lg font-semibold text-text">No products found</h2>
                  <p className="mt-1 max-w-sm text-sm text-gray-500">
                    {searchQuery
                      ? `We couldn't find anything for “${searchQuery}”.`
                      : "Try adjusting your filters or browse the full catalog."}
                  </p>
                  <Link
                    to="/products"
                    className="mt-5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                  >
                    Browse all products
                  </Link>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination pages={totalPages} page={currentPage} />
              </div>
            )}
          </div>

          <div className="hidden lg:block">
            <SideSearchBar
              onFilterChange={handleFilterChange}
              onSubmit={handleCustomPrice}
              productsLength={totalProducts}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
