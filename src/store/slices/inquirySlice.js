import { createSlice } from '@reduxjs/toolkit';
import { getInquiriesThunk } from '../thunks/questions/getInquiriesThunk.js';
import { getInquiryDetailThunk } from '../thunks/questions/getInquiryDetailThunk.js';

const inquirySlice = createSlice({
  name: 'inquiry',
  initialState: {
    inquiries: [],          // 목록 데이터
    selectedInquiry: null,  // 상세 데이터
    isLoading: false,
    error: null,
  },
  reducers: {
    // 모달이 닫힐 때나 목록으로 돌아갈 때 상태 초기화
    clearSelectedInquiry: (state) => {
      state.selectedInquiry = null;
    },
    resetInquiryError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      /* 전체 목록 조회 */
      .addCase(getInquiriesThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInquiriesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.inquiries = action.payload;
      })
      .addCase(getInquiriesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      /* 상세 내용 조회 */
      .addCase(getInquiryDetailThunk.fulfilled, (state, action) => {
        state.selectedInquiry = action.payload;
      });
  },
});

export const { clearSelectedInquiry, resetInquiryError } = inquirySlice.actions;
export default inquirySlice.reducer;