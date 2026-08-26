import React, { useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useSelector } from "react-redux";

const ToastNotification = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const { auth, cart, wishlist } = useSelector((store) => store);

  // Listen for Auth errors & success messages
  useEffect(() => {
    if (auth.error) {
      setMessage(typeof auth.error === 'string' ? auth.error : "Authentication failed!");
      setSeverity("error");
      setOpen(true);
    } else if (auth.successMessage) {
      setMessage(auth.successMessage);
      setSeverity("success");
      setOpen(true);
    }
  }, [auth.error, auth.successMessage]);

  // Listen for Cart errors
  useEffect(() => {
    if (cart.error) {
      setMessage(typeof cart.error === 'string' ? cart.error : "Cart update failed!");
      setSeverity("error");
      setOpen(true);
    }
  }, [cart.error]);

  // Listen for Wishlist errors
  useEffect(() => {
    if (wishlist?.error) {
      setMessage(typeof wishlist.error === 'string' ? wishlist.error : "Wishlist update failed!");
      setSeverity("error");
      setOpen(true);
    }
  }, [wishlist?.error]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ToastNotification;
