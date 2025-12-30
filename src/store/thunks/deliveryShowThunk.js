/**
 * @file src/store/thunks/deliveryShowThunk.js
 * @description 배송 현황 상세 조회 Thunk (로그인-> my page/비로그인-ㅡmodal)
 * * GET /api/orders/deliverystatus/:dlvId
 * 251229 v1.0.0 sara init 
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

export const deliveryShowThunk = createAsyncThunk(
  "deliveryShow/deliveryShowThunk",  // thunk 고유명
  async (dlvId, { rejectWithValue }) => {
    try {
      // 서버에서 작성한 deliverystatus 엔드포인트를 호출
      const url = `/api/orders/deliverystatus/${dlvId}`;
      const response = await axiosInstance.get(url);

     return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);