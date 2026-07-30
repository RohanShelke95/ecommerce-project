import { Fragment, useState } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Pagination from "@mui/material/Pagination";
import Slider from "@mui/material/Slider";
import Tooltip from "@mui/material/Tooltip";

import { filters as fallbackFilters, singleFilter, sortOptions } from "./FilterData";
import { buildDynamicFilters, formatCategoryTitle, isFilterSelected } from "./filterUtils";
import ProductCard from "../ProductCard/ProductCard";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  findProducts,
} from "../../../../Redux/Customers/Product/Action";
import { Backdrop, CircularProgress } from "@mui/material";
import api from "../../../../config/api";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Product() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const param = useParams();
  const { customersProduct } = useSelector((store) => store);
  const location = useLocation();
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);

  const handleLoderClose = () => {
    setIsLoaderOpen(false);
  };

  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [priceBounds, setPriceBounds] = useState({ min: 0, max: 100000 });
  const [dynamicFilters, setDynamicFilters] = useState(fallbackFilters);
  const [filtersLoading, setFiltersLoading] = useState(false);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handlePriceCommit = (event, newValue) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("price", `${newValue[0]}-${newValue[1]}`);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  // const filter = decodeURIComponent(location.search);
  const decodedQueryString = decodeURIComponent(location.search);
  const searchParams = new URLSearchParams(decodedQueryString);
  const colorValue = searchParams.get("color");
  const sizeValue = searchParams.get("size");
  const price = searchParams.get("price");
  const disccount = searchParams.get("disccout");
  const sortValue = searchParams.get("sort");
  const pageNumber = searchParams.get("page") || 1;
  const stock = searchParams.get("stock");

  useEffect(() => {
    const fetchFilters = async () => {
      if (!param.lavelThree) {
        return;
      }

      setFiltersLoading(true);
      try {
        const { data } = await api.get("/api/products/filters", {
          params: {
            category: param.lavelThree,
            lavelOne: param.lavelOne || "",
          },
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
  }, [param.lavelThree, param.lavelOne, price]);

  useEffect(() => {
    if (price) {
      const [minPrice, maxPrice] = price.split("-").map(Number);
      setPriceRange([minPrice, maxPrice]);
    } else {
      setPriceRange([priceBounds.min, priceBounds.max]);
    }
  }, [price, priceBounds.min, priceBounds.max]);

  const renderFilterOptions = (section, isMobile = false) => {
    if (section.id === "color") {
      const hasOnlyCssColors = section.options.every((option) => option.isCssColor);

      if (hasOnlyCssColors) {
        return (
          <div className="flex flex-wrap gap-3">
            {section.options.map((option) => (
              <Tooltip title={option.label} key={option.value}>
                <div
                  onClick={() => handleFilter(option.value, section.id)}
                  className={`w-8 h-8 rounded-full cursor-pointer shadow-sm border-2 ${
                    isFilterSelected(colorValue, option.value)
                      ? "border-indigo-600 ring-2 ring-indigo-200"
                      : "border-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      option.value.toLowerCase() === "white" ? "#f8f9fa" : option.value.toLowerCase(),
                  }}
                ></div>
              </Tooltip>
            ))}
          </div>
        );
      }
    }

    return (
      <div className={isMobile ? "space-y-6" : "space-y-4"}>
        {section.options.map((option, optionIdx) => (
          <div key={option.value} className="flex items-center">
            <input
              id={`filter-${isMobile ? "mobile-" : ""}${section.id}-${optionIdx}`}
              name={`${section.id}[]`}
              value={option.value}
              type="checkbox"
              checked={isFilterSelected(
                section.id === "color" ? colorValue : sizeValue,
                option.value
              )}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              onChange={() => handleFilter(option.value, section.id)}
            />
            <label
              htmlFor={`filter-${isMobile ? "mobile-" : ""}${section.id}-${optionIdx}`}
              className={`ml-3 min-w-0 flex-1 ${isMobile ? "text-gray-500" : "text-sm text-gray-600"}`}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    );
  };

  // console.log("location - ", colorValue, sizeValue,price,disccount);

  const handleSortChange = (value) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("sort", value);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };
  const handlePaginationChange = (event, value) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", value);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  useEffect(() => {
    const [minPrice, maxPrice] =
      price === null ? [0, 0] : price.split("-").map(Number);
    const data = {
      category: param.lavelThree,
      lavelOne: param.lavelOne, // Pass top-level category (men/women/kids)
      colors: colorValue || [],
      sizes: sizeValue || [],
      minPrice: minPrice || 0,
      maxPrice: maxPrice || 100000,
      minDiscount: disccount || 0,
      sort: sortValue || "price_low",
      pageNumber: pageNumber - 1,
      pageSize: 10,
      stock: stock,
    };
    dispatch(findProducts(data));
  }, [
    param.lavelThree,
    param.lavelOne,
    colorValue,
    sizeValue,
    price,
    disccount,
    sortValue,
    pageNumber,
    stock,
  ]);

  useEffect(() => {
    console.log("Category Param:", param.lavelThree);
    console.log("Products in State:", customersProduct?.products);
  }, [customersProduct.products, param.lavelThree]);

  const handleFilter = (value, sectionId) => {
    const searchParams = new URLSearchParams(location.search);
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

    navigate({ search: `?${searchParams.toString()}` });
  };

  const isColorSelected = (colorValueParam, color) => {
    return isFilterSelected(colorValueParam, color);
  };

  const handleRadioFilterChange = (e, sectionId) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(sectionId, e.target.value);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  useEffect(() => {
    if (customersProduct.loading) {
      setIsLoaderOpen(true);
    } else {
      setIsLoaderOpen(false);
    }
  }, [customersProduct.loading]);

  return (
    <div className="bg-white -z-20 ">
      <div>
        {/* Mobile filter dialog */}
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
                    <h2 className="text-lg font-medium text-gray-900">
                      Filters
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}
                  <form className="mt-4 border-t border-gray-200">
                    {dynamicFilters.map((section) => (
                      <Disclosure
                        as="div"
                        key={section.id}
                        className="border-t border-gray-200 px-4 py-6"
                        // open={false}
                      >
                        {({ open }) => (
                          <>
                            <h3 className="-mx-2 -my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900">
                                  {section.name}
                                </span>
                                <span className="ml-6 flex items-center">
                                  {open ? (
                                    <MinusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <PlusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              {renderFilterOptions(section, true)}
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    ))}
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="mx-auto px-4 lg:px-14 ">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              {formatCategoryTitle(param.lavelThree)}
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
                                option.current
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
                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
              >
                <span className="sr-only">View grid</span>
                <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div>
              <h2 className="py-5 font-semibold opacity-60 text-lg">Filters</h2>
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
                {/* Filters */}
                <form className="hidden lg:block border rounded-md p-5">
                  {filtersLoading && (
                    <p className="text-sm text-gray-500 pb-4">Loading filters...</p>
                  )}
                  {dynamicFilters.map((section) => (
                    <Disclosure
                      // defaultOpen={false}
                      as="div"
                      key={section.id}
                      className="border-b border-gray-200 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                {section.name}
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            {renderFilterOptions(section)}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                  {singleFilter.map((section) => (
                    <Disclosure
                      // defaultOpen={true}
                      as="div"
                      key={section.id}
                      className="border-b border-gray-200 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                {section.name}
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            {section.id === "price" ? (
                              <div className="px-3">
                                <Slider
                                  value={priceRange}
                                  onChange={handlePriceChange}
                                  onChangeCommitted={handlePriceCommit}
                                  valueLabelDisplay="auto"
                                  min={priceBounds.min}
                                  max={priceBounds.max}
                                  step={500}
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                  <span>₹{priceBounds.min.toLocaleString()}</span>
                                  <span>₹{priceBounds.max.toLocaleString()}</span>
                                </div>
                              </div>
                            ) : (
                              <FormControl>
                                <RadioGroup
                                  aria-labelledby="demo-radio-buttons-group-label"
                                  defaultValue="female"
                                  name="radio-buttons-group"
                                >
                                  {section.options.map((option, optionIdx) => (
                                    <FormControlLabel
                                      key={option.value}
                                      value={option.value}
                                      control={<Radio />}
                                      label={option.label}
                                      onChange={(e) =>
                                        handleRadioFilterChange(e, section.id)
                                      }
                                    />
                                  ))}
                                </RadioGroup>
                              </FormControl>
                            )}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </form>

                {/* Product grid */}
                <div className="lg:col-span-4 w-full">
                  <div className="flex flex-wrap justify-center bg-white border py-5 rounded-md min-h-[50vh]">
                    {customersProduct?.products?.content?.length > 0 ? (
                      customersProduct?.products?.content?.map((item, index) => {
                        console.log(`Drawing saree #${index + 1}:`, item.title);
                        return <ProductCard key={item.id} product={item} />;
                      })
                    ) : (
                      <div className="w-full flex flex-col items-center justify-center py-20 px-4 text-center">
                        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-bold text-gray-700 mb-1">No Products Available</h3>
                        <p className="text-gray-500 text-sm max-w-xs">We couldn't find any products in this category at the moment. Please check back later!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* pagination section */}
        <section className="w-full px-4 sm:px-[3.6rem]">
          <div className="mx-auto px-2 sm:px-4 py-5 flex justify-center shadow-lg border rounded-md">
            <Pagination
              count={customersProduct.products?.totalPages}
              color="primary"
              className=""
              onChange={handlePaginationChange}
              size="small"
              sx={{
                "& .MuiPagination-ul": {
                  flexWrap: "wrap",
                  justifyContent: "center",
                }
              }}
            />
          </div>
        </section>

        {/* {backdrop} */}
        <section>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoaderOpen}
            onClick={handleLoderClose}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </section>
      </div>
    </div>
  );
}
