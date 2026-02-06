import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getProfileThunk } from "../thunks/profile/getProfileThunk.js";
import { updateProfileThunk } from "../thunks/profile/updateProfileThunk.js";
import { updateWorkStatusThunk } from "../thunks/riders/updateWorkStatusThunk.js";
import { logoutThunk } from "../thunks/authThunk.js";

// ✅ 초기 상태 설정 시 storage를 읽어오는 것은 허용됩니다. (최초 1회 실행)
const hasToken = localStorage.getItem('accessToken');
const savedProfile = localStorage.getItem('cachedProfile');
const initialProfile = (hasToken && savedProfile) ? JSON.parse(savedProfile) : null;

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profileData: initialProfile,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearProfile(state) {
      state.profileData = null;
    }
  },
  extraReducers: (builder) => {
    // 헬퍼: 프로필 데이터 병합 로직 (구조 불일치 및 캐시 보존 대응)
    const mergeProfile = (state, incomingData) => {
      if (!incomingData) return;

      const prev = state.profileData || {};
      const next = incomingData;

      state.profileData = {
        ...prev,
        ...next,
        // 서버가 isWorking을 보내지 않을 경우 기존 캐시값 유지
        isWorking: next.isWorking ?? prev.isWorking,
        // 중첩 객체(rider_user, partner_user) 안전 병합
        ...(next.rider_user && {
          rider_user: { ...prev.rider_user, ...next.rider_user }
        }),
        ...(next.partner_user && {
          partner_user: { ...prev.partner_user, ...next.partner_user }
        })
      };
    };

    builder
      /* --- fulfilled: 성공 케이스 --- */
      .addCase(getProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        mergeProfile(state, action.payload.data);
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        mergeProfile(state, action.payload.data);
      })
      .addCase(updateWorkStatusThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.profileData) {
          state.profileData.isWorking = action.payload.isWorking;
        }
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.profileData = null;
      });

    /* --- Matchers: 공통 상태 처리 --- */
    builder
      // 모든 프로필 관련 Thunk의 pending 상태
      .addMatcher(
        isAnyOf(getProfileThunk.pending, updateProfileThunk.pending, updateWorkStatusThunk.pending),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      // 모든 프로필 관련 Thunk의 rejected 상태
      .addMatcher(
        isAnyOf(getProfileThunk.rejected, updateProfileThunk.rejected, updateWorkStatusThunk.rejected),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload?.msg || action.payload?.message || "작업 도중 오류가 발생했습니다.";
        }
      );
  },
});

export default profileSlice.reducer;