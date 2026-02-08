// src/store/slices/ordersSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { orderIndexThunk } from "../thunks/orders/orderIndexThunk";
import { uploadCompletePhoto, uploadPickupPhoto } from "../thunks/orders/orderPicsThunk.js";
import { submitDeliveryRequest } from "../thunks/requests/submitDeliveryRequestThunk.js";
import { getHourlyStatsThunk } from "../thunks/orders/orderStatsThunk.js";
import { acceptOrderThunk } from "../thunks/orders/acceptOrderThunk.js";
import { orderOngoingThunk } from "../thunks/orders/orderOngoingThunk.js";

const initialState = {
  orders: [],
  stats: [], // 차트용 통계 데이터 저장소 추가
  ongoingOrders: [], // 진행 중 주문 별도 저장
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 100
  },
  activeTab: "waiting",
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // --- [통용] 탭 관리 ---
    setActiveTab(state, action) {
      state.activeTab = action.payload;
      state.orders = [];
    },
    // 서버 데이터 동기화용
    setAllOrders(state, action) {
      state.orders = action.payload;
    },
    // ✅ 수동으로 주문 수락 상태 업데이트 (로컬 상태용)
    acceptOrder(state, action) {
      const { id, riderId } = action.payload;
      const target = state.orders.find(o =>
        String(o.orderCode) === String(id) || String(o.id) === String(id)
      );
      if (target) {
        target.riderId = riderId;
        target.status = "mat";
      }
    }
  },
  extraReducers: (builder) => {
    // 헬퍼: 주문 코드로 대상을 찾는 로직 공통화
    const findOrder = (state, id) =>
      state.orders.find(o => String(o.orderCode) === String(id) || String(o.id) === String(id));

    builder
      /* --- fulfilled: 성공 케이스 --- */
      .addCase(orderIndexThunk.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        state.orders = payload?.data || payload?.rows || (Array.isArray(payload) ? payload : []);

        if (payload?.pagination) {
          const { currentPage, totalPages, totalItems, itemsPerPage } = payload.pagination;
          state.pagination = {
            currentPage: Number(currentPage) || 1,
            totalPages: Number(totalPages) || 1,
            totalItems: Number(totalItems) || state.orders.length,
            itemsPerPage: Number(itemsPerPage) || state.pagination.itemsPerPage
          };
        }
      })
      .addCase(submitDeliveryRequest.fulfilled, (state, action) => {
        const newOrder = action.payload?.data || action.payload;
        if (newOrder) {
          state.orders.unshift(newOrder);
          state.pagination.totalItems += 1;
        }
      })
      .addCase(uploadPickupPhoto.fulfilled, (state, action) => {
        const target = findOrder(state, action.payload?.orderId || action.payload?.id);
        if (target) target.status = "pick";
      })
      .addCase(uploadCompletePhoto.fulfilled, (state, action) => {
        const target = findOrder(state, action.payload?.orderId || action.payload?.id);
        if (target) target.status = "com";
      })
      .addCase(getHourlyStatsThunk.fulfilled, (state, action) => {
        const statsArray = Array.isArray(action.payload) ? action.payload : action.payload?.data;
        state.stats = Array.isArray(statsArray) ? statsArray.filter(item => item.count > 0) : [];
      })
      .addCase(acceptOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        const target = findOrder(state, action.payload.orderCode);
        if (target) {
          const updated = action.payload.updatedOrder?.data || action.payload.updatedOrder;
          target.riderId = updated?.riderId;
          target.status = "mat";
        }
      })
      .addCase(orderOngoingThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.ongoingOrders = action.payload;
      })

    /* --- Matchers: 공통 상태 처리 --- */
    builder
      // 모든 오더 관련 Thunk의 pending 상태
      .addMatcher(
        (action) => action.type.startsWith('orders/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      // 모든 오더 관련 Thunk의 rejected 상태
      .addMatcher(
        (action) => action.type.startsWith('orders/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || action.payload?.msg || "요청을 처리하지 못했습니다.";
        }
      );
  },
});

export const {
  setActiveTab,
  setAllOrders,
  acceptOrder
} = ordersSlice.actions;

export default ordersSlice.reducer;
