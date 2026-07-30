import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navigation from "./customer/Components/Navbar/Navigation";
import CustomerRoutes from "./Routers/CustomerRoutes";
import AdminRoutes from "./Routers/AdminRoutes";
import NotFound from "./Pages/Notfound";
import AdminPannel from "./Admin/AdminPannel";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./Redux/Auth/Action";
import { getWishlist } from "./Redux/Customers/Wishlist/Action";
// import Routers from './Routers/Routers';

function App() {
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (jwt) {
      dispatch(getUser(jwt));
      dispatch(getWishlist(jwt));
    }
  }, [jwt]);

  // Determine if user is (or might be) an admin:
  // - auth.user already loaded and is ROLE_ADMIN, OR
  // - JWT exists and user profile is still being fetched (avoid premature 404)
  const isAdminOrLoading =
    auth.user?.role === "ROLE_ADMIN" ||
    (jwt && auth.fetchingUser);

  return (
    <div className="">
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
