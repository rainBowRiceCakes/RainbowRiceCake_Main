// src/store/slices/ordersSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { orderIndexThunk } from "../thunks/orders/orderIndexThunk";
import { uploadCompletePhoto, uploadPickupPhoto } from "../thunks/orders/orderPicsThunk.js";
import { submitDeliveryRequest } from "../thunks/requests/submitDeliveryRequestThunk.js";
import { getHourlyStatsThunk } from "../thunks/orders/orderStatsThunk.js";

const initialState = {
  orders: [],
  stats: [], // ✅ 차트용 통계 데이터 저장소 추가
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5
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
    // 2. [기사] 주문 수락 -> 상태: mat (MATCHED)
    acceptOrder(state, action) {
      const { id, riderId } = action.payload;

      // const myActiveOrders = state.orders.filter(
      //   (o) => o.riderId === riderId && o.status !== "com"
      // );

      // if (myActiveOrders.length >= 3) {
      //   alert("동시에 3개까지만 배송 가능합니다.");
      //   return;
      // }

      const target = state.orders.find((o) => o.id === id);
      if (target) {
        target.riderId = riderId;
        target.status = "mat"; // DB 상태: mat로 변경
      }
    },
    // 서버 데이터 동기화용
    setAllOrders(state, action) {
      state.orders = action.payload;
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
        const target = state.orders.find((o) => String(o.id) === String(targetId));
        if (target) {
          target.status = "pick"; // 이제 RiderNavFlowPage가 이 변화를 감지합니다!
        }
      })

      // 3. 배달 완료 사진 업로드 성공 시 (pick -> com)
      .addCase(uploadCompletePhoto.fulfilled, (state, action) => {
        const targetId = action.payload?.orderId || action.payload?.id;
        const target = state.orders.find((o) => String(o.id) === String(targetId));
        if (target) {
          target.status = "com";
        }
      })
      .addCase(getHourlyStatsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getHourlyStatsThunk.fulfilled, (state, action) => {
        state.loading = false;
        // 주문이 있는 시간대만 필터링해서 저장 (차트를 촘촘하게!)
        state.stats = action.payload.filter(item => item.count > 0);
      })
      .addCase(getHourlyStatsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || "통계 데이터를 가져오지 못했습니다.";
      });
  },
});

export const {
  setActiveTab,
  createOrder,
  acceptOrder,
  setAllOrders
} = ordersSlice.actions;

export default ordersSlice.reducer;
