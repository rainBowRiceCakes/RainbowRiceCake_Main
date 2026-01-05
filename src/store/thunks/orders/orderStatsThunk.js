// src/store/thunks/orders/orderStatsThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance.js"; // 경로/확장자 체크!

export const getHourlyStatsThunk = createAsyncThunk(
  'orders/getHourlyStatsThunk',
  async (_, { rejectWithValue }) => {
    try {
      // ✅ orderIndexThunk가 성공한다면, 이 인스턴스 호출도 성공해야 합니다.
      // 경로 앞에 /가 있는지, 혹은 상대 경로 문제인지 확인을 위해 base 없이 호출해봅니다.
      const response = await axiosInstance.get('/api/orders/stats/hourly');
      console.log('Axios 인스턴스가 준 생 데이터:', response);

      // 💡 여기서 중요한 점: orderIndexThunk는 response.data.data를 리턴합니다.
      // 백엔드 통계 API도 같은 구조({ data: [...] })인지 확인 후 리턴하세요.
      return response.data;
    } catch (error) {
      console.error("통계 API 에러 디테일:", error.response); // 에러 상세 로그 확인
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);