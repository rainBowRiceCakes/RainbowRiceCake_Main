/**
 * @file src/store/thunks/questions/questionIndexThunk.js
 * @description Get the current user's question history.
 * 260103 v1.0.0 sara init
 * 260110 v1.0.1 sara axiosInstance 경로 수정
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosInstance.js';

export const questionIndexThunk = createAsyncThunk(
   'questions/questionIndex',
  async (_, { rejectWithValue }) => {
    try {
      const url = `/api/users/orders/history`;

      const response = await axiosInstance.get(url);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);