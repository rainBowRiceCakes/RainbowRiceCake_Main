// src/store/slices/ordersSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { orderIndexThunk } from "../thunks/orders/orderIndexThunk";
import { uploadCompletePhoto, uploadPickupPhoto } from "../thunks/orders/orderPicsThunk.js";
import { submitDeliveryRequest } from "../thunks/requests/submitDeliveryRequestThunk.js";
import { getHourlyStatsThunk } from "../thunks/orders/orderStatsThunk.js";
import { acceptOrderThunk } from "../thunks/orders/acceptOrderThunk.js";

const initialState = {
  orders: [],
  stats: [], // ✅ 차트용 통계 데이터 저장소 추가
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 100
  },
  activeTab: localStorage.getItem("activeRiderTab") || "waiting",
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // --- [통용] 탭 관리 ---
    setActiveTab(state, action) {
      state.activeTab = action.payload;
      state.orders = [];
      localStorage.setItem("activeRiderTab", action.payload);
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
    builder
      .addCase(orderIndexThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(orderIndexThunk.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;

        // 1. 데이터 추출 고도화 (배열 찾기)
        // 상황에 따라 payload 자체가 배열이거나, data/rows/orders 필드 안에 있을 수 있음
        let extractedOrders = [];
        if (Array.isArray(payload)) {
          extractedOrders = payload;
        } else if (payload?.data && Array.isArray(payload.data)) {
          extractedOrders = payload.data;
        } else if (payload?.data?.rows && Array.isArray(payload.data.rows)) {
          extractedOrders = payload.data.rows;
        } else if (payload?.rows && Array.isArray(payload.rows)) {
          extractedOrders = payload.rows;
        } else if (payload?.orders && Array.isArray(payload.orders)) {
          extractedOrders = payload.orders;
        }

        state.orders = extractedOrders;

        // 2. 페이지네이션 정보 추출
        const p = payload?.pagination || payload?.data || payload;

        if (p) {
          state.pagination = {
            currentPage: Number(p.currentPage || p.page) || 1,
            totalPages: Number(p.totalPages || p.totalPage) || 1,
            totalItems: Number(p.totalItems || p.count || p.totalCount) || extractedOrders.length,
            itemsPerPage: Number(p.itemsPerPage || p.limit) || state.pagination.itemsPerPage
          };
        }
      })
      .addCase(orderIndexThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "주문 리스트를 불러오는데 실패했습니다.";
      })
      .addCase(submitDeliveryRequest.fulfilled, (state, action) => {
        const newOrder = action.payload.data || action.payload;
        if (newOrder) {
          state.orders.unshift(newOrder); // 리스트 맨 처음에 추가
          state.pagination.totalItems += 1;
        }
      })
      // --- 🚀 [추가] 사진 업로드 성공 시 상태 업데이트 로직 ---
      // 2. 픽업 사진 업로드 성공 시 (mat -> pick)
      .addCase(uploadPickupPhoto.fulfilled, (state, action) => {
        // action.payload에 서버가 보낸 orderId나 updatedOrder가 들어있어야 합니다.
        const targetId = action.payload?.orderId || action.payload?.id;
        const target = state.orders.find((o) => String(o.orderCode) === String(targetId));
        if (target) {
          target.status = "pick"; // 이제 RiderNavFlowPage가 이 변화를 감지합니다!
        }
      })

      // 3. 배달 완료 사진 업로드 성공 시 (pick -> com)
      .addCase(uploadCompletePhoto.fulfilled, (state, action) => {
        const targetId = action.payload?.orderId || action.payload?.id;
        const target = state.orders.find((o) => String(o.orderCode) === String(targetId));
        if (target) {
          target.status = "com";
        }
      })
      .addCase(getHourlyStatsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getHourlyStatsThunk.fulfilled, (state, action) => {
        // payload가 배열이면 그대로 쓰고, 아니면 payload.data가 배열인지 확인
        const statsArray = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data;

        console.log('최종 추출된 배열:', statsArray);

        if (Array.isArray(statsArray)) {
          state.stats = statsArray.filter(item => item.count > 0);
        } else {
          state.stats = [];
        }
      })
      .addCase(getHourlyStatsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || "통계 데이터를 가져오지 못했습니다.";
      })
      .addCase(acceptOrderThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(acceptOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload = { orderCode, updatedOrder } from acceptOrderThunk
        const target = state.orders.find(o => o.orderCode === action.payload.orderCode);
        console.log('target 찾아주세요:', target);
        if (target) {
          // updatedOrder에서 riderId를 가져오거나, updatedOrder.data에서 가져옴
          const updatedData = action.payload.updatedOrder?.data || action.payload.updatedOrder;
          target.riderId = updatedData?.riderId;
          target.status = "mat";
        }
      })
      .addCase(acceptOrderThunk.rejected, (state, action) => {
        state.loading = false;
        alert(action.payload?.message || "수락 실패!");
      })
  },
});

export const {
  setActiveTab,
  setAllOrders,
  acceptOrder
} = ordersSlice.actions;

export default ordersSlice.reducer;
