import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance";

// 주문 상세 조회 (Show)
export const orderShowThunk = createAsyncThunk(
  'orders/orderShowThunk',
  async (orderCode, { rejectWithValue }) => {
    try {
      // 주소 형식: /api/orders/:orderCode
      const url = `/api/orders/${orderCode}`;
      console.log('🔍 orderShowThunk 요청:', url);

      const response = await axiosInstance.get(url);
      console.log('✅ orderShowThunk 응답:', response.data);

      // 응답 구조: { data: { order: {...}, images: {...}, timeline: {...} } }
      const responseData = response.data?.data || response.data;
      console.log('📦 API 응답 구조:', responseData);

      // ✅ order 객체 추출 (백엔드가 { order, images, timeline } 형태로 보내는 경우)
      const orderData = responseData?.order || responseData;
      console.log('📋 추출된 주문 데이터:', orderData);

      return orderData;

    } catch (error) {
      // 에러 발생 시 기존 indexThunk와 동일한 방식으로 처리
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);