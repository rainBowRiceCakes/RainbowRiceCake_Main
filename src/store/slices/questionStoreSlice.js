/**
 * @file src/store/slices/questionStoreSlice.js
 * @description 고객 문의(questions) 관련 slice
 * 251229 v1.0.0 sara init
 */

import { createSlice } from '@reduxjs/toolkit';
import { questionStoreThunk } from '../thunks/questions/questionStoreThunk.js';

const initialState = {
  store: null,
  isLoading: false, // 추가 필수
  error: null,      // 추가 필수
};  

const slice = createSlice({
  name: 'questionStore',
  initialState,
  reducers: {
    // 등록 폼 초기화 시 사용
    clearQuestionStore(state) {
      state.store = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(questionStoreThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(questionStoreThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.store = action.payload.data; // 등록된 질문 데이터 저장 
      })
      .addCase(questionStoreThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }   
});

export const { 
  clearQuestionStore,
} = slice.actions;

export default slice.reducer;
