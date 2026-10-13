import React from "react";
import ProductCardSkeleton from "./ProductCardSkeleton";

const WishlistSkeleton = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-14 py-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded-md w-48 mb-6"></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div key={item} className="flex justify-center">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistSkeleton;
