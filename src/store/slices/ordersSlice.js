// src/store/slices/ordersSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { dummyOrders } from "../../data/dummyOrders.js";

const initialState = {
  allOrders: dummyOrders, // 점주/관리자가 chase하는 전체 데이터 소스 내중에 [] 로 바꾸기 
  activeTab: localStorage.getItem("activeRiderTab") || "waiting",
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // --- [통용] 탭 관리 ---
    setActiveTab(state, action) {
      state.activeTab = action.payload;
      localStorage.setItem("activeRiderTab", action.payload);
    },
    // 1. [점주] 주문 생성 (초기 상태: req)
    createOrder(state, action) {
      state.allOrders.push({
        ...action.payload,
        statusCode: 'req', // 요청됨
        riderId: null,
      });
    },

    // 2. [기사] 주문 수락 -> 상태: mat (MATCHED)
    acceptOrder(state, action) {
      const { orderNo, riderId } = action.payload;

      const myActiveOrders = state.allOrders.filter(
        (o) => o.riderId === riderId && o.statusCode !== "com"
      );

      if (myActiveOrders.length >= 3) {
        alert("동시에 3개까지만 배송 가능합니다.");
        return;
      }

      const target = state.allOrders.find((o) => o.orderNo === orderNo);
      if (target && !target.riderId) {
        target.riderId = riderId;
        target.statusCode = "mat"; // DB 상태: mat로 변경
      }
    },

    // 3. [기사] 픽업 사진 업로드 -> 상태: pick (PICKED/DELIVERING)
    attachPickupPhoto(state, action) {
      const { orderNo, pickupPhotoUrl } = action.payload;
      const target = state.allOrders.find((o) => o.orderNo === orderNo);
      if (target) {
        target.pickupPhotoUrl = pickupPhotoUrl;
        target.statusCode = "pick"; // 사진 업로드 시 자동 상태 변경
      }
    },

    // 4. [기사] 완료 사진 업로드 -> 상태: com (COMPLETED)
    attachDropoffPhoto(state, action) {
      const { orderNo, dropoffPhotoUrl } = action.payload;
      const target = state.allOrders.find((o) => o.orderNo === orderNo);
      if (target) {
        target.dropoffPhotoUrl = dropoffPhotoUrl;
        target.statusCode = "com"; // 최종 완료 상태
        target.completedAt = new Date().toISOString();
      }
    },

    // 서버 데이터 동기화용
    setAllOrders(state, action) {
      state.allOrders = action.payload;
    }
  },
});

export const {
  setActiveTab,
  createOrder,
  acceptOrder,
  attachPickupPhoto,
  attachDropoffPhoto,
  setAllOrders
} = orderSlice.actions;

export default orderSlice.reducer;