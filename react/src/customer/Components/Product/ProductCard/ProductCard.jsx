import React from 'react';
import "./ProductCard.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { addItemToWishlist, removeWishlistItem } from "../../../../Redux/Customers/Wishlist/Action";

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

  const handleNavigate=()=>{
    navigate(`/product/${product?.id || product?._id || 2}`)
  }

  return (
   <div onClick={handleNavigate} className='productCard w-[10rem] sm:w-[15rem] border m-2 sm:m-3 transition-all cursor-pointer relative'>
      <div className="absolute top-2 right-2 z-10">
        <IconButton onClick={handleAddToWishlist} sx={{ backgroundColor: 'white', '&:hover': { backgroundColor: 'gray.100' } }}>
          {isWishlisted ? (
            <FavoriteIcon color="error" />
          ) : (
            <FavoriteBorderIcon color="error" />
          )}
        </IconButton>
      </div>
    <div className='h-[14rem] sm:h-[20rem] bg-gray-100 flex items-center justify-center'>
        {imageUrl ? (
          <img className='h-full w-full object-cover object-left-top' src={imageUrl} alt={title} referrerPolicy="no-referrer" />
        ) : (
          <div className='text-gray-400'>No Image</div>
        )}
    </div>
    <div className='textPart bg-white p-3 border-t'>
        <div>
            <p className='font-bold text-gray-900'>{brand}</p>
            <p className='text-sm text-gray-700'>{title}</p>
            <p className='font-semibold opacity-50 text-xs'>{color}</p>
        </div>
        
        <div className='flex space-x-2 items-center mt-2'>
            <p className='font-bold text-lg'>₹{discountedPrice}</p>
            <p className='opacity-50 line-through text-sm'>₹{price}</p>
            <p className='text-green-600 font-bold text-sm'>{discountPersent}% off</p>
        </div>
    </div>
   </div>
  );
};

export default ProductCard;
