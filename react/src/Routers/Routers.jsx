import React from "react";
import CustomerRoutes from "./CustomerRoutes";

/**
 * Legacy Router wrapper - redirects to the active CustomerRoutes
 */
const Routers = () => {
  return <CustomerRoutes />;
};

export default Routers;
