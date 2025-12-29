/**
 * @file src/store/thunks/authThunk.js
 * @description 인증 관련 텅크
 * 251216 v1.0.0 sara init 
 * 251229 v1.1.0 sara update 에러 핸들링 및 직렬화 대응 수정
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

/**
 * 1. 로그인 텅크
 * @payload { email: string }
 */
export const loginThunk = createAsyncThunk(
  'auth/loginThunk',
  async (args, { rejectWithValue }) => {
    try {
      const url = '/api/auth/social/login';
      const { email } = args;

      // 소셜 로그인 처리
      const response = await axiosInstance.post(url, { email });

      return response.data;
    }
    catch (error) {
      // 💡 해결: AxiosError 객체 대신 에러 데이터 또는 메시지만 반환
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * 2. 토큰 재발급 텅크
 * @description 쿠키에 담긴 Refresh Token을 사용하여 Access Token을 갱신합니다.
 */
export const reissueThunk = createAsyncThunk(
  'auth/reissueThunk',
  async (_, { rejectWithValue }) => {
    try {
      const url = '/api/auth/reissue';
      // 💡 axiosInstance에 withCredentials: true 설정이 되어 있어야 쿠키가 전송됩니다.
      const response = await axiosInstance.post(url);
      
      return response.data;
    }
    catch (error) {
      // 💡 "리프레시 토큰 없음" 등의 서버 에러 메시지를 프론트로 전달
      const errorMessage = error.response?.data?.message || "리프레시 토큰이 없거나 만료되었습니다.";
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * 3. 로그아웃 텅크
 */
export const logoutThunk = createAsyncThunk(
  'auth/logoutThunk',
  async (_, { rejectWithValue }) => {
    try {
      const url = '/api/auth/logout';
      const response = await axiosInstance.post(url);
      
      return response.data;
    }
    catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);