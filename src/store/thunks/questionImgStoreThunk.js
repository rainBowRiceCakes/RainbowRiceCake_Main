/**
 * @file src/store/thunks/questionThunk.js
 * @description mainCS 고객 문의 사항 관련 텅크
 * POST /api/questions 질문 등록 처리
 * 251229 v1.0.0 sara init 
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

export const questionImgStoreThunk = createAsyncThunk(
  "questionImgStore/questionImgStoreThunk", // thunk 고유명
  async (file, { rejectWithValue }) => { // 순수 객체가 아닌 FormData를 직접 받음
    try {
      const url = `/api/file/attachments`; // 제안하신 api/userQuestions 반영
      const headers = {
      'Content-Type': 'multipart/form-data', // 파일 전송을 위한 헤더 설정
      };
      const formData = new FormData();
      formData.append('qnaImg', file);
      const response = await axiosInstance.post(url, formData, { headers });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);