import { Fragment, useState, useEffect } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
} from "@heroicons/react/20/solid";
import Pagination from "@mui/material/Pagination";
import TextField from "@mui/material/TextField";
import { Backdrop, CircularProgress } from "@mui/material";

import { filters as fallbackFilters, sortOptions } from "./FilterData";
import { buildDynamicFilters } from "./filterUtils";
import ProductFiltersPanel from "./ProductFiltersPanel";
import ProductCard from "../ProductCard/ProductCard";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchProductsPage } from "../../../../Redux/Customers/Product/Action";
import api from "../../../../config/api";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SearchProduct() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { customersProduct } = useSelector((store) => store);
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const qParam = queryParams.get("q") || "";
  const colorValue = queryParams.get("color");
  const sizeValue = queryParams.get("size");
  const price = queryParams.get("price");
  const disccount = queryParams.get("disccout");
  const sortValue = queryParams.get("sort");
  const pageNumber = queryParams.get("page") || 1;
  const stock = queryParams.get("stock");

  const [searchVal, setSearchVal] = useState(qParam);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [priceBounds, setPriceBounds] = useState({ min: 0, max: 100000 });
  const [dynamicFilters, setDynamicFilters] = useState(fallbackFilters);
  const [filtersLoading, setFiltersLoading] = useState(false);

  useEffect(() => {
    setSearchVal(qParam);
  }, [qParam]);

  useEffect(() => {
    const fetchFilters = async () => {
      if (!qParam.trim()) {
        setDynamicFilters(fallbackFilters);
        setPriceBounds({ min: 0, max: 100000 });
        return;
      }

      setFiltersLoading(true);
      try {
        const { data } = await api.get("/api/products/search/filters", {
          params: { q: qParam },
        });

        setDynamicFilters(buildDynamicFilters(data));
        setPriceBounds({
          min: data.minPrice || 0,
          max: data.maxPrice || 100000,
        });

        if (!price) {
          setPriceRange([data.minPrice || 0, data.maxPrice || 100000]);
        }
      } catch (error) {
        setDynamicFilters(fallbackFilters);
      } finally {
        setFiltersLoading(false);
      }
    };

    fetchFilters();
  }, [qParam, price]);

  useEffect(() => {
    if (price) {
      const [minPrice, maxPrice] = price.split("-").map(Number);
      setPriceRange([minPrice, maxPrice]);
    } else {
      setPriceRange([priceBounds.min, priceBounds.max]);
    }
  }, [price, priceBounds.min, priceBounds.max]);

  useEffect(() => {
    if (!qParam.trim()) {
      return;
    }

    const [minPrice, maxPrice] =
      price === null ? [0, 0] : price.split("-").map(Number);

    dispatch(
      searchProductsPage({
        q: qParam,
        colors: colorValue || [],
        sizes: sizeValue || [],
        minPrice: minPrice || 0,
        maxPrice: maxPrice || 100000,
        minDiscount: disccount || 0,
        sort: sortValue || "price_low",
        pageNumber: pageNumber - 1,
        pageSize: 10,
        stock: stock,
      })
    );
  }, [
    qParam,
    colorValue,
    sizeValue,
    price,
    disccount,
    sortValue,
    pageNumber,
    stock,
    dispatch,
  ]);

  useEffect(() => {
    setIsLoaderOpen(customersProduct.loading);
  }, [customersProduct.loading]);

  const updateSearchParams = (updater) => {
    const searchParams = new URLSearchParams(location.search);
    updater(searchParams);
    navigate({ search: `?${searchParams.toString()}` });
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchVal(val);
    updateSearchParams((searchParams) => {
      if (val) {
        searchParams.set("q", val);
      } else {
        searchParams.delete("q");
      }
      searchParams.delete("page");
    });
  };

  const handleSortChange = (value) => {
    updateSearchParams((searchParams) => {
      searchParams.set("sort", value);
    });
  };

  const handlePaginationChange = (event, value) => {
    updateSearchParams((searchParams) => {
      searchParams.set("page", value);
    });
  };

  const handleFilter = (value, sectionId) => {
    updateSearchParams((searchParams) => {
      const currentValue = searchParams.get(sectionId);
      let filterValues = currentValue ? currentValue.split(",") : [];

      if (filterValues.includes(value)) {
        filterValues = filterValues.filter((item) => item !== value);
      } else {
        filterValues.push(value);
      }

      if (filterValues.length > 0) {
        searchParams.set(sectionId, filterValues.join(","));
      } else {
        searchParams.delete(sectionId);
      }
      searchParams.delete("page");
    });
  };

  const handleRadioFilterChange = (e, sectionId) => {
    updateSearchParams((searchParams) => {
      searchParams.set(sectionId, e.target.value);
      searchParams.delete("page");
    });
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handlePriceCommit = (event, newValue) => {
    updateSearchParams((searchParams) => {
      searchParams.set("price", `${newValue[0]}-${newValue[1]}`);
      searchParams.delete("page");
    });
  };

  const filterPanelProps = {
    dynamicFilters,
    filtersLoading,
    colorValue,
    sizeValue,
    disccount,
    stock,
    priceRange,
    priceBounds,
    onFilter: handleFilter,
    onPriceChange: handlePriceChange,
    onPriceCommit: handlePriceCommit,
    onRadioFilterChange: handleRadioFilterChange,
  };

  const searchResults = customersProduct.searchResults;
  const resultItems = searchResults?.content || [];

  return (
    <div className="bg-white -z-20 ">
      <div>
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  <ProductFiltersPanel
                    {...filterPanelProps}
                    className="mt-4 border-t border-gray-200 px-4"
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="mx-auto px-4 lg:px-14 ">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              {qParam ? `Results for "${qParam}"` : "Search Products"}
            </h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <p
                              onClick={() => handleSortChange(option.query)}
                              className={classNames(
                                sortValue === option.query
                                  ? "font-medium text-gray-900"
                                  : "text-gray-500",
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm cursor-pointer"
                              )}
                            >
                              {option.name}
                            </p>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <div>
              <div className="mb-6">
                <TextField
                  id="search-product-input"
                  label="Search products..."
                  variant="outlined"
                  fullWidth
                  value={searchVal}
                  onChange={handleSearch}
                />
              </div>

              <h2 className="py-5 font-semibold opacity-60 text-lg">Filters</h2>
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
                <ProductFiltersPanel {...filterPanelProps} />

                <div className="lg:col-span-4 w-full">
                  <div className="flex flex-wrap justify-center bg-white border py-5 rounded-md min-h-[50vh]">
                    {resultItems.length > 0 ? (
                      resultItems.map((item) => (
                        <ProductCard key={item.id} product={item} />
                      ))
                    ) : (
                      <div className="w-full flex flex-col items-center justify-center py-20 px-4 text-center">
                        <svg
                          className="w-16 h-16 text-gray-400 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        <h3 className="text-xl font-bold text-gray-700 mb-1">
                          {qParam ? "No Results Found" : "Start Searching"}
                        </h3>
                        <p className="text-gray-500 text-sm max-w-xs">
                          {qParam
                            ? "We couldn't find any products matching your search and filters. Try adjusting the filters or search term."
                            : "Type a product name, category, or brand to begin."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {searchResults?.totalPages > 1 && (
          <section className="w-full px-4 sm:px-[3.6rem]">
            <div className="mx-auto px-2 sm:px-4 py-5 flex justify-center shadow-lg border rounded-md">
              <Pagination
                count={searchResults.totalPages}
                page={Number(pageNumber)}
                color="primary"
                onChange={handlePaginationChange}
                size="small"
                sx={{
                  "& .MuiPagination-ul": {
                    flexWrap: "wrap",
                    justifyContent: "center",
                  },
                }}
              />
            </div>
          </section>
        )}

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoaderOpen}
          onClick={() => setIsLoaderOpen(false)}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </div>
  );
}
