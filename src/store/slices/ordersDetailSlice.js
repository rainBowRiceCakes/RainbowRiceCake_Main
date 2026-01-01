import { createSlice } from '@reduxjs/toolkit';
import { orderShowThunk } from '../thunks/orders/orderShowThunk.js';  // 방금 만든 Show

const initialState = {
	// 리스트 관련 상태
	orders: [],
	// 상세 정보 관련 상태
	orderDetail: null,
	// 공통 로딩 및 에러 상태
	loading: false,
	error: null,
};

const ordersDetailSlice = createSlice({
	name: 'ordersDetail',
	initialState,
	reducers: {
		// 상세 페이지를 떠날 때 데이터를 초기화하고 싶다면 사용
		clearOrderDetail: (state) => {
			state.orderDetail = null;
		},
	},
	extraReducers: (builder) => {
		builder
			/* --- 주문 상세 (Show) --- */
			.addCase(orderShowThunk.pending, (state) => {
				state.loading = true;
				state.orderDetail = null; // 새 데이터를 불러올 때 이전 데이터 비우기
			})
			.addCase(orderShowThunk.fulfilled, (state, action) => {
				state.loading = false;
				state.orderDetail = action.payload; // 상세 데이터 저장
			})
			.addCase(orderShowThunk.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export const { clearOrderDetail } = ordersDetailSlice.actions;
export default ordersDetailSlice.reducer;