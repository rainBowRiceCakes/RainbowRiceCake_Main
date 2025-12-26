/**
 * @file src/store/thunks/questionThunk.js
 * @description mainCS 고객 문의 사항 관련 텅크
 * 251216 v1.0.0 sara init 
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

export const createQuestionThunk = createAsyncThunk(
  "questions/createQuestionThunk",  // Thunk 고유명
  async (data, { rejectWithValue }) => {
    try {
      const url = "/api/questions";

      const response = await axiosInstance.post(url, data);
      return response.data; // { question } or created row
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);