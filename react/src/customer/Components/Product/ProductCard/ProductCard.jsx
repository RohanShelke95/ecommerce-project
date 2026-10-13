import React from 'react';
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { addItemToWishlist, removeWishlistItem } from "../../../../Redux/Customers/Wishlist/Action";
import { getImageUrl } from "../../../../utils/getImageUrl";
import { showToast } from "../../Toast/ToastNotification";

const ProductCard = ({ product }) => {
  const { title, brand, imageUrl, price, discountedPrice, color, discountPersent } = product;
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
      const data = { productId: product?.id || product?._id, product, jwt };
      dispatch(addItemToWishlist(data));
      showToast("Added to Wishlist!", "success");
    }
  };

  const handleNavigate = () => {
    navigate(`/product/${product?.id || product?._id || 2}`, { state: { product } });
  };

  return (
    <div
      onClick={handleNavigate}
      className="productCard w-[10rem] sm:w-[15rem] border m-2 sm:m-3 transition-all duration-200 hover:shadow-lg rounded-lg overflow-hidden bg-white cursor-pointer relative"
    >
      <div className="absolute top-2 right-2 z-10">
        <IconButton
          onClick={handleAddToWishlist}
          size="small"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            padding: { xs: "5px", sm: "7px" },
            "&:hover": { backgroundColor: "#ffffff" },
          }}
        >
          {isWishlisted ? (
            <FavoriteIcon color="error" sx={{ fontSize: { xs: "1.2rem", sm: "1.4rem" } }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: "#6b7280", fontSize: { xs: "1.2rem", sm: "1.4rem" } }} />
          )}
        </IconButton>
      </div>

      <div className="h-[14rem] sm:h-[20rem] bg-gray-50 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            className="h-full w-full object-cover object-left-top hover:scale-105 transition-transform duration-300"
            src={getImageUrl(imageUrl)}
            alt={title}
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        ) : (
          <div className="text-gray-400 text-sm">No Image</div>
        )}
      </div>

      <div className="textPart bg-white p-3 border-t">
        <div>
          <p className="font-bold text-gray-900 text-sm sm:text-base truncate">{brand}</p>
          <p className="text-xs sm:text-sm text-gray-600 truncate">{title}</p>
          {color && <p className="font-medium text-gray-400 text-xs mt-0.5">{color}</p>}
        </div>

        <div className="flex space-x-2 items-center mt-2">
          <p className="font-bold text-base sm:text-lg text-gray-900">₹{discountedPrice}</p>
          {price && price > discountedPrice && (
            <>
              <p className="opacity-50 line-through text-xs sm:text-sm">₹{price}</p>
              <p className="text-green-600 font-bold text-xs sm:text-sm">{discountPersent}% off</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
