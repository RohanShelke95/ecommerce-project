import {applyMiddleware, combineReducers, legacy_createStore} from "redux"
import thunk from "redux-thunk";
import authReducer from "./Auth/Reducer";
import customerProductReducer from "./Customers/Product/Reducer";
import productReducer from "./Admin/Product/Reducer";
import cartReducer from "./Customers/Cart/Reducer";
import { orderReducer } from "./Customers/Order/Reducer";
import adminOrderReducer from "./Admin/Orders/Reducer";
import ReviewReducer from "./Customers/Review/Reducer";
import { categoryReducer } from "./Admin/Category/Reducer";
import { wishlistReducer } from "./Customers/Wishlist/Reducer";
import { analyticsReducer } from "./Admin/Analytics/Reducer";

const rootReducers=combineReducers({

    auth:authReducer,
    customersProduct:customerProductReducer,
    cart:cartReducer,
    order:orderReducer,
    review:ReviewReducer,
    wishlist:wishlistReducer,

    // admin
    adminsProduct:productReducer,
    adminsOrder:adminOrderReducer,
    categories:categoryReducer,
    adminAnalytics: analyticsReducer,
});


export const store = legacy_createStore(rootReducers,applyMiddleware(thunk))