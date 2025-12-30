import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance";

// 공지사항 리스트
export const noticeIndexThunk = createAsyncThunk(
    'notices/noticeIndexThunk',
    async ({ page = 1, limit = 9, from }, { rejectWithValue }) => {
        try {
            // 쿼리 파라미터 생성
            let query = `?page=${page}&limit=${limit}`;
            if (from) query += `&from=${from}`;

            const response = await axiosInstance.get(`/api/notices/role${query}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);