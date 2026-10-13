import { Route, Routes } from "react-router-dom";
import "./App.css";
import CustomerRoutes from "./Routers/CustomerRoutes";
import AdminPannel from "./Admin/AdminPannel";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./Redux/Auth/Action";
import { getWishlist } from "./Redux/Customers/Wishlist/Action";
import { getCart } from "./Redux/Customers/Cart/Action";
import ToastNotification from "./customer/Components/Toast/ToastNotification";
import { API_BASE_URL } from "./config/api";
import axios from "axios";

function App() {
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  // Initial user session hydration
  useEffect(() => {
    if (jwt) {
      dispatch(getUser(jwt));
      dispatch(getWishlist(jwt));
      dispatch(getCart(jwt)); // Preload cart count for Navbar badge
    }
  }, [jwt, dispatch]);

  // Backend Warmup & Keep-Alive Ping
  useEffect(() => {
    // Immediate non-blocking ping to wake up Render container if asleep
    const pingBackend = async () => {
      try {
        await axios.get(`${API_BASE_URL}/`, { timeout: 15000 });
      } catch (err) {
        // Silent catch: ping attempt initiated
      }
    };

    pingBackend();

    // Heartbeat every 10 minutes to prevent Render from going to sleep while tab is open
    const intervalId = setInterval(pingBackend, 10 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Determine if user is (or might be) an admin:
  const isAdminOrLoading =
    auth.user?.role === "ROLE_ADMIN" ||
    (jwt && auth.fetchingUser);

  return (
    <div className="">
      <ToastNotification />
      <Routes>
        <Route path="/*" element={<CustomerRoutes />} />
        {isAdminOrLoading && (
          <Route path="/admin/*" element={<AdminPannel />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
