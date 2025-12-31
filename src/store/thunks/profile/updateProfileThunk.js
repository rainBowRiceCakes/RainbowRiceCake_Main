import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const updateProfileThunk = createAsyncThunk(
  "profile/updateProfileThunk",
  async ({ phone, address }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/profile`, {
        phone,
        address,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "정보 수정 실패");
    }
  }
);