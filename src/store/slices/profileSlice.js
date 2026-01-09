import { createSlice } from "@reduxjs/toolkit";
import { getProfileThunk } from "../thunks/profile/getProfileThunk.js";
import { updateProfileThunk } from "../thunks/profile/updateProfileThunk.js";
import { updateWorkStatusThunk } from "../thunks/riders/updateWorkStatusThunk.js";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profileData: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfileThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profileData = action.payload.data;
      })
      .addCase(getProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        // action.payload가 {code, msg} 형태라면 msg만 저장
        state.error = action.payload?.msg || "프로필을 불러오지 못했습니다.";
      })
      .addCase(updateProfileThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profileData = { ...state.profileData, ...action.payload.data };
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "프로필 수정 실패";
      })
      .addCase(updateWorkStatusThunk.fulfilled, (state, action) => {
        if (state.profileData?.rider_user) {
          // Sequelize가 true/false를 사용하므로 그대로 대입
          state.profileData.rider_user.isWorking = action.payload.isWorking;
        }
      })
      .addCase(updateWorkStatusThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "출근/퇴근 상태 변경 실패";
      });
  },
});

export default profileSlice.reducer;
