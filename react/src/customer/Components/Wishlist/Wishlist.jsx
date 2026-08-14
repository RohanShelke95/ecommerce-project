import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getWishlist, removeWishlistItem } from "../../../Redux/Customers/Wishlist/Action";
import ProductCard from "../Product/ProductCard/ProductCard";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlist } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (jwt) {
      dispatch(getWishlist(jwt));
    }
  }, [jwt, dispatch]);

  const handleRemoveItem = (itemId) => {
    dispatch(removeWishlistItem({ wishlistItemId: itemId, jwt }));
  };

  return (
    <div className="px-5 lg:px-20 py-10 min-h-screen">
      <h1 className="text-2xl font-bold mb-5">My Wishlist</h1>
      {wishlist.wishlist?.wishlistItems?.length > 0 ? (
        <div className="flex flex-wrap justify-center bg-white border p-5 rounded-md">
          {wishlist.wishlist.wishlistItems.map((item) => (
            <div key={item.id} className="flex flex-col items-center m-3">
              <ProductCard product={item.product} />
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<DeleteIcon />} 
                onClick={() => handleRemoveItem(item.id)}
                className="mt-2"
                sx={{ width: "15rem" }}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white border rounded-md p-10 shadow-sm">
          <div className="bg-pink-50 p-6 rounded-full mb-4">
            <FavoriteBorderIcon sx={{ fontSize: 60 }} className="text-pink-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Your Wishlist is Empty</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-sm text-center">
            Save items that you like in your wishlist to review and buy them later.
          </p>
          <Button
            onClick={() => navigate("/")}
            variant="contained"
            sx={{
              py: 1.5,
              px: 4,
              mt: 4,
              backgroundColor: "#9155FD",
              borderRadius: "8px",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#7e3ffc" },
            }}
          >
            Explore Products
          </Button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
