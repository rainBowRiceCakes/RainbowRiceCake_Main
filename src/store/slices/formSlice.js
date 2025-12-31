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
        alert("라이더 신청이 접수되었습니다!");
      })
      .addCase(riderFormThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        alert("라이더 신청 실패: " + action.payload?.message);
      })

      // 파트너 신청
      .addCase(partnerFormThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(partnerFormThunk.fulfilled, (state) => {
        state.loading = false;
        alert("파트너 신청이 접수되었습니다!");
      })
      .addCase(partnerFormThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        alert("파트너 신청 실패: " + action.payload?.message);
      });
  }
});

export default slice.reducer;