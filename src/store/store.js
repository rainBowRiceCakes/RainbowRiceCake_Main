/**
 * @file src/store/store.js
 * @description slice 모아두는 store파일
 * 251214 v1.0.0 wook 최초 생성
 */

import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice.js';
import formReducer from './slices/formSlice.js';
import questionStoreReducer from "./slices/questionStoreSlice.js";
import deliveryShowReducer from './slices/deliveryShowSlice.js';
import partnerStoreReducer from './slices/partnerStoreSlice.js';

export default configureStore ({
  reducer: {
    auth: authReducer,
    form: formReducer, // 준영님
    questionStore: questionStoreReducer,
    deliveryShow: deliveryShowReducer, // 배송현황에서 Go to My Deliveries 시 마이페이지로 이동 
    partnerStore: partnerStoreReducer,
  }
});