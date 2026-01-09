import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosInstance.js';

// 1. Thunk: 백엔드 API 호출
export const getSettlementThunk = createAsyncThunk(
  'settlement/getSettlement',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/riders/settlement'); // 실제 API 엔드포인트
      return response.data; // 백엔드에서 준 raw data (year, month 등 포함)
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);