/**
 * @file src/store/slices/questionsSlice.js
 * @description Questions/Issues slice for managing question submissions
 */

import { createSlice } from "@reduxjs/toolkit";
import { questionImageUploadThunk, questionStoreThunk } from "../thunks/questions/questionStoreThunk.js";

const initialState = {
    questions: [],
    loading: false,
    error: null,
};

const questionsSlice = createSlice({
    name: "questions",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // questionImageUploadThunk
            .addCase(questionImageUploadThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(questionImageUploadThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(questionImageUploadThunk.rejected, (state, action) => {
                state.loading = false;
                // Only store serializable error data
                state.error = {
                    message: action.payload?.message || 'Upload failed',
                    status: action.payload?.response?.status,
                    data: action.payload?.response?.data
                };
            })
            // questionStoreThunk
            .addCase(questionStoreThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(questionStoreThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.questions.push(action.payload);
            })
            .addCase(questionStoreThunk.rejected, (state, action) => {
                state.loading = false;
                // Only store serializable error data
                state.error = {
                    message: action.payload?.message || 'Request failed',
                    status: action.payload?.response?.status,
                    data: action.payload?.response?.data
                };
            });
    },
});

export const { clearError } = questionsSlice.actions;
export default questionsSlice.reducer;
