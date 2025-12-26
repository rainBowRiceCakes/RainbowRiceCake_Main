/**
 * @file src/store/slices/questionSlice.js
 * @description 고객 문의(questions) 관련 slice
 * 251226 v1.1.0 sara restore file
 */
import { createSlice } from '@reduxjs/toolkit';
import { createQuestionThunk } from '../thunks/questionThunk';

const initialState = {
  create: {
    loading: false,
    data: null,
    error: null,
  },
};

const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    clearCreateState: (state) => {
      state.create = initialState.create;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createQuestionThunk.pending, (state) => {
        state.create.loading = true;
        state.create.data = null;
        state.create.error = null;
      })
      .addCase(createQuestionThunk.fulfilled, (state, action) => {
        state.create.loading = false;
        state.create.data = action.payload;
        state.create.error = null;
      })
      .addCase(createQuestionThunk.rejected, (state, action) => {
        state.create.loading = false;
        state.create.data = null;
        state.create.error = action.payload;
      });
  },
});

export const { clearCreateState } = questionSlice.actions;
export default questionSlice.reducer;
