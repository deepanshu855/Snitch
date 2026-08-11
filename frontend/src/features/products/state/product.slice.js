import { createSlice } from "@reduxjs/toolkit";
import { deleteProduct } from "../services/product.api";

const productSlice = createSlice({
  name: "product",
  initialState: {
    sellerProducts: [],
    products: [],
    product: null
  },
  reducers: {
    setSellerProducts: (state, action) => {
      state.sellerProducts = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setProduct: (state, action) => {
      state.product= action.payload;
    },
    setDeleteProduct: (state, action)=> {
      const productId = action.payload;
      state.sellerProducts = state.sellerProducts.filter((product)=>product._id!==productId);
      state.products = state.products.filter((product)=>product._id!==productId);
    }
  },
});

export const { setSellerProducts, setProducts, setProduct, setDeleteProduct } = productSlice.actions;
export default productSlice.reducer;
