import { createSlice } from "@reduxjs/toolkit";
import { getProfileThunk } from "../thunks/profile/getProfileThunk.js";
import { updateProfileThunk } from "../thunks/profile/updateProfileThunk.js";
import { updateWorkStatusThunk } from "../thunks/riders/updateWorkStatusThunk.js";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profileData: null, // { id, email, name, rider_user: { isWorking, phone, address ... } }
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
        const incomingData = action.payload.data;

        if (!incomingData) return;

        // 기본적으로 들어온 데이터를 모두 펼쳐 넣고 (isWorking, phone, address 등 포함)
        // 중첩된 객체(rider_user 또는 partner_user)만 안전하게 병합합니다.
        state.profileData = {
          ...state.profileData,
          ...incomingData,

          // 기사 데이터인 경우 중첩 객체 병합
          ...(incomingData.rider_user && {
            rider_user: {
              ...state.profileData?.rider_user,
              ...incomingData.rider_user
            }
          }),

          // 파트너 데이터인 경우 중첩 객체 병합
          ...(incomingData.partner_user && {
            partner_user: {
              ...state.profileData?.partner_user,
              ...incomingData.partner_user
            }
          })
        };
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

        const newData = action.payload.data;
        if (!newData) return; // 데이터가 없는 경우 방어 로직

        // 1. 기사(Rider) 데이터 구조 처리
        if (newData.rider_user) {
          state.profileData = {
            ...state.profileData, // 기존 데이터 유지
            ...newData,           // 새 데이터(isWorking, address, phone 등) 덮어쓰기
            rider_user: {
              ...state.profileData?.rider_user, // 기존 유저 정보(name, email) 유지
              ...newData.rider_user             // 새 유저 정보 병합
            }
          };
        }
        // 2. 파트너(Partner) 데이터 구조 처리
        else if (newData.partner_user) {
          state.profileData = {
            ...state.profileData,
            ...newData,           // 파트너의 기본 정보들 덮어쓰기
            partner_user: {
              ...state.profileData?.partner_user,
              ...newData.partner_user
            }
          };
        }
        // 3. 그 외 공통 처리
        else {
          state.profileData = {
            ...state.profileData,
            ...newData
          };
        }
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
