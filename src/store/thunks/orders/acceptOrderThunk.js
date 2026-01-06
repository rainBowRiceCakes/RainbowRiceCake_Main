import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosInstance.js';

// 비동기 thunk 생성
export const acceptOrderThunk = createAsyncThunk(
  'orders/acceptOrder',
  async (orderCode, { rejectWithValue }) => { // ⬅️ 인자를 orderCode 하나만 받음
    try {
      // 💡 userId를 body에 담지 않아도, axiosInstance가 보낼 '토큰'을 보고 서버가 처리함
      const response = await axiosInstance.put(`/api/orders/${orderCode}`);

      // 서버 응답 데이터(createBaseResponse 형태)를 반환
      // 보통 response.data.result 안에 업데이트된 주문 정보가 들어있을 것임
      return {
        orderCode,
        updatedOrder: response.data
      };
    } catch (err) {
      // 에러 객체가 없을 경우를 대비한 안전장치
      return rejectWithValue(err.response?.data || { message: "주문 수락에 실패했습니다." });
    }
  }
);