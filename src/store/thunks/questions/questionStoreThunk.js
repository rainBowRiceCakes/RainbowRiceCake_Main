import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance.js";

export const questionImageUploadThunk = createAsyncThunk(
  'questionCreate/questionImageUploadThunk', // Thunk 고유명
  async (file, { rejectWithValue }) => {
    try {
      const url = `/api/files/attachments`;
      const headers = {
        'Content-Type': 'multipart/form-data'
      };

      // 폼데이터 생성
      const formData = new FormData();
      formData.append('qnaImg', file);

      const response = await axiosInstance.post(url, formData, { headers });

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const questionStoreThunk = createAsyncThunk(
  'questionCreate/questionStoreThunk', // Thunk 고유명
  async (data, { rejectWithValue }) => {
    try {
      const url = `/api/questions`;

      const response = await axiosInstance.post(url, data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);