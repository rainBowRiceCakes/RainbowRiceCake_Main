import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosInstance';

// 1. 픽업 사진 업로드 Thunk (mat -> pick)
export const uploadPickupPhoto = createAsyncThunk(
  'orders/uploadPickupPhotoThunk',
  async ({ orderCode, formData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/orders/${orderCode}/pickup-photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // 브라우저가 boundary를 자동으로 붙이도록 유도
        },
      });
      return { orderCode, data: response.data }; // 서버가 바뀐 주문 객체나 성공여부를 반환한다고 가정
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// 2. 완료 사진 업로드 Thunk (pick -> com)
export const uploadCompletePhoto = createAsyncThunk(
  'orders/uploadCompletePhotoThunk',
  async ({ orderCode, formData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/orders/${orderCode}/complete-photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // 브라우저가 boundary를 자동으로 붙이도록 유도
        },
      });
      return { orderCode, data: response.data };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
