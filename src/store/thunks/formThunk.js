import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

// 라이더 등록 신청
export const riderFormThunk = createAsyncThunk(
  "riders/riderform",
  async (formData, { rejectWithValue }) => {
    try {
      // 신청 데이터 전송
      const response = await axiosInstance.post("/api/users/rider/form", formData);
  
      return response.data;
    }
    catch (error) {
      // 에러 처리
      return rejectWithValue(error.response?.data || "등록에 실패했습니다.");
    }
  }
);

// 파트너 등록 신청
export const partnerFormThunk = createAsyncThunk(
  "partners/partnerform",
  async (formData, { rejectWithValue }) => {
    try {
      // 신청 데이터 전송
      const response = await axiosInstance.post("/api/users/partner/form", formData);
  
      return response.data;
    }
    catch (error) {
      // 에러 처리
      return rejectWithValue(error.response?.data || "등록에 실패했습니다.");
    }
  }
);