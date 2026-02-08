import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance";

/**
 * 진행 중인 주문 목록 조회 (배차됨 mat, 픽업함 pick)
 */
export const orderOngoingThunk = createAsyncThunk(
    'orders/orderOngoingThunk',
    async ({ riderId }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/orders', {
                params: {
                    riderId,
                    status: 'mat,pick',
                    limit: 100,
                    page: 1
                }
            });

            const data = response.data?.data;
            // 응답 데이터 구조에 맞춰 정규화
            const ordersArray = data?.data || data?.rows || (Array.isArray(data) ? data : []);

            return ordersArray;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);
