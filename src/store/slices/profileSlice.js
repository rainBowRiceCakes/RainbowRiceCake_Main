import { createSlice } from "@reduxjs/toolkit";
import { updateProfileThunk } from "../thunks/profile/updateProfileThunk";
import { getProfileThunk } from "../thunks/profile/getProfileThunk";

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
                state.error = action.payload;
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
