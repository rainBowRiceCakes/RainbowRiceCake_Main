import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosInstance.js';

export const getSettlementDetailThunk = createAsyncThunk(
  'settlement/getSettlementDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/riders/settlement/${id}`);
      return response.data; // { code: '00', data: [...] } 구조 가정
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);