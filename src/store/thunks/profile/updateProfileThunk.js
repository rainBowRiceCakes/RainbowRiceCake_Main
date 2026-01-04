import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance";

export const updateProfileThunk = createAsyncThunk(
  "profile/updateProfileThunk",
  async ({ phone, address, manager }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/api/profiles`, {
        phone,
        address,
        manager,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "정보 수정 실패");
    }
  }
);