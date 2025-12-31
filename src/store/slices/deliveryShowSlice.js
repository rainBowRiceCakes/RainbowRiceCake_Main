/**
 * @file src/store/slices/orderSlice.js
 * @description order 관련 slice
 * 251229 v1.0.0 sara init
 */

import { createSlice } from '@reduxjs/toolkit';
import { deliveryShowThunk} from '../thunks/deliveryShowThunk.js';

const initialState = {
  show: null,
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'deliveryShow',
  initialState,
  reducers: {
    clearDeliveryShow(state) {
      state.show = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 요청 시작 시 loading 처리
      .addCase(deliveryShowThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // 성공 시 데이터 저장 및 loading 종료
      .addCase(deliveryShowThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.show = action.payload.data || action.payload;
      })
      // 실패 시 에러 저장 및 loading 종료
      .addCase(deliveryShowThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }  
});

export const { 
  clearDeliveryShow,
} = slice.actions; // redux toolkit에서 자동 생성한 action creator들

export default slice.reducer; // reducer 함수 export
