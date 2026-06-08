import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // [{ id, name, price, imgUrl, quantity }]
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const dish = action.payload;
      const existingItem = state.items.find((item) => item.id === dish.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...dish, quantity: 1 });
      }

      state.totalPrice += dish.price;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
