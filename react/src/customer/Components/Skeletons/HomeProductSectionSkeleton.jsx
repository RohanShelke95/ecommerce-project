import React from "react";
import ProductCardSkeleton from "./ProductCardSkeleton";

const HomeProductSectionSkeleton = ({ sectionTitle = "Featured Products" }) => {
  return (
    <div className="relative px-2 sm:px-6 lg:px-8">
      {/* Title skeleton */}
      <div className="py-3 sm:py-5 flex items-center space-x-3">
        <div className="h-6 sm:h-7 bg-gray-200 rounded-md w-40 sm:w-52 animate-pulse"></div>
        <div className="h-4 bg-gray-100 rounded-full w-16 animate-pulse"></div>
      </div>

      {/* Carousel card strip skeleton */}
      <div className="relative border p-3 sm:p-5 rounded-md bg-white overflow-hidden shadow-sm">
        <div className="flex space-x-3 sm:space-x-5 overflow-hidden">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex-shrink-0">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeProductSectionSkeleton;
