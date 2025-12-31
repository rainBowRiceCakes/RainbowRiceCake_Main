import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance";

// 주문 리스트
export const orderIndexThunk = createAsyncThunk(
	'orders/orderIndexThunk',
	async (args, { rejectWithValue }) => {
		try {
			const url = '/api/orders';
			const response = await axiosInstance.get(url, { params: args });

			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || { message: error.message });
		}
	}
);