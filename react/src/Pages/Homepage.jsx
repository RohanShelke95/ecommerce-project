import React, { useEffect, useState } from "react";
import HomeCarousel from "../customer/Components/Carousel/HomeCarousel";
import { homeCarouselData } from "../customer/Components/Carousel/HomeCaroselData";
import HomeProductSection from "../customer/Components/Home/HomeProductSection";
import HomeProductSectionSkeleton from "../customer/Components/Skeletons/HomeProductSectionSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { findProducts, prefetchCategoryProducts } from "../Redux/Customers/Product/Action";

const HOME_SECTIONS = [
  { key: "mens_kurta", title: "Men's Kurta", lavelOne: "men" },
  { key: "shoes", title: "Men's Shoes", lavelOne: "men" },
  { key: "lengha_choli", title: "Lengha Choli", lavelOne: "women" },
  { key: "saree", title: "Saree", lavelOne: "women" },
  { key: "women_dress", title: "Women's Dresses", lavelOne: "women" },
  { key: "kurtas", title: "Women's Kurtas", lavelOne: "women" },
];

const Homepage = () => {
  const dispatch = useDispatch();
  const { customersProduct } = useSelector((store) => store);
  const [isWarmingUp, setIsWarmingUp] = useState(false);

  useEffect(() => {
    // If any section is not yet loaded in Redux, trigger fetch
    HOME_SECTIONS.forEach(({ key, lavelOne }) => {
      // Background revalidation or initial fetch
      dispatch(
        findProducts({
          category: key,
          colors: [],
          sizes: [],
          minPrice: 0,
          maxPrice: 10000,
          minDiscount: 0,
          sort: "price_low",
          pageNumber: 0,
          pageSize: 10,
          stock: "",
          lavelOne: lavelOne || "",
        })
      );
    });

    // Check if initial categories are missing to show a warm-up indicator if slow
    const hasAnyCategory = HOME_SECTIONS.some(
      (sec) => customersProduct.categoryProducts?.[sec.key]?.length > 0
    );

    if (!hasAnyCategory) {
      const timer = setTimeout(() => {
        setIsWarmingUp(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [dispatch]);

  // Pre-warm other top navigation categories during idle time for 0ms clicks
  useEffect(() => {
    const idleTimer = setTimeout(() => {
      const popularCategories = [
        { key: "top", lavelOne: "women" },
        { key: "women_jeans", lavelOne: "women" },
        { key: "shirt", lavelOne: "men" },
        { key: "men_jeans", lavelOne: "men" },
        { key: "sweater", lavelOne: "women" },
      ];
      popularCategories.forEach(({ key, lavelOne }) => {
        dispatch(prefetchCategoryProducts(key, lavelOne));
      });
    }, 1500);

    return () => clearTimeout(idleTimer);
  }, [dispatch]);

  // Turn off warm up indicator once products arrive
  useEffect(() => {
    const hasAnyCategory = HOME_SECTIONS.some(
      (sec) => customersProduct.categoryProducts?.[sec.key]?.length > 0
    );
    if (hasAnyCategory) {
      setIsWarmingUp(false);
    }
  }, [customersProduct.categoryProducts]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <HomeCarousel images={homeCarouselData} />

      {/* Gentle notice if Render server is cold-starting for the first time */}
      {isWarmingUp && (
        <div className="mx-4 sm:mx-8 lg:mx-16 my-4 p-3 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs sm:text-sm rounded-lg flex items-center justify-between shadow-sm animate-pulse">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-ping inline-block"></span>
            <span>Connecting to live store database. Products will appear in just a few seconds...</span>
          </div>
        </div>
      )}

      <div className="space-y-6 sm:space-y-10 py-6 sm:py-10 lg:py-14">
        {HOME_SECTIONS.map((section) => {
          const items = customersProduct.categoryProducts?.[section.key];
          if (items && items.length > 0) {
            return (
              <HomeProductSection
                key={section.key}
                data={items}
                section={section.title}
              />
            );
          }
          // While loading or before response, render modern skeleton
          return (
            <HomeProductSectionSkeleton
              key={section.key}
              sectionTitle={section.title}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Homepage;
