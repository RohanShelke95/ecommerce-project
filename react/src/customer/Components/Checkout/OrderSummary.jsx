import React, { useState, useEffect } from "react";
import {
  Button,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import CartItem from "../Cart/CartItem";
import { useDispatch, useSelector } from "react-redux";
import { getOrderById } from "../../../Redux/Customers/Order/Action";
import AddressCard from "../adreess/AdreessCard";
import { createPayment } from "../../../Redux/Customers/Payment/Action";
import PaymentsIcon from "@mui/icons-material/Payments";
import CreditCardIcon from "@mui/icons-material/CreditCard";

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
  const [paymentMethod, setPaymentMethod] = useState("COD"); // default to COD for instant reliability

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderById(orderId));
    }
  }, [orderId, dispatch]);

  const handleCheckout = async () => {
    setLoading(true);
    setErrorMsg("");

    if (paymentMethod === "RAZORPAY") {
      try {
        const data = { orderId: order.order?.id || orderId, jwt };
        await dispatch(createPayment(data));
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Online payment gateway error. You can select Cash on Delivery to place order instantly.";
        setErrorMsg(msg);
        setLoading(false);
      }
    } else {
      // Cash on Delivery / Direct Order placement
      setTimeout(() => {
        setLoading(false);
        navigate(
          `/payment/${order.order?.id || orderId}?razorpay_payment_id=COD_${Date.now()}&razorpay_payment_link_status=paid`
        );
      }, 500);
    }
  };

  return (
    <div className="space-y-5 px-2 sm:px-4 lg:px-0">
      <div className="p-5 shadow-lg rounded-md border bg-white">
        <h3 className="font-bold text-gray-700 text-sm uppercase mb-2">Delivery Address</h3>
        <AddressCard address={order.order?.shippingAddress} />
      </div>

      <div className="lg:grid grid-cols-3 gap-6 relative justify-between">
        {/* Order Items List */}
        <div className="lg:col-span-2 space-y-3 mb-6 lg:mb-0">
          <h3 className="font-bold text-gray-700 text-sm uppercase">
            Order Items ({order.order?.orderItems?.length || 0})
          </h3>
          {order.order?.orderItems?.map((item, index) =>
            item ? <CartItem key={item.id || index} item={item} showButton={false} /> : null
          )}
        </div>

        {/* Price Details & Payment Panel */}
        <div className="lg:sticky lg:top-4 lg:self-start space-y-4">
          <div className="border p-5 bg-white shadow-lg rounded-md space-y-4">
            <p className="font-bold opacity-70 pb-2 border-b">PRICE DETAILS</p>

            <div className="space-y-3 font-semibold text-sm">
              <div className="flex justify-between text-gray-800">
                <span>Price ({order.order?.totalItem} item)</span>
                <span>₹{order.order?.totalPrice}</span>
              </div>
              <div className="flex justify-between text-green-700">
                <span>Discount</span>
                <span>-₹{order.order?.discount}</span>
              </div>
              <div className="flex justify-between text-green-700">
                <span>Delivery Charges</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-base text-gray-900">
                <span>Total Amount</span>
                <span className="text-green-700">₹{order.order?.totalDiscountedPrice}</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="pt-4 border-t">
              <FormControl component="fieldset" className="w-full">
                <FormLabel component="legend" className="font-bold text-xs text-gray-600 uppercase mb-2">
                  Select Payment Method
                </FormLabel>
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="space-y-2"
                >
                  <div
                    onClick={() => setPaymentMethod("COD")}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                      paymentMethod === "COD"
                        ? "border-indigo-600 bg-indigo-50/50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <FormControlLabel
                      value="COD"
                      control={<Radio size="small" color="primary" />}
                      label={
                        <div className="flex items-center gap-2">
                          <PaymentsIcon className="text-green-600" fontSize="small" />
                          <div>
                            <p className="font-semibold text-sm text-gray-900">Cash on Delivery</p>
                            <p className="text-xs text-gray-500">Pay when order arrives</p>
                          </div>
                        </div>
                      }
                      className="m-0"
                    />
                  </div>

                  <div
                    onClick={() => setPaymentMethod("RAZORPAY")}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                      paymentMethod === "RAZORPAY"
                        ? "border-indigo-600 bg-indigo-50/50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <FormControlLabel
                      value="RAZORPAY"
                      control={<Radio size="small" color="primary" />}
                      label={
                        <div className="flex items-center gap-2">
                          <CreditCardIcon className="text-indigo-600" fontSize="small" />
                          <div>
                            <p className="font-semibold text-sm text-gray-900">Online Payment (Razorpay)</p>
                            <p className="text-xs text-gray-500">UPI, Cards, Netbanking</p>
                          </div>
                        </div>
                      }
                      className="m-0"
                    />
                  </div>
                </RadioGroup>
              </FormControl>
            </div>

            {errorMsg && (
              <Alert severity="error" className="text-xs">
                {errorMsg}
              </Alert>
            )}

            <Button
              onClick={handleCheckout}
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
              sx={{
                padding: ".8rem 2rem",
                width: "100%",
                backgroundColor: "#4f46e5",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#4338ca" },
              }}
            >
              {loading ? "Processing..." : paymentMethod === "COD" ? "PLACE ORDER (COD)" : "PAY NOW"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
