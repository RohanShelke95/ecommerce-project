import React, { useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useSelector } from "react-redux";

/**
 * Global helper to trigger toast notifications from anywhere in the app
 * @param {string} message 
 * @param {'success'|'info'|'warning'|'error'} severity 
 */
export const showToast = (message, severity = "success") => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("app-toast", {
        detail: { message, severity },
      })
    );
  }
};

const ToastNotification = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const { auth, cart, wishlist } = useSelector((store) => store);

  // Listen to custom 'app-toast' events
  useEffect(() => {
    const handleToastEvent = (e) => {
      if (e.detail?.message) {
        setMessage(e.detail.message);
        setSeverity(e.detail.severity || "success");
        setOpen(true);
      }
    };
    window.addEventListener("app-toast", handleToastEvent);
    return () => window.removeEventListener("app-toast", handleToastEvent);
  }, []);

  // Listen for Auth errors & success messages
  useEffect(() => {
    if (auth.error) {
      setMessage(typeof auth.error === "string" ? auth.error : "Authentication failed!");
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
      setMessage(typeof cart.error === "string" ? cart.error : "Cart update failed!");
      setSeverity("error");
      setOpen(true);
    }
  }, [cart.error]);

  // Listen for Wishlist errors
  useEffect(() => {
    if (wishlist?.error) {
      setMessage(typeof wishlist.error === "string" ? wishlist.error : "Wishlist update failed!");
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
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      sx={{ zIndex: 9999 }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{
          width: "100%",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
          borderRadius: "8px",
          fontWeight: 500,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ToastNotification;
