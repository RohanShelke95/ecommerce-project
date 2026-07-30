import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { addItemToWishlist, removeWishlistItem } from "../../../Redux/Customers/Wishlist/Action";

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
      alert("Please login first to add item to wishlist.");
      navigate("/login");
      return;
    }
    if (isWishlisted) {
      const wishlistItem = wishlist.wishlist.wishlistItems.find(
        (item) => item.product?.id === product?.id
      );
      if (wishlistItem) {
        dispatch(removeWishlistItem({ wishlistItemId: wishlistItem.id, jwt }));
        alert("Removed from Wishlist!");
      }
    } else {
      const data = { productId: product?.id || product?._id, jwt };
      dispatch(addItemToWishlist(data));
      alert("Added to Wishlist!");
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${product?.id || product?._id}`)}
      className="cursor-pointer flex flex-col items-center bg-white rounded-lg shadow-lg overflow-hidden w-[10rem] sm:w-[15rem] mx-2 sm:mx-3 relative"
    >
      <div className="absolute top-2 right-2 z-10">
        <IconButton 
          onClick={handleAddToWishlist} 
          sx={{ 
            backgroundColor: 'white', 
            padding: { xs: '4px', sm: '8px' },
            '&:hover': { backgroundColor: 'gray.100' } 
          }}
        >
          {isWishlisted ? (
            <FavoriteIcon color="error" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
          ) : (
            <FavoriteBorderIcon color="error" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
          )}
        </IconButton>
      </div>
      <div className="h-[8rem] sm:h-[13rem] w-[7rem] sm:w-[10rem] mt-4">
        <img
          className="object-cover object-top w-full h-full"
          src={product?.image || product?.imageUrl}
          alt={product?.title}
        />
      </div>

      <div className="p-2 sm:p-4 text-center w-full min-w-0">
        <h3 className="text-sm sm:text-lg font-medium text-gray-900 truncate">
          {product?.brand || product?.title}
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-gray-500 truncate">{product?.title}</p>
      </div>
    </div>
  );
};

export default HomeProductCard;
