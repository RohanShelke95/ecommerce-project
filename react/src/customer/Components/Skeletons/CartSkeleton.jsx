import React from "react";

const CartSkeleton = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-16 animate-pulse py-6">
      <div className="lg:grid grid-cols-3 gap-6">
        {/* Cart items column */}
        <div className="lg:col-span-2 space-y-4 mb-6 lg:mb-0">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-5 shadow-sm border rounded-md bg-white flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-5 items-start">
              {/* Product Image placeholder */}
              <div className="w-[5rem] h-[5rem] sm:w-[9rem] sm:h-[9rem] bg-gray-200 rounded-md flex-shrink-0"></div>

              {/* Product Details placeholder */}
              <div className="flex-1 space-y-3 w-full">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="flex items-center space-x-3 pt-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Price Summary column */}
        <div className="border p-5 bg-white shadow-sm rounded-md space-y-4 h-fit">
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
          <hr className="border-gray-200" />
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
          <hr className="border-gray-200" />
          <div className="h-10 bg-indigo-200 rounded-md w-full mt-4"></div>
        </div>
      </div>
    </div>
  );
};

export default CartSkeleton;
