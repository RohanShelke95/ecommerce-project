import React from "react";
import ProductCardSkeleton from "./ProductCardSkeleton";

const ProductDetailsSkeleton = () => {
  return (
    <div className="bg-white lg:px-20 px-4 py-8 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex space-x-3 mb-6">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-4"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-4 bg-gray-200 rounded w-4"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>

      {/* Main Product Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery Skeleton */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[30rem] h-[24rem] sm:h-[32rem] bg-gray-200 rounded-lg"></div>
          {/* Thumbnails */}
          <div className="flex space-x-3 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-md"></div>
            ))}
          </div>
        </div>

        {/* Right Column: Product Information Skeleton */}
        <div className="space-y-6">
          {/* Brand & Title */}
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-7 bg-gray-200 rounded w-4/5"></div>
          </div>

          {/* Price Row */}
          <div className="flex items-center space-x-4 pt-2">
            <div className="h-8 bg-gray-200 rounded w-24"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>

          {/* Ratings & Reviews */}
          <div className="flex items-center space-x-3">
            <div className="h-5 bg-gray-200 rounded w-28"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>

          {/* Size Selector Skeleton */}
          <div className="space-y-3 pt-4">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="flex space-x-3">
              {["S", "M", "L", "XL"].map((s) => (
                <div key={s} className="w-12 h-12 bg-gray-200 rounded-md"></div>
              ))}
            </div>
          </div>

          {/* Add to Cart Button Skeleton */}
          <div className="pt-4">
            <div className="h-12 bg-indigo-200 rounded-md w-full sm:w-56"></div>
          </div>

          {/* Description Paragraph Skeleton */}
          <div className="space-y-2 pt-6">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>

      {/* Similar Products Skeleton */}
      <div className="pt-16">
        <div className="h-7 bg-gray-200 rounded w-44 mb-6"></div>
        <div className="flex space-x-4 overflow-hidden">
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

export default ProductDetailsSkeleton;
