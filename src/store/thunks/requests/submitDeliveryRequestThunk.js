import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance";

export const submitDeliveryRequest = createAsyncThunk(
  "orders/submitDeliveryRequest",
  async (payload, { rejectWithValue }) => {
    try {
      // payload에는 이미 firstName, lastName, email, hotelId, plans, price가 
      // 평평하게(Flat) 담겨 있습니다.
      const response = await axiosInstance.post("/api/orders", payload);

      return response.data;
    } catch (error) {
      // 서버에서 보낸 에러 메시지(예: "결제 금액 정보가 일치하지 않습니다")를 반환
      return rejectWithValue(error.response?.data || { message: "주문 등록 중 오류가 발생했습니다." });
    }
  }
);

// 샘플 데이터 형식
// {
//   "plans": [
//     {
//       "id": "basic",
//       "name": "Basic (베이직)",
//       "price": 5000,
//       "quantity": 2
//     },
//     {
//       "id": "standard",
//       "name": "Standard (스탠다드)",
//       "price": 8000,
//       "quantity": 1
//     }
//   ],
//   "customer": {
//     "firstName": "Gildong",
//     "lastName": "Hong",
//     "email": "gildong@example.com",
//     "hotel": 101
//   }
// }