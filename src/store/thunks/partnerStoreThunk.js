// /**
//  * @file src/store/thunks/partnerStoreThunk.js
//  * @description 매장 정보 및 좌표(X, Y) 자동 저장 텅크
//  * * POST /api/admin/partners
//  * 251229 v1.0.0 sara init 
//  */

// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axiosInstance from "../../api/axiosInstance.js";

// export const partnerStoreThunk = createAsyncThunk(
//   "partnerStore/partnerStoreThunk",
//   async (data, { rejectWithValue }) => {
//     try {
//       console.log("PartnerStore 전송 데이터 체크:", data);
//       // partnerData 내부에 { address, x, y, storeName } 등이 포함됨
//       const url = `/api/admin/partners/`;
//       const response = await axiosInstance.post(url, data);

//      return response.data;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );


/**
 * @file src/store/thunks/partnerStoreThunk.js
 */
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

export const partnerStoreThunk = createAsyncThunk(
  "partnerStore/partnerStoreThunk",
  async (data, { rejectWithValue }) => {
    // 💡 네트워크 에러가 나더라도 이 로그는 콘솔에 찍힙니다.
    console.log("coordinateCheckDataToServer", data); 

    try {
      const url = `/api/admin/partners/`;
      const response = await axiosInstance.post(url, data); 
      return response.data;
    } catch (error) {
      // ERR_NETWORK 발생 시에도 여기 로그가 찍힙니다.
      console.error("networkErrorBackendCheckRequired", error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);