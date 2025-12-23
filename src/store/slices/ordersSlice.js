// src/store/slices/ordersSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { ORDER_STATUS } from "../../../src/constants/orderStatus.js";
import { dummyOrders } from "../../data/dummyOrders.js";

// 로컬 스토리지에서 저장된 탭 값을 읽어오거나, 없으면 'waiting'을 기본값으로 사용
const savedTab = localStorage.getItem("activeRiderTab") || "waiting";

const initialState = {
  orders: dummyOrders,
  activeTab: savedTab, // ✅ 로컬 스토리지 값으로 초기화
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // ✅ 탭 전환 및 로컬 스토리지 저장
    setActiveTab(state, action) {
      const newTab = action.payload;
      state.activeTab = newTab;
      localStorage.setItem("activeRiderTab", newTab); // 로컬 스토리지에 저장
    },

    // REQUESTED -> MATCHED
    acceptOrder(state, action) {
      const orderNo = action.payload;
      const target = state.orders.find((o) => o.orderNo === orderNo);
      if (!target) return;

      target.statusCode = ORDER_STATUS.MATCHED;
      // 수락 시 자동으로 '진행(inProgress)' 탭으로 이동하고 싶다면 
      // 여기서 state.activeTab = "inProgress"를 해줄 수도 있습니다.
    },

    markDelivering(state, action) {
      const orderNo = action.payload;
      const target = state.orders.find((o) => o.orderNo === orderNo);
      if (!target) return;
      target.statusCode = ORDER_STATUS.DELIVERING;
    },

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

// ✅ setActiveTab 내보내기 추가
export const {
  setActiveTab,
  acceptOrder,
  markDelivering,
  markCompleted,
  attachPickupPhoto,
  attachDropoffPhoto,
} = ordersSlice.actions;

export default ordersSlice.reducer;