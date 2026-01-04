import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance";

// 주문 상세 조회 (Show)
export const orderShowThunk = createAsyncThunk(
  'orders/orderShowThunk',
  async (orderId, { rejectWithValue }) => {
    try {
      // 주소 형식: /api/orders/:orderId
      const url = `/api/orders/${orderId}`;

      const response = await axiosInstance.get(url);

      return response.data.data;

    } catch (error) {
      // 에러 발생 시 기존 indexThunk와 동일한 방식으로 처리
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);