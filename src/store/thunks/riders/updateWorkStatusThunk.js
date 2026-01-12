import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance.js";

export const updateWorkStatusThunk = createAsyncThunk(
  "riders/updateWorkStatus",
  async (isWorking, { rejectWithValue }) => {
    try {
      // isWorking은 true 혹은 false
      const response = await axiosInstance.put("/api/riders/updateWorkStatus", { isWorking });
      return response.data.data; // { isWorking: true } 반환 예상
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data?.message || "상태 변경 실패");
    }
  }
);