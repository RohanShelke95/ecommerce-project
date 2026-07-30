import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWishlist, removeWishlistItem } from "../../../Redux/Customers/Wishlist/Action";
import ProductCard from "../Product/ProductCard/ProductCard";
import { Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const Wishlist = () => {
  const dispatch = useDispatch();
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
        <div className="flex flex-col items-center justify-center h-[50vh] bg-white border rounded-md">
          <h2 className="text-xl font-semibold opacity-60">Your Wishlist is empty</h2>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
