// src/store/slices/ordersSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { ORDER_STATUS } from "../../../src/constants/orderStatus.js";
import { dummyOrders } from "../../data/dummyOrders.js";

const initialState = {
  orders: dummyOrders,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // REQUESTED -> MATCHED
    acceptOrder(state, action) {
      const orderNo = action.payload;
      const target = state.orders.find((o) => o.orderNo === orderNo);
      if (!target) return;

      target.statusCode = ORDER_STATUS.MATCHED;
      // target.acceptedAt = new Date().toISOString();
    },

    // ✅ 픽업 사진 업로드 완료 -> DELIVERING
    markDelivering(state, action) {
      const orderNo = action.payload;
      const target = state.orders.find((o) => o.orderNo === orderNo);
      if (!target) return;

      target.statusCode = ORDER_STATUS.DELIVERING;
      // (선택) target.deliveringAt = new Date().toISOString();
    },

    // ✅ 드랍오프 사진 업로드 완료 -> COMPLETED
    markCompleted(state, action) {
      const orderNo = action.payload;
      const target = state.orders.find((o) => o.orderNo === orderNo);
      if (!target) return;

      target.statusCode = ORDER_STATUS.COMPLETED;
      target.completedAt = new Date().toISOString();
    },

    attachPickupPhoto(state, action) {
      const { orderNo, pickupPhotoUrl } = action.payload;
      const target = state.orders.find((o) => o.orderNo === orderNo);
      if (!target) return;

      target.pickupPhotoUrl = pickupPhotoUrl;
    },

    attachDropoffPhoto(state, action) {
      const { orderNo, dropoffPhotoUrl } = action.payload;
      const target = state.orders.find((o) => String(o.orderNo) === String(orderNo));
      if (!target) return;

      target.dropoffPhotoUrl = dropoffPhotoUrl;
    },
  },
});

export const {
  acceptOrder,
  markDelivering,
  markCompleted,
  attachPickupPhoto,
  attachDropoffPhoto,
} = ordersSlice.actions;

export default ordersSlice.reducer;