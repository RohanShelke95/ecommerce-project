// ** MUI Imports
import Grid from "@mui/material/Grid";
import AdminPannel from "../../Styles/AdminPannelWrapper";
import Achivement from "../tables/Achivement";
import MonthlyOverview from "../tables/MonthlyOverView";
import WeeklyOverview from "../tables/WeeklyOverview";
import TotalEarning from "../tables/TotalEarning";
import CardStatsVertical from "../../Styles/CardStatsVertical";
import SalesByCountries from "../tables/SalesByContry";
import DepositWithdraw from "../tables/DepositeAndWithdraw";
import CustomersTable from "../tables/CustomersTable";
import { ThemeProvider, createTheme } from "@mui/material";
import { customTheme, darkTheme } from "../them/customeThem";
import "./Admin.css";
import RecentlyAddeddProducts from "../tables/RecentlyAddeddProducts";
import SalesOverTime from "../tables/SalesOverTime";
import RecentOrders from "../tables/RecentOrders";
import {AssuredWorkloadIcon }from '@mui/icons-material';
import { BriefcaseVariantOutline, CurrencyUsd, HelpCircleOutline, Poll } from "mdi-material-ui";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../../Redux/Admin/Orders/Action";
import { getProducts } from "../../Redux/Admin/Product/Action";
import { getAdminAnalytics } from "../../Redux/Admin/Analytics/Action";

const darkTheme1 = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#312d4b',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});



// bg-[#28243d]
const Dashboard = () => {
  const {auth,adminsOrder,adminsProduct}=useSelector(store=>store);
  const navigate=useNavigate()
  const dispatch=useDispatch();

  useEffect(()=>{
    dispatch(getOrders())
    dispatch(getProducts())
    const jwt = localStorage.getItem("jwt");
    if(jwt) dispatch(getAdminAnalytics(jwt));
  },[dispatch])

  return (
    <div className="adminContainer ">
      <ThemeProvider theme={customTheme}>
        <AdminPannel>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Achivement />
            </Grid>
            <Grid item xs={12} md={8}>
              <MonthlyOverview />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <SalesOverTime />
            </Grid>
            <Grid item xs={12} md={6} lg={8}>
              <RecentOrders />
            </Grid>
             <Grid item xs={12} md={12} lg={12}>
              <RecentlyAddeddProducts />
            </Grid>

           
            <Grid item xs={12}>
              <CustomersTable />
            </Grid>
          </Grid>
        </AdminPannel>
      </ThemeProvider>
    </div>
  );
};

export default Dashboard;
