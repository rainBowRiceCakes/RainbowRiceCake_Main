import { createSlice } from "@reduxjs/toolkit";
import { updateProfileThunk } from "../thunks/profile/updateProfileThunk.js";
import { getProfileThunk } from "../thunks/profile/getProfileThunk.js";

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
            })
            .addCase(updateProfileThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profileData = { ...state.profileData, ...action.payload.data };
            })
            .addCase(updateProfileThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default profileSlice.reducer;
