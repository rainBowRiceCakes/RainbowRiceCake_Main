import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance";

// 공지사항 리스트
export const noticeIndexThunk = createAsyncThunk(
    'notices/noticeIndexThunk',
    async (args, { rejectWithValue }) => {
        try {
            // /api/notices/role 대신 /api/notices 를 사용하고 'from' 파라미터를 통해 역할을 구분합니다.
            // 이는 백엔드에서 /api/notices/:id 와 /api/notices/role 간의 라우팅 충돌(E21 에러)을 방지합니다.
            const url = '/api/notices';
            const response = await axiosInstance.get(url, { params: args });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);