import { Box, Grid } from "@mui/material";
import React, { useEffect } from "react";
import OrderCard from "./OrderCard";
import { useDispatch, useSelector } from "react-redux";
import { getOrderHistory } from "../../../Redux/Customers/Order/Action";

const orderStatus = [
  { label: "On The Way", value: "onTheWay" },
  { label: "Delivered", value: "delevered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Returned", value: "returned" },
];

const Order = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { order } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getOrderHistory({ jwt }));
  }, [jwt, dispatch]);

  return (
    <Box className="px-4 sm:px-6 lg:px-10 py-5">
      <Grid container spacing={4} sx={{ justifyContent: "space-between" }}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <div className="h-auto shadow-lg bg-white border p-5 rounded-md sticky top-5">
            <h1 className="font-bold text-lg">Filters</h1>
            <div className="space-y-4 mt-5 md:mt-10">
              <h1 className="font-semibold text-sm sm:text-base">ORDER STATUS</h1>
              <div className="flex flex-row md:flex-col flex-wrap md:flex-nowrap gap-3 md:gap-0 md:space-y-4">
                {orderStatus.map((option) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      defaultValue={option.value}
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-600">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Grid>

        {/* Orders List */}
        <Grid item xs={12} md={9}>
          <Box className="space-y-4">
            {order.orders?.length > 0 ? (
              order.orders.map((singleOrder) =>
                singleOrder?.orderItems?.map((item) => (
                  <OrderCard key={item.id} item={item} order={singleOrder} />
                ))
              )
            ) : (
              <div className="text-center py-10 border rounded-md shadow-sm bg-white">
                <p className="text-gray-500 font-medium">No orders found.</p>
              </div>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Order;
