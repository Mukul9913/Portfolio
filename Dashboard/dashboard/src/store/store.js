import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import forgotPaswordReducer from "./slices/forgetResetPasswordSlice"
export const store = configureStore({
    reducer: {
        user: userReducer,
        forgotPassword:forgotPaswordReducer,
    },
});