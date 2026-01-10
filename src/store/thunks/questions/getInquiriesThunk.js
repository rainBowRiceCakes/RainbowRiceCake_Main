import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosInstance.js'; // 또는 프로젝트에서 사용하는 api 인스턴스

// 1. 전체 문의 내역 가져오기
export const getInquiriesThunk = createAsyncThunk(
  'inquiry/getInquiriesThunk',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/questions');
      return response.data.data; // [ {id, title, status, createdAt, ...}, ... ]
    } catch (err) {
      return rejectWithValue(err.response?.data || '목록을 불러오지 못했습니다.');
    }
  }
);