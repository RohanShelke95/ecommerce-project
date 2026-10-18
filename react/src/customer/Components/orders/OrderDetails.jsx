import { Box, Button, Grid } from "@mui/material";
import React from "react";
import OrderTraker from "./OrderTraker";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate, useParams } from "react-router-dom";
import AddressCard from "../adreess/AdreessCard";
import { deepPurple } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getOrderById } from "../../../Redux/Customers/Order/Action";
import { getImageUrl } from "../../../utils/getImageUrl";

const OrderDetails = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { orderId } = useParams();
  const { order } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getOrderById(orderId));
  }, [orderId, dispatch]);

  const navigate = useNavigate();
  return (
    <div className="px-3 sm:px-6 lg:px-36 space-y-7 py-5">
      {/* Delivery Address Card */}
      <Grid container className="p-4 shadow-lg rounded-md border bg-white">
        <Grid item xs={12}>
          <p className="font-bold text-lg py-2">Delivery Address</p>
        </Grid>
        <Grid item xs={12} md={6}>
          <AddressCard address={order.order?.shippingAddress} />
        </Grid>
      </Grid>

      {/* Order Tracker and Actions */}
      <Box className="p-4 sm:p-5 shadow-lg border rounded-md bg-white">
        <div className="mb-4 flex flex-wrap items-center justify-between border-b pb-3 gap-2">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Order #{order.order?.id || orderId}</h2>
            <p className="text-xs text-gray-500">
              Placed on {order.order?.orderDate || "Recent"} | Payment: {order.order?.paymentDetails?.paymentMethod || "COD"} ({order.order?.paymentDetails?.status || "PENDING"})
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
            {order.order?.orderStatus || "CONFIRMED"}
          </span>
        </div>
        <Grid
          container
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Grid item xs={12} md={9}>
            <OrderTraker
              activeStep={
                order.order?.orderStatus === "PENDING"
                  ? 0
                  : order.order?.orderStatus === "PLACED"
                  ? 0
                  : order.order?.orderStatus === "CONFIRMED"
                  ? 1
                  : order.order?.orderStatus === "SHIPPED"
                  ? 2
                  : order.order?.orderStatus === "DELIVERED"
                  ? 5
                  : 1
              }
            />
          </Grid>
          <Grid item xs={12} md={3} className="text-center md:text-right mt-3 md:mt-0">
            {order.order?.orderStatus === "DELIVERED" && (
              <Button sx={{ color: "error.main" }} color="error" variant="text">
                RETURN
              </Button>
            )}

            {order.order?.orderStatus !== "DELIVERED" && order.order?.orderStatus !== "CANCELLED" && (
              <Button sx={{ color: deepPurple[500] }} variant="text">
                cancel order
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Ordered Items List */}
      <Grid container className="space-y-4">
        {order.order?.orderItems.map((item) => (
          <Grid
            key={item.id}
            container
            item
            className="shadow-md rounded-md p-4 sm:p-5 border bg-white"
            sx={{ alignItems: "center", justifyContent: "space-between" }}
            spacing={2}
          >
            <Grid item xs={12} md={8}>
              <div className="flex items-center min-w-0">
                <img
                  className="w-[4rem] h-[4rem] sm:w-[5rem] sm:h-[5rem] object-cover object-top rounded flex-shrink-0 border"
                  src={getImageUrl(item?.product?.imageUrl)}
                  alt=""
                  referrerPolicy="no-referrer"
                />
                <div className="ml-3 sm:ml-5 space-y-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                    {item?.product?.title}
                  </p>
                  <p className="opacity-60 text-xs font-semibold space-x-3">
                    <span>Color: White</span> <span>Size: {item?.size}</span>
                  </p>
                  <p className="text-xs text-gray-500">Seller: {item?.product?.brand}</p>
                  <p className="font-semibold text-sm sm:text-base text-gray-900 mt-1">
                    ₹{item?.price}
                  </p>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} md={4} className="text-right md:text-left mt-2 md:mt-0">
              <Box
                sx={{ color: deepPurple[500] }}
                onClick={() => navigate(`/account/rate/${item?.product?.id}`)}
                className="inline-flex items-center cursor-pointer hover:underline text-xs sm:text-sm"
              >
                <StarIcon sx={{ fontSize: "1.2rem" }} className="mr-1.5 text-indigo-600" />
                <span>Rate & Review Product</span>
              </Box>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default OrderDetails;
