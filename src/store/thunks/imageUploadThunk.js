import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

// 🛵 [라이더] 이미지 업로드 Thunk
export const riderImageUploadThunk = createAsyncThunk(
  'riderImageUpload/riderImageUploadThunk',
  async (file, { rejectWithValue }) => {
    try {
      const url = `/api/files/licenses`;
      const headers = {
        'Content-Type': 'multipart/form-data'
      };

      
      const formData = new FormData();
      formData.append('licenseImg', file);

      const response = await axiosInstance.post(url, formData, { headers });

      return response.data;
    }
    catch(error) {
      console.error("Rider Image Upload Error:", error);
      return rejectWithValue(error.response?.data || "이미지 업로드에 실패했습니다.");
    }
  }
);

// 🏢 [파트너] 이미지 업로드 Thunk
export const partnerImageUploadThunk = createAsyncThunk(
  'partnerImageUpload/partnerimageUploadThunk',
  async (file, { rejectWithValue }) => {
    try {
      // 2. URL 변경: 파일 업로드 API 주소
      const url = `/api/files/logos`;
      const headers = {
        'Content-Type': 'multipart/form-data'
      };
      
      const formData = new FormData();
      formData.append('logoImg', file);

      const response = await axiosInstance.post(url, formData, { headers });

      return response.data;
    }
    catch(error) {
      console.error("Partner Image Upload Error:", error);
      return rejectWithValue(error.response?.data || "이미지 업로드에 실패했습니다.");
    }
  }
);