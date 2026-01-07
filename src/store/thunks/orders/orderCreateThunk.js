import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance.js";

export const orderPickupImageUploadThunk = createAsyncThunk(
	'orderCreate/orderPickupImageUploadThunk', // Thunk 고유명
	async ({ orderCode, file }, { rejectWithValue }) => {
		try {
			const url = `/api/orders/${orderCode}/pickup-photo`;
			const headers = {
				'Content-Type': 'multipart/form-data'
			};

			// 폼데이터 생성
			const formData = new FormData();
			formData.append('image', file);
			formData.append('orderCode', orderCode);

			const response = await axiosInstance.post(url, formData, { headers });

			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || { message: error.message });
		}
	}
);

export const orderCompleteImageUploadThunk = createAsyncThunk(
	'orderCreate/orderCompleteImageUploadThunk', // Thunk 고유명
	async ({ orderCode, file }, { rejectWithValue }) => {
		try {
			const url = `/api/orders/${orderCode}/complete-photo`;
			const headers = {
				'Content-Type': 'multipart/form-data'
			};

			// 폼데이터 생성
			const formData = new FormData();
			formData.append('image', file);
			formData.append('orderCode', orderCode);

			const response = await axiosInstance.post(url, formData, { headers });

			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || { message: error.message });
		}
	}
);

// 주문 생성 (파트너 대시보드용)
export const orderStoreThunk = createAsyncThunk(
	'orderCreate/orderStoreThunk', // Thunk 고유명
	async (data, { rejectWithValue }) => {
		try {
			const url = `/api/orders`;

			const response = await axiosInstance.post(url, data);

			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || { message: error.message });
		}
	}
);