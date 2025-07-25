import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/users";
import usersFormsReducer from "./slices/users/forms-slice";
import ordersFormsReducer from "./slices/orders/forms-slice";
import ordersReducer from "./slices/orders/orders-slice";
import promotersFormsReducer from "./slices/promoters/forms-slice";
import promotersReducer from "./slices/promoters/promoters-slice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    users_forms: usersFormsReducer,
    orders_forms: ordersFormsReducer,
    orders: ordersReducer,
    promoters_forms: promotersFormsReducer,
    promoters: promotersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
