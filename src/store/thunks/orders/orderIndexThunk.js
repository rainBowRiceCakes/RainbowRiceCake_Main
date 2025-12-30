import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance";

// 주문 리스트
export const orderIndexThunk = createAsyncThunk(
	'orders/orderIndexThunk',
	async ({ page = 1, limit = 9, from }, { rejectWithValue }) => {
		try {
			// 쿼리 파라미터 생성
			let query = `?page=${page}&limit=${limit}`;
			if (from) query += `&from=${from}`;

			const response = await axiosInstance.get(`/api/orders${query}`);
			return response.data;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);