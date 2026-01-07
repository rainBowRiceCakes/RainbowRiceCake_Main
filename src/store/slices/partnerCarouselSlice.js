/**
 * @file src/store/slices/imageSlice.js
 * @description 이미지 관련 상태 관리 (파트너 로고 등)
 */

import { createSlice } from '@reduxjs/toolkit';
import { partnerCarouselThunk } from '../thunks/partnerCarouselThunk.js';

const initialState = {
  logoImages: [], // 캐러셀에 표시될 이미지 URL 배열
  loading: false, // 로딩 상태
  error: null,    // 에러 메시지
};

const Slice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    // 필요 시 로고 목록 초기화 액션 추가 가능
    clearLogoImages: (state) => {
      state.logoImages = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // --- 로고 이미지 조회 ---
      .addCase(partnerCarouselThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(partnerCarouselThunk.fulfilled, (state, action) => {
        state.loading = false;
        // payload가 이미지 경로 배열이라고 가정
        state.logoImages = action.payload; 
      })
      .addCase(partnerCarouselThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLogoImages } = Slice.actions;
export default Slice.reducer;