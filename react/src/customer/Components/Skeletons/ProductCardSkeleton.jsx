import React from "react";

const ProductCardSkeleton = () => {
  return (
    <div className="w-[10rem] sm:w-[15rem] border m-2 sm:m-3 rounded-lg overflow-hidden bg-white shadow-sm animate-pulse flex flex-col">
      {/* Image Skeleton */}
      <div className="h-[14rem] sm:h-[20rem] bg-gray-200 w-full relative">
        <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gray-300"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-3 sm:p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Brand */}
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          {/* Title */}
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>

        {/* Price row */}
        <div className="flex items-center space-x-2 pt-2">
          <div className="h-4 bg-gray-200 rounded w-12"></div>
          <div className="h-3 bg-gray-200 rounded w-10"></div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
