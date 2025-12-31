import { createSlice } from "@reduxjs/toolkit";
import { updateProfileThunk } from "../thunks/profile/updateProfileThunk";

const partnerSlice = createSlice({
  name: "partner",
  initialState: {
    profile: null, // 매장명, 점주이름, 이메일 등
    loading: false,
  },
  reducers: {
    setPartnerProfile: (state, action) => {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateProfileThunk.fulfilled, (state, action) => {
      // 공통 수정 성공 시 파트너 프로필의 주소/전화번호 업데이트
      if (state.profile) {
        state.profile.phone = action.payload.phone;
        state.profile.address = action.payload.address;
      }
    });
  },
});

export const { setPartnerProfile } = partnerSlice.actions;
export default partnerSlice.reducer;