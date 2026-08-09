import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload?.items || (Array.isArray(action.payload) ? action.payload : []);
    },
    incrementCartItem: (state, action) => {
      const { productId, variantId } = action.payload;

      state.items = state.items.map((item) => {
        if (
          item.product.toString() === productId &&
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
        if (
          item.product.toString() === productId &&
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
