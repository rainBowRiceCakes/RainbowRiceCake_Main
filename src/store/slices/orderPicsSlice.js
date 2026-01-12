import { createSlice } from "@reduxjs/toolkit";
import { uploadCompletePhoto, uploadPickupPhoto } from "../thunks/orders/orderPicsThunk";

const orderPicsSlice = createSlice({
  name: 'orderPics',
  initialState: { orders: [], loading: false },
  reducers: {
    // 필요한 일반 리듀서들...
  },
  extraReducers: (builder) => {
    builder
      // 픽업 성공 시 해당 주문 status를 'pick'으로 변경
      .addCase(uploadPickupPhoto.fulfilled, (state, action) => {
        const order = state.orders.find(o => String(o.id) === String(action.payload.orderId));
        if (order) order.status = 'pick';
      })
      // 완료 성공 시 해당 주문 status를 'com'으로 변경
      .addCase(uploadCompletePhoto.fulfilled, (state, action) => {
        const order = state.orders.find(o => String(o.id) === String(action.payload.orderId));
        if (order) order.status = 'com';
      });
  },
});

export default orderPicsSlice.reducer;