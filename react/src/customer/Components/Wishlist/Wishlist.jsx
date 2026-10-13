import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getWishlist, removeWishlistItem } from "../../../Redux/Customers/Wishlist/Action";
import ProductCard from "../Product/ProductCard/ProductCard";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import WishlistSkeleton from "../Skeletons/WishlistSkeleton";
import { showToast } from "../Toast/ToastNotification";

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
    showToast("Item removed from wishlist", "info");
  };

  // If actively fetching and no items currently loaded, show skeleton
  if (wishlist.loading && (!wishlist.wishlist?.wishlistItems || wishlist.wishlist.wishlistItems.length === 0)) {
    return <WishlistSkeleton />;
  }

  return (
    <div className="px-4 sm:px-8 lg:px-20 py-8 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          My Wishlist {wishlist.wishlist?.wishlistItems?.length > 0 && `(${wishlist.wishlist.wishlistItems.length})`}
        </h1>
      </div>

      {wishlist.wishlist?.wishlistItems?.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 bg-white border p-4 sm:p-6 rounded-lg shadow-sm">
          {wishlist.wishlist.wishlistItems.map((item) => (
            <div key={item.id} className="flex flex-col items-center p-2 rounded-lg hover:shadow-md transition-shadow duration-200">
              <ProductCard product={item.product} />
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => handleRemoveItem(item.id)}
                className="mt-2"
                sx={{
                  width: "100%",
                  maxWidth: "15rem",
                  borderRadius: "6px",
                  textTransform: "none",
                  fontWeight: 600,
                }}
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
              textTransform: "none",
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
