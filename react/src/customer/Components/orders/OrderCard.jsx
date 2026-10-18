import { Box, Grid } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import AdjustIcon from "@mui/icons-material/Adjust";
import React from "react";
import { useNavigate } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";

import OrderTraker from "./OrderTraker";
import { getImageUrl } from "../../../utils/getImageUrl";

const OrderCard = ({ item, order }) => {
  const navigate = useNavigate();

  const getStepNumber = (status) => {
    switch (status) {
      case "PENDING":
        return 0;
      case "PLACED":
        return 0;
      case "CONFIRMED":
        return 1;
      case "SHIPPED":
        return 2;
      case "DELIVERED":
        return 5;
      default:
        return 1;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return { bg: "bg-green-100", text: "text-green-800", dot: "text-green-600" };
      case "SHIPPED":
        return { bg: "bg-purple-100", text: "text-purple-800", dot: "text-purple-600" };
      case "CONFIRMED":
        return { bg: "bg-emerald-100", text: "text-emerald-800", dot: "text-emerald-600" };
      case "CANCELLED":
        return { bg: "bg-red-100", text: "text-red-800", dot: "text-red-600" };
      default:
        return { bg: "bg-blue-100", text: "text-blue-800", dot: "text-blue-600" };
    }
  };

  const statusStyle = getStatusColor(order?.orderStatus);
  const statusLabel = order?.orderStatus === "CONFIRMED"
    ? "Order Confirmed"
    : order?.orderStatus === "SHIPPED"
    ? "Shipped - On The Way"
    : order?.orderStatus === "DELIVERED"
    ? "Delivered"
    : order?.orderStatus === "CANCELLED"
    ? "Cancelled"
    : "Order Placed";

  return (
    <Box className="p-4 sm:p-5 shadow-sm hover:shadow-md border border-gray-200 rounded-xl bg-white space-y-4 transition-all">
      <Grid spacing={2} container sx={{ justifyContent: "space-between", alignItems: "center" }}>
        {/* Item image and titles */}
        <Grid item xs={12} sm={6}>
          <div
            onClick={() => navigate(`/account/order/${order?.id}`)}
            className="flex cursor-pointer items-center min-w-0"
          >
            <img
              className="w-[4.5rem] h-[4.5rem] sm:w-[5.5rem] sm:h-[5.5rem] object-cover object-top rounded-lg flex-shrink-0 border"
              src={getImageUrl(item?.product?.imageUrl)}
              alt={item?.product?.title}
              referrerPolicy="no-referrer"
            />
            <div className="ml-3 sm:ml-5 min-w-0">
              <p className="mb-1 text-sm sm:text-base font-semibold text-gray-900 truncate">
                {item?.product?.title}
              </p>
              <p className="text-xs text-gray-500">
                Size: <span className="font-semibold text-gray-700">{item?.size}</span> | Qty: <span className="font-semibold text-gray-700">{item?.quantity || 1}</span>
              </p>
              <p className="text-xs text-indigo-600 font-medium mt-1">
                View Order Details &rarr;
              </p>
            </div>
          </div>
        </Grid>

        {/* Price column */}
        <Grid item xs={6} sm={2}>
          <p className="font-bold text-base sm:text-lg text-gray-900">
            ₹{item?.price}
          </p>
          <p className="text-xs text-gray-400">
            {order?.paymentDetails?.paymentMethod || "COD"}
          </p>
        </Grid>

        {/* Delivery status column */}
        <Grid item xs={6} sm={4} className="text-right sm:text-left space-y-1">
          <div className="inline-flex items-center">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
              <span className={`w-2 h-2 rounded-full mr-1.5 ${statusStyle.dot === "text-green-600" ? "bg-green-600" : statusStyle.dot === "text-purple-600" ? "bg-purple-600" : statusStyle.dot === "text-emerald-600" ? "bg-emerald-600" : statusStyle.dot === "text-red-600" ? "bg-red-600" : "bg-blue-600"}`}></span>
              {statusLabel}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Order ID: <strong className="text-gray-700">#{order?.id}</strong>
          </p>
          {order?.orderDate && (
            <p className="text-xs text-gray-400">
              Placed on {order.orderDate}
            </p>
          )}
          {order?.orderStatus === "DELIVERED" && item?.product?.id && (
            <div
              onClick={() => navigate(`/account/rate/${item.product.id}`)}
              className="flex items-center justify-end sm:justify-start text-indigo-600 cursor-pointer pt-1 text-xs hover:underline"
            >
              <StarIcon sx={{ fontSize: "1rem" }} className="mr-0.5 text-indigo-600" />
              <span>Rate & Review Product</span>
            </div>
          )}
        </Grid>
      </Grid>

      {/* Embedded Live Progress Bar Tracker */}
      <div className="pt-3 border-t border-gray-100">
        <OrderTraker activeStep={getStepNumber(order?.orderStatus)} />
      </div>
    </Box>
  );
};

export default OrderCard;
