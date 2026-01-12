/**
 * @file src/store/thunks/partnerCarouselThunk.js
 * @description 파트너 로고 이미지 목록 조회 Thunk
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js"; // 공통 axios 인스턴스 경로 확인 필요

export const partnerCarouselThunk = createAsyncThunk(
  'partnerCarousel/getpartnerCarouselThunk',
  async (_, { rejectWithValue }) => {
    try {
      // 백엔드 라우터 경로
      const response = await axiosInstance.get('/api/files/carousel');
      
      // 응답 구조 유연성 확보
      const rawData = response.data?.data || response.data?.result || [];
      
      // 배열이 아니면 빈 배열로 처리
      if (!Array.isArray(rawData)) {
        return [];
      }

      // 유효한 URL만 필터링
      return rawData.filter(url => url && typeof url === 'string' && url.trim() !== '');
    }
    catch (error) {
      // 에러 처리
      return rejectWithValue(error.response?.data || "이미지 로딩 실패");
    }
  }
);