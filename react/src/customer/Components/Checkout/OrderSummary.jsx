import React, { useState } from "react";
import { Button, Alert } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import CartItem from "../Cart/CartItem";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderById } from "../../../Redux/Customers/Order/Action";
import AddressCard from "../adreess/AdreessCard";
import { createPayment } from "../../../Redux/Customers/Payment/Action";

const OrderSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("order_id");
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { order } = useSelector((state) => state);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  console.log("orderId ", order.order);

  useEffect(() => {
    dispatch(getOrderById(orderId));
  }, [orderId, dispatch]);

  const handleCreatePayment = () => {
    setLoading(true);
    setErrorMsg("");
    console.log("Creating payment for order:", order.order?.id);
    const data = { orderId: order.order?.id, jwt };
    dispatch(createPayment(data)).catch((err) => {
      // Extract the most useful error message
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Payment failed. Please try again.";
      setErrorMsg(msg);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (order.order?.paymentDetails?.paymentId) {
      setLoading(false);
    }
  }, [order.order]);

  return (
    <div className="space-y-5 px-2 sm:px-4 lg:px-0">
      <div className="p-5 shadow-lg rounded-md border bg-white">
        <AddressCard address={order.order?.shippingAddress} />
      </div>

      <div className="lg:grid grid-cols-3 gap-6 relative justify-between">
        {/* Order Items List */}
        <div className="lg:col-span-2 space-y-3 mb-6 lg:mb-0">
          {order.order?.orderItems?.map((item, index) => (
            item ? <CartItem key={item.id || index} item={item} showButton={false} /> : null
          ))}
        </div>

        {/* Price Details Sticky Panel */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <div className="border p-5 bg-white shadow-lg rounded-md">
            <p className="font-bold opacity-60 pb-4">PRICE DETAILS</p>
            <hr />

            <div className="space-y-3 font-semibold">
              <div className="flex justify-between pt-3 text-black">
                <span>Price ({order.order?.totalItem} item)</span>
                <span>₹{order.order?.totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-green-700">-₹{order.order?.discount}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-green-700">Free</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span className="text-green-700">₹{order.order?.totalDiscountedPrice}</span>
              </div>
            </div>

            {errorMsg && (
              <div className="mt-4">
                <Alert severity="error">{errorMsg}</Alert>
              </div>
            )}

            <Button
              onClick={handleCreatePayment}
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{ padding: ".8rem 2rem", marginTop: "2rem", width: "100%" }}
            >
              {loading ? "Processing..." : "Payment"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
