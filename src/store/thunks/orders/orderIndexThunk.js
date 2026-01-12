import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance";

// 주문 리스트
export const orderIndexThunk = createAsyncThunk(
  'orders/orderIndexThunk',
  async (args, { rejectWithValue }) => {
    try {
      const url = '/api/orders';

      // 💡 쿼리 파라미터 조립을 위한 객체 생성
      const params = new URLSearchParams();

      Object.entries(args).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // 💡 배열인 경우 (status: ['match', 'pick'])
          // 결과: status=match&status=pick (대괄호 없음!)
          value.forEach(v => params.append(key, v));
        } else if (value !== undefined && value !== null) {
          // 일반 값인 경우
          params.append(key, value);
        }
      });

      // params.toString()은 자동으로 "date=today&page=1&status=match&status=pick" 형태가 됩니다.
      const response = await axiosInstance.get(`${url}?${params.toString()}`);

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);