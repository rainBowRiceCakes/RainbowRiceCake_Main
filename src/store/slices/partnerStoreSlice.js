/**
 * @file src/store/slices/partnerStoreSlice.js
 * @description 파트너(매장) 정보 및 좌표 저장 관련 slice
 * 251229 v1.0.0 sara init
 */

import { createSlice } from '@reduxjs/toolkit';
import { partnerStoreThunk } from '../thunks/partnerStoreThunk.js';

const initialState = {
  store: null,      // 저장된 파트너 데이터
  isLoading: false, // 로딩 상태
  error: null,      // 에러 메시지
};

const slice = createSlice({
  name: 'partnerStore', // 
  initialState,
  reducers: {
    // 상태 초기화 액션
    clearPartnerStore(state) {
      state.store = null;
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 저장 시작
      .addCase(partnerStoreThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // 저장 성공
      .addCase(partnerStoreThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.store = action.payload.data || action.payload; 
      })
      // 저장 실패
      .addCase(partnerStoreThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearPartnerStore 
} = slice.actions;

export default slice.reducer;