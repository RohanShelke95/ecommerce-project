import { Box, Grid } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import AdjustIcon from "@mui/icons-material/Adjust";
import React from "react";
import { useNavigate } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";

const OrderCard = ({ item, order }) => {
  const navigate = useNavigate();
  return (
    <Box className="p-4 sm:p-5 shadow-lg hover:shadow-2xl border rounded-md bg-white">
      <Grid spacing={2} container sx={{ justifyContent: "space-between", alignItems: "center" }}>
        {/* Item image and titles */}
        <Grid item xs={12} sm={6}>
          <div
            onClick={() => navigate(`/account/order/${order?.id}`)}
            className="flex cursor-pointer items-center min-w-0"
          >
            <img
              className="w-[4rem] h-[4rem] sm:w-[5rem] sm:h-[5rem] object-cover object-top rounded flex-shrink-0 border"
              src={item?.product?.imageUrl}
              alt={item?.product?.title}
            />
            <div className="ml-3 sm:ml-5 min-w-0">
              <p className="mb-1 text-sm sm:text-base font-semibold text-gray-900 truncate">
                {item?.product?.title}
              </p>
              <p className="opacity-60 text-xs font-semibold">
                Size: {item?.size}
              </p>
            </div>
          </div>
        </Grid>

        {/* Price column */}
        <Grid item xs={6} sm={2}>
          <p className="font-semibold text-sm sm:text-base text-gray-800">
            ₹{item?.price}
          </p>
        </Grid>

        {/* Delivery status column */}
        <Grid item xs={6} sm={4} className="text-right sm:text-left">
          <p className="font-semibold text-xs sm:text-sm text-gray-900 inline-flex items-center">
            {order?.orderStatus === "DELIVERED" ? (
              <>
                <FiberManualRecordIcon
                  sx={{ width: "12px", height: "12px" }}
                  className="text-green-600 mr-1.5"
                />
                <span>Delivered On Mar 03</span>
              </>
            ) : (
              <>
                <AdjustIcon
                  sx={{ width: "12px", height: "12px" }}
                  className="text-green-600 mr-1.5"
                />
                <span>Expected Delivery On Mar 03</span>
              </>
            )}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
            Your Item Has Been Placed
          </p>
          {order?.orderStatus === "DELIVERED" && (
            <div
              onClick={() => navigate(`/account/rate/${item.product.id}`)}
              className="flex items-center justify-end sm:justify-start text-indigo-600 cursor-pointer mt-2 text-xs sm:text-sm hover:underline"
            >
              <StarIcon sx={{ fontSize: "1.2rem" }} className="mr-1 text-indigo-600" />
              <span>Rate & Review Product</span>
            </div>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderCard;
