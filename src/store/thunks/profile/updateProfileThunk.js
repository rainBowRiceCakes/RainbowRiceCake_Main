import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const updateProfileThunk = createAsyncThunk(
  "profile/updateProfileThunk",
  async ({ phone, address, userRole }, { rejectWithValue }) => {
    try {
      // 1. userRole에 따른 경로 매핑
      const rolePathMap = {
        DLV: "rider",
        PTN: "partner",
      };

      // 2. 매핑된 경로 가져오기 (기본값 설정 가능)
      const targetPath = rolePathMap[userRole];

      // 3. API 요청
      const response = await axios.put(`/api/${targetPath}/profile`, {
        phone,
        address,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "정보 수정 실패");
    }
  }
);