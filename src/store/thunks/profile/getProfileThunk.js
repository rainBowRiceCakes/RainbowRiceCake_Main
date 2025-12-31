import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance";

export const getProfileThunk = createAsyncThunk(
  "profile/getProfileThunk",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/profile");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "프로필 조회 실패" });
    }
  }
);
