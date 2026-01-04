/**
 * @file src/store/thunks/questions/getMyQuestionsThunk.js
 * @description Get the current user's question history.
 * 260103 v1.0.0 sara init
 * 260110 v1.0.1 sara axiosInstance 경로 수정
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosInstance.js';

export const getMyQuestionsThunk = createAsyncThunk(
   'questions/getMyQuestions',
  async (data, { rejectWithValue }) => {
    try {
      const url = `/api/questions`;

      const response = await axiosInstance.get(url, data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);