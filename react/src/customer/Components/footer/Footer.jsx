import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, TextField, Snackbar, Alert } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setToastMsg("Please enter a valid email address.");
      setToastOpen(true);
      return;
    }
    setToastMsg("Thank you for subscribing! Check your email for 10% off coupon.");
    setToastOpen(true);
    setEmail("");
  };

  return (
    <footer className="bg-slate-900 text-slate-300 mt-16 font-sans border-t border-slate-800">
      {/* ── Feature Highlights Bar ── */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl">
              <LocalShippingOutlinedIcon sx={{ fontSize: 28 }} />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Free Express Delivery</h4>
              <p className="text-xs text-slate-400">On all orders over ₹1000</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl">
              <ReplayOutlinedIcon sx={{ fontSize: 28 }} />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">30-Day Easy Returns</h4>
              <p className="text-xs text-slate-400">Hassle-free return policy</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl">
              <LockOutlinedIcon sx={{ fontSize: 28 }} />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">100% Secure Checkout</h4>
              <p className="text-xs text-slate-400">Encrypted payment gateways</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl">
              <HeadsetMicOutlinedIcon sx={{ fontSize: 28 }} />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">24/7 Dedicated Support</h4>
              <p className="text-xs text-slate-400">Here to assist you anytime</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Footer Links & Newsletter ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-white tracking-wide">
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              ShopWithUs
            </span>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            Your premier destination for trendsetting fashion, footwear, and accessories. Experience high quality products delivered right to your doorstep.
          </p>
          {/* Newsletter Form */}
          <div className="pt-2">
            <h4 className="text-white font-medium text-sm mb-2">Subscribe to get 10% off your first order</h4>
            <form onSubmit={handleSubscribe} className="flex max-w-md gap-2">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 w-full"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-1 flex-shrink-0"
              >
                <span>Join</span>
                <SendIcon sx={{ fontSize: 16 }} />
              </button>
            </form>
          </div>
        </div>

        {/* Shop Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 border-b border-slate-800 pb-2">
            Quick Shop
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/men/clothing/mens_kurta" className="hover:text-indigo-400 transition-colors">
                Men's Kurtas
              </Link>
            </li>
            <li>
              <Link to="/women/clothing/lengha_choli" className="hover:text-indigo-400 transition-colors">
                Women's Lehenga
              </Link>
            </li>
            <li>
              <Link to="/women/clothing/goun" className="hover:text-indigo-400 transition-colors">
                Designer Gowns
              </Link>
            </li>
            <li>
              <Link to="/men/clothing/shirt" className="hover:text-indigo-400 transition-colors">
                Men's Shirts
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-indigo-400 transition-colors">
                My Wishlist
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Account & Support */}
        <div>
          <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 border-b border-slate-800 pb-2">
            Account & Support
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/account/order" className="hover:text-indigo-400 transition-colors">
                Track My Orders
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-indigo-400 transition-colors">
                Shopping Cart
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-indigo-400 transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-indigo-400 transition-colors">
                Contact Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Information */}
        <div>
          <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 border-b border-slate-800 pb-2">
            Policies
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/privaciy-policy" className="hover:text-indigo-400 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-condition" className="hover:text-indigo-400 transition-colors">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <span className="text-slate-500 cursor-not-allowed">Shipping Info</span>
            </li>
            <li>
              <span className="text-slate-500 cursor-not-allowed">Refund Policy</span>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Bottom Bar: Social Icons & Copyright ── */}
      <div className="border-t border-slate-800 bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 text-center md:text-left">
            &copy; {new Date().getFullYear()} <strong className="text-white">ShopWithUs</strong>. All rights reserved. Built for exceptional shopping experience.
          </p>

          {/* Social Media Icons */}
          <div className="flex items-center space-x-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon sx={{ fontSize: 18 }} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <FacebookIcon sx={{ fontSize: 18 }} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Twitter"
            >
              <TwitterIcon sx={{ fontSize: 18 }} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              aria-label="GitHub"
            >
              <GitHubIcon sx={{ fontSize: 18 }} />
            </a>
          </div>
        </div>
      </div>

      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" variant="filled" onClose={() => setToastOpen(false)}>
          {toastMsg}
        </Alert>
      </Snackbar>
    </footer>
  );
};

export default Footer;
