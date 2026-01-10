import { createSlice } from "@reduxjs/toolkit";
import { loginThunk, logoutThunk } from "../thunks/authThunk.js";
import { reissueThunk } from "../thunks/authThunk.js";

const hasLoginSignal = !!localStorage.getItem('isLoginSignal');

const initialState = {
  accessToken: null,
  user: null,
  // 2. 신호가 있으면(True) -> 리덕스가 켜지자마자 로그인 상태로 시작! (깜빡임 X)
  isLoggedIn: hasLoginSignal,
  isAuthChecked: false,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth(state) {
      state.accessToken = null;
      state.user = null;
      state.isLoggedIn = false;
      state.isAuthChecked = true;
      // 3. 로그아웃 하면 신호 제거
      localStorage.removeItem('isLoginSignal');
    }
  },
  extraReducers: (builder) => {
    builder
      // 로그인 성공
      .addCase(loginThunk.fulfilled, (state, action) => {
        const { accessToken, user } = action.payload.data;
        state.accessToken = accessToken;
        state.user = user;
        state.isLoggedIn = true;
        state.isAuthChecked = true;
        // 4. 로그인 성공했으니 깃발 꽂기
        localStorage.setItem('isLoginSignal', '1');
      })
      // 새로고침 후 토큰 재발급 성공
      .addCase(reissueThunk.fulfilled, (state, action) => {
        const { accessToken, user } = action.payload.data;
        state.accessToken = accessToken;
        state.user = user;
        state.isLoggedIn = true;
        state.isAuthChecked = true;
        // 깃발 유지
        localStorage.setItem('isLoginSignal', '1');
      })
      // 재발급 실패 (세션 만료)
      .addCase(reissueThunk.rejected, (state) => {
        state.isLoggedIn = false;
        state.isAuthChecked = true;
        // 5. 진짜 만료됐으면 그때 깃발 뽑고 로그아웃 처리
        localStorage.removeItem('isLoginSignal');
      })
      // 로그아웃
      .addCase(logoutThunk.fulfilled, (state) => {
        state.accessToken = null;
        state.user = null;
        state.isLoggedIn = false;
        state.isAuthChecked = true;
        localStorage.removeItem('isLoginSignal');
      });
  }
});

export const { clearAuth } = slice.actions;
export default slice.reducer;