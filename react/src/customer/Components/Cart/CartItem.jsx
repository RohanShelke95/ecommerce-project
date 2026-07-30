import React from "react";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { removeCartItem, updateCartItem } from "../../../Redux/Customers/Cart/Action";
import { IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const CartItem = ({ item, showButton }) => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  const handleRemoveItemFromCart = () => {
    const data = { cartItemId: item?.id, jwt };
    dispatch(removeCartItem(data));
  };

  const handleUpdateCartItem = (num) => {
    const data = { data: { quantity: item.quantity + num }, cartItemId: item?.id, jwt };
    dispatch(updateCartItem(data));
  };

  return (
    <div className="p-4 sm:p-5 shadow-lg border rounded-md bg-white">
      <div className="flex items-start sm:items-center">
        {/* Responsive Image */}
        <div className="w-[5rem] h-[5rem] sm:w-[9rem] sm:h-[9rem] flex-shrink-0">
          <img
            className="w-full h-full object-cover object-top rounded"
            src={item?.product?.imageUrl}
            alt={item?.product?.title}
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Text details */}
        <div className="ml-3 sm:ml-5 space-y-1 min-w-0 flex-grow">
          <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">
            {item?.product?.title}
          </p>
          <p className="opacity-70 text-xs sm:text-sm">
            Size: {item?.size}, White
          </p>
          <p className="opacity-70 text-xs sm:text-sm mt-1">
            Seller: {item?.product?.brand}
          </p>
          
          <div className="flex space-x-2 items-center pt-2 sm:pt-3">
            <p className="opacity-50 line-through text-xs sm:text-sm">
              ₹{item?.product?.price}
            </p>
            <p className="font-semibold text-sm sm:text-lg text-gray-900">
              ₹{item?.product?.discountedPrice}
            </p>
            <p className="text-green-600 font-semibold text-xs sm:text-sm">
              {item?.product?.discountPersent}% off
            </p>
          </div>
        </div>
      </div>

      {showButton && (
        <div className="flex flex-wrap items-center gap-3 sm:gap-10 pt-4 border-t mt-4">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <IconButton
              onClick={() => handleUpdateCartItem(-1)}
              disabled={item?.quantity <= 1}
              color="primary"
              aria-label="decrease quantity"
              size="small"
            >
              <RemoveCircleOutlineIcon />
            </IconButton>

            <span className="py-1 px-4 sm:px-6 border rounded text-sm font-medium">
              {item?.quantity}
            </span>

            <IconButton
              onClick={() => handleUpdateCartItem(1)}
              color="primary"
              aria-label="increase quantity"
              size="small"
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </div>

          <div className="flex text-sm sm:text-base">
            <Button
              onClick={handleRemoveItemFromCart}
              variant="text"
              color="error"
              size="small"
            >
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItem;
