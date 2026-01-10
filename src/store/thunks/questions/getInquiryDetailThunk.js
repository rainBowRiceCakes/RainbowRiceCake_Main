import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance.js";

export const getInquiryDetailThunk = createAsyncThunk(
	'inquiry/getInquiryDetailThunk',
	async (id, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(`/api/questions/${id}`);
			return response.data.data;
		} catch (err) {
			return rejectWithValue(err.response?.data || '상세 내용을 불러오지 못했습니다.');
		}
	}
);