import { createSlice } from '@reduxjs/toolkit';
import { partnerFormThunk, riderFormThunk } from '../thunks/formThunk.js';

const initialState = {
  loading: false,
  error: null,
}

const slice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    clearAuth(state) {
      state.accessToken = null;
      state.user = null;
      state.isLoggedIn = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // 라이더 신청
      .addCase(riderFormThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(riderFormThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(riderFormThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 파트너 신청
      .addCase(partnerFormThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(partnerFormThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(partnerFormThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default slice.reducer;