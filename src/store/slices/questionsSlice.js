/**
 * @file src/store/slices/questionsSlice.js
 * @description Questions/Issues slice for managing question submissions and history.
 */

import { createSlice } from "@reduxjs/toolkit";
import { questionImageUploadThunk, questionStoreThunk } from "../thunks/questions/questionStoreThunk.js";
import { questionIndexThunk } from "../thunks/questions/questionIndexThunk.js";

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
        clearQuestions: (state) => {
            state.questions = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Thunk for fetching user's question history
            .addCase(questionIndexThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(questionIndexThunk.fulfilled, (state, action) => {
                state.loading = false;
                // Assuming the payload is the array of questions
                state.questions = action.payload.data || [];
            })
            .addCase(questionIndexThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = {
                    message: action.payload?.message || 'Failed to fetch question history',
                    status: action.payload?.status,
                };
            })
            // Thunk for uploading an image for a question
            .addCase(questionImageUploadThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(questionImageUploadThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(questionImageUploadThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = {
                    message: action.payload?.message || 'Upload failed',
                    status: action.payload?.response?.status,
                    data: action.payload?.response?.data
                };
            })
            // Thunk for submitting a new question
            .addCase(questionStoreThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(questionStoreThunk.fulfilled, (state, action) => {
                state.loading = false;
                // Add the new question to the list
                state.questions.unshift(action.payload.data);
            })
            .addCase(questionStoreThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = {
                    message: action.payload?.message || 'Request failed',
                    status: action.payload?.response?.status,
                    data: action.payload?.response?.data
                };
            });
    },
});

export const { clearError, clearQuestions } = questionsSlice.actions;
export default questionsSlice.reducer;
