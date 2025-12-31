/**
 * @file src/store/thunks/questionThunk.js
 * @description mainCS 고객 문의 사항 관련 텅크
 * POST /api/questions 질문 등록 처리
 * 251229 v1.0.0 sara init 
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

export const questionStoreThunk = createAsyncThunk(
  "questionStore/questionStoreThunk", // thunk 고유명
  async (data, { rejectWithValue }) => { // 순수 객체가 아닌 FormData를 직접 받음
    try {
      const url = `/api/questions`; // 제안하신 api/userQuestions 반영
      const response = await axiosInstance.post(url, data);
      if(!response.data) {
        throw new Error('questionRequestFailed');
      }
      return response.data; // 서버로부터 성공 응답 수령
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);