import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

// 라이더 등록 신청
export const riderFormThunk = createAsyncThunk(
  "riders/riderform",
  async (formData, { rejectWithValue }) => {
    try {
      // 디버깅용: formData 내용 확인 (브라우저 콘솔에서 확인 가능)
      for (let pair of formData.entries()) {
        console.log(`[RiderThunk Data] ${pair[0]}: ${pair[1]}`);
      }

      // 신청 데이터 전송
      const response = await axiosInstance.post("/api/users/rider/form", formData, {
        header: {
          "Content-Type": "multipart/form-data", // 파일 업로드를 위해 명시
        },
      });
  
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
      // 디버깅용: formData 내용 확인 (브라우저 콘솔에서 확인 가능)
      for (let pair of formData.entries()) {
        console.log(`[PartnerThunk Data] ${pair[0]}: ${pair[1]}`);
      }

      // 신청 데이터 전송
      const response = await axiosInstance.post("/api/users/partner/form", formData, {
          header: {
          "Content-Type": "multipart/form-data", // 파일 업로드를 위해 명시
        },
      });
  
      return response.data;
    }
    catch (error) {
      // 에러 처리
      return rejectWithValue(error.response?.data || "등록에 실패했습니다.");
    }
  }
);