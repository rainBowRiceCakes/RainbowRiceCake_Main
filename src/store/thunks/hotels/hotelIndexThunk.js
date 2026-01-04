import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosInstance.js'; // 설정된 axios 인스턴스

export const hotelIndexThunk = createAsyncThunk(
    'hotels/hotelIndexThunk',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/hotels');
            return response.data.data; // 서버 응답 구조에 맞게 조정
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);