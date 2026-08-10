import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalPrice: 0,
  },
  reducers: {
    setCart: (state, action) => {
      const payload = action.payload || {};
      state.items = payload.items || (Array.isArray(payload) ? payload : []);
      state.totalPrice = payload.totalPrice ?? payload.total ?? 0;
    },
    incrementCartItem: (state, action) => {
      const { productId, variantId } = action.payload;

      state.items = state.items.map((item) => {
        const itemProductId = item.product?._id || item.product;
        if (
          itemProductId.toString() === productId &&
          item.variant.toString() === variantId
        ) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        } else {
          return item;
        }
      });
    },
    decrementCartItem: (state, action) => {
      const { productId, variantId } = action.payload;

      state.items = state.items.map((item) => {
        const itemProductId = item.product?._id || item.product;
        if (
          itemProductId.toString() === productId &&
          item.variant.toString() === variantId
        ) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        } else {
          return item;
        }
      });
    },
  },
});

export const { setCart, incrementCartItem, decrementCartItem } =
  cartSlice.actions;
export default cartSlice.reducer;
