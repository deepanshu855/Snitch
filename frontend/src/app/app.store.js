import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice.js"
import productsReducer from "../features/products/state/product.slice.js"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        product:productsReducer
    }
})