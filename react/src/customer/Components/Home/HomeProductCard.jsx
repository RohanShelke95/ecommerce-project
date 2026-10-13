import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { addItemToWishlist, removeWishlistItem } from "../../../Redux/Customers/Wishlist/Action";
import { getImageUrl } from "../../../utils/getImageUrl";
import { showToast } from "../Toast/ToastNotification";

const HomeProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { wishlist } = useSelector((store) => store);

  const isWishlisted = wishlist?.wishlist?.wishlistItems?.some(
    (item) => item.product?.id === product?.id
  );

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    if (!jwt) {
      showToast("Please login first to add items to wishlist", "warning");
      navigate("/login");
      return;
    }
    if (isWishlisted) {
      const wishlistItem = wishlist.wishlist?.wishlistItems?.find(
        (item) => item.product?.id === product?.id
      );
      dispatch(
        removeWishlistItem({
          wishlistItemId: wishlistItem?.id,
          productId: product?.id,
          jwt,
        })
      );
      showToast("Removed from Wishlist", "info");
    } else {
      const data = {
        productId: product?.id || product?._id,
        product,
        jwt,
      };
      dispatch(addItemToWishlist(data));
      showToast("Added to Wishlist!", "success");
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${product?.id || product?._id}`)}
      className="cursor-pointer flex flex-col items-center bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden w-[10rem] sm:w-[15rem] mx-2 sm:mx-3 relative border border-gray-100"
    >
      <div className="absolute top-2 right-2 z-10">
        <IconButton 
          onClick={handleAddToWishlist} 
          size="small"
          sx={{ 
            backgroundColor: "rgba(255, 255, 255, 0.9)", 
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            padding: { xs: "5px", sm: "7px" },
            "&:hover": { backgroundColor: "#ffffff" } 
          }}
        >
          {isWishlisted ? (
            <FavoriteIcon color="error" sx={{ fontSize: { xs: "1.2rem", sm: "1.4rem" } }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: "#6b7280", fontSize: { xs: "1.2rem", sm: "1.4rem" } }} />
          )}
        </IconButton>
      </div>

      <div className="h-[8rem] sm:h-[13rem] w-[7rem] sm:w-[10rem] mt-4 flex items-center justify-center">
        <img
          className="object-cover object-top w-full h-full rounded"
          src={getImageUrl(product?.image || product?.imageUrl)}
          alt={product?.title}
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      </div>

      <div className="p-2 sm:p-4 text-center w-full min-w-0">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
          {product?.brand || product?.title}
        </h3>
        <p className="mt-1 text-xs text-gray-500 truncate">{product?.title}</p>
        <div className="mt-2 flex items-center justify-center space-x-2">
          <span className="font-bold text-sm sm:text-base text-gray-900">
            ₹{product?.discountedPrice || product?.price}
          </span>
          {product?.discountedPrice && product?.discountedPrice < product?.price && (
            <span className="text-xs text-gray-400 line-through">₹{product?.price}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeProductCard;
