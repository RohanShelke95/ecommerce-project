import React, { useEffect } from "react";
import CartItem from "./CartItem";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../../../Redux/Customers/Cart/Action";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CartSkeleton from "../Skeletons/CartSkeleton";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");
  const { cart } = useSelector((store) => store);

  useEffect(() => {
    if (jwt) {
      dispatch(getCart(jwt));
    }
  }, [jwt, dispatch]);

  // Only show skeleton on the very first load (no cart data yet at all)
  if (cart.loading && !cart.cart && (!cart.cartItems || cart.cartItems.length === 0)) {
    return <CartSkeleton />;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-16 min-h-[70vh]">
      {cart.cartItems?.length > 0 ? (
        <div className="lg:grid grid-cols-3 gap-6 py-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 mb-6 lg:mb-0">
            {cart.cartItems.map((item, index) =>
              item ? <CartItem key={item.id || index} item={item} showButton={true} /> : null
            )}
          </div>

          {/* Price Summary */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <div className="border p-5 bg-white shadow-lg rounded-md">
              <p className="font-bold opacity-60 pb-4">PRICE DETAILS</p>
              <hr />
              <div className="space-y-3 font-semibold">
                <div className="flex justify-between pt-3 text-black">
                  <span>Price ({cart.cart?.totalItem || cart.cartItems?.length} item)</span>
                  <span>₹{cart.cart?.totalPrice || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-green-700">-₹{cart.cart?.discounte || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-green-700">Free</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span className="text-green-700">₹{cart.cart?.totalDiscountedPrice || 0}</span>
                </div>
              </div>
              <Button
                onClick={() => navigate("/checkout?step=2")}
                variant="contained"
                type="submit"
                sx={{ padding: ".8rem 2rem", marginTop: "2rem", width: "100%" }}
              >
                Check Out
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-[70vh] flex justify-center items-center flex-col py-12">
          <div className="bg-indigo-50 p-6 rounded-full mb-4 shadow-inner">
            <ShoppingBagOutlinedIcon sx={{ fontSize: 60 }} className="text-indigo-600" />
          </div>
          <div className="text-center py-2 max-w-md">
            <h1 className="text-2xl font-bold text-gray-800">Your Cart is Empty</h1>
            <p className="text-gray-500 text-sm mt-2">
              Looks like you haven't added anything to your cart yet. Explore our top categories and find something you love!
            </p>
          </div>
          <Button
            onClick={() => navigate("/")}
            variant="contained"
            sx={{
              py: 1.5,
              px: 4,
              mt: 4,
              backgroundColor: "#4f46e5",
              borderRadius: "8px",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#4338ca" },
            }}
          >
            Start Shopping Now
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
