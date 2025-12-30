import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const updateProfileThunk = createAsyncThunk(
  "profile/update",
  async ({ phone, address, userRole }, { rejectWithValue }) => {
    try {
      // userType(예: 'DLV', 'PTN')에 따라 엔드포인트를 동적으로 결정하거나
      // 서버에서 토큰을 통해 알아서 처리하게 할 수 있습니다.
      const response = await axios.patch(`/api/${userRole.toLowerCase()}/profile`, {
        phone,
        address,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "정보 수정 실패");
    }
  }
);