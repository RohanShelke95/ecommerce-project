import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePayment } from "../../../Redux/Customers/Payment/Action";
import { Alert, AlertTitle, Box, Button, Grid } from "@mui/material";
import { getOrderById } from "../../../Redux/Customers/Order/Action";
import { getCart } from "../../../Redux/Customers/Cart/Action";
import OrderTraker from "../orders/OrderTraker";
import AddressCard from "../adreess/AdreessCard";
import { useNavigate, useParams } from "react-router-dom";
import { getImageUrl } from "../../../utils/getImageUrl";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const PaymentSuccess = () => {
  const [paymentId, setPaymentId] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const { orderId } = useParams();

  const jwt = localStorage.getItem("jwt");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order } = useSelector((store) => store);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setPaymentId(urlParams.get("razorpay_payment_id") || "COD_CONFIRMED");
    setReferenceId(urlParams.get("razorpay_payment_link_reference_id") || "");
    setPaymentStatus(urlParams.get("razorpay_payment_link_status") || "paid");
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderById(orderId));
    }
  }, [orderId, dispatch]);

  useEffect(() => {
    if (orderId && paymentId) {
      const data = { orderId, paymentId, jwt };
      dispatch(updatePayment(data)).then(() => {
        dispatch(getOrderById(orderId));
        if (jwt) dispatch(getCart(jwt));
      });
    }
  }, [orderId, paymentId, jwt, dispatch]);

  const isConfirmed = order.order?.orderStatus === "CONFIRMED" || order.order?.orderStatus === "PLACED";

  return (
    <div className="px-4 sm:px-6 lg:px-36 py-8">
      <div className="flex flex-col justify-center items-center text-center">
        <div className="bg-green-100 p-3 rounded-full mb-3 text-green-600">
          <CheckCircleIcon sx={{ fontSize: 52 }} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
          Order Confirmed!
        </h1>
        <p className="text-gray-600 text-sm max-w-md mb-4">
          Thank you for your purchase! We've received your order and are preparing it for delivery.
        </p>

        {/* Order Details Badge */}
        <div className="inline-flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-700 mb-6">
          <span>Order ID: <strong className="text-indigo-600">#{order.order?.id || orderId}</strong></span>
          <span className="text-gray-300">|</span>
          <span>Status: <strong className="text-green-600 uppercase">{order.order?.orderStatus || "CONFIRMED"}</strong></span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Button
            onClick={() => navigate("/account/order")}
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              backgroundColor: "#4f46e5",
              "&:hover": { backgroundColor: "#4338ca" },
              px: 3,
              py: 1,
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Track in My Orders
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant="outlined"
            startIcon={<LocalMallOutlinedIcon />}
            sx={{
              color: "#374151",
              borderColor: "#d1d5db",
              "&:hover": { borderColor: "#9ca3af", backgroundColor: "#f9fafb" },
              px: 3,
              py: 1,
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Continue Shopping
          </Button>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="py-5 bg-white border rounded-xl p-4 shadow-sm mb-8">
        <OrderTraker activeStep={isConfirmed ? 1 : 0} />
      </div> 

      {/* Ordered Items Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Items Ordered</h2>
        <Grid container className="space-y-4">
          {order.order?.orderItems?.map((item) => (
            <Grid
              key={item.id}
              container
              item
              spacing={3}
              className="shadow-sm rounded-xl p-4 sm:p-5 border bg-white"
              sx={{ alignItems: "center", justifyContent: "space-between" }}
            >
              {/* Product info */}
              <Grid item xs={12} md={7}>
                <div className="flex items-center min-w-0">
                  <img
                    className="w-[4.5rem] h-[4.5rem] sm:w-[5.5rem] sm:h-[5.5rem] object-cover object-top rounded-lg flex-shrink-0 border"
                    src={getImageUrl(item?.product?.imageUrl)}
                    alt={item?.product?.title}
                  />
                  <div className="ml-3 sm:ml-5 space-y-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                      {item?.product?.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      Brand: <span className="font-medium text-gray-700">{item?.product?.brand}</span> | Size: <span className="font-medium text-gray-700">{item?.size}</span> | Qty: <span className="font-medium text-gray-700">{item?.quantity || 1}</span>
                    </p>
                    <p className="font-bold text-sm sm:text-base text-gray-900 pt-1">₹{item?.price}</p>
                  </div>
                </div>
              </Grid>

              {/* Shipping Address */}
              <Grid item xs={12} md={5} className="border-t md:border-t-0 pt-4 md:pt-0">
                <p className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">Delivery Address</p>
                <AddressCard address={order.order?.shippingAddress} />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default PaymentSuccess;
