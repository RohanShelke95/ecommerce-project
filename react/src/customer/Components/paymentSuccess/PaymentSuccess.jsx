import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePayment } from "../../../Redux/Customers/Payment/Action";
import { Alert, AlertTitle, Box, Grid } from "@mui/material";
import { getOrderById } from "../../../Redux/Customers/Order/Action";
import OrderTraker from "../orders/OrderTraker";
import AddressCard from "../adreess/AdreessCard";
import { useParams } from "react-router-dom";

const PaymentSuccess = () => {
  const [paymentId, setPaymentId] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const { orderId } = useParams();

  const jwt = localStorage.getItem("jwt");
  const dispatch = useDispatch();
  const { order } = useSelector((store) => store);

  useEffect(() => {
    console.log("orderId", orderId);
    const urlParams = new URLSearchParams(window.location.search);
    setPaymentId(urlParams.get("razorpay_payment_id"));
    setReferenceId(urlParams.get("razorpay_payment_link_reference_id"));
    setPaymentStatus(urlParams.get("razorpay_payment_link_status"));
  }, [orderId]);

  useEffect(() => {
    if (paymentId && paymentStatus === "paid") {
      const data = { orderId, paymentId, jwt };
      dispatch(updatePayment(data));
      dispatch(getOrderById(orderId));
    }
  }, [orderId, paymentId, paymentStatus, jwt, dispatch]);

  return (
    <div className="px-4 sm:px-6 lg:px-36 py-5">
      <div className="flex flex-col justify-center items-center">
        <Alert
          variant="filled"
          severity="success"
          sx={{ mb: 6, width: "fit-content", textAlign: "center" }}
        >
          <AlertTitle>Payment Success</AlertTitle>
          Congratulations! Your Order has been placed successfully.
        </Alert>
      </div>

      <div className="py-5">
        <OrderTraker activeStep={1} />
      </div> 

      <Grid container className="space-y-5 py-5 pt-10">
        {order.order?.orderItems.map((item) => (
          <Grid
            key={item.id}
            container
            item
            spacing={3}
            className="shadow-xl rounded-md p-4 sm:p-5 border bg-white"
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            {/* Product info */}
            <Grid item xs={12} md={7}>
              <div className="flex items-center min-w-0">
                <img
                  className="w-[4.5rem] h-[4.5rem] sm:w-[5.5rem] sm:h-[5.5rem] object-cover object-top rounded flex-shrink-0 border"
                  src={item?.product?.imageUrl}
                  alt={item?.product?.title}
                />
                <div className="ml-3 sm:ml-5 space-y-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                    {item?.product?.title}
                  </p>
                  <p className="opacity-60 text-xs font-semibold space-x-3">
                    <span>Color: Pink</span> <span>Size: {item?.size}</span>
                  </p>
                  <p className="text-xs text-gray-500">Seller: {item?.product?.brand}</p>
                  <p className="font-bold text-sm sm:text-base text-gray-900">₹{item?.price}</p>
                </div>
              </div>
            </Grid>

            {/* AddressCard */}
            <Grid item xs={12} md={5} className="border-t md:border-t-0 pt-4 md:pt-0">
              <p className="font-bold text-xs sm:text-sm text-gray-900 mb-2">Shipping Address</p>
              <AddressCard address={order.order?.shippingAddress} />
            </Grid>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default PaymentSuccess;
