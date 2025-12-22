/**
 * @file src/store/store.js
 * @description slice 모아두는 store파일
 * 251214 v1.0.0 wook 최초 생성
 */

import { configureStore } from "@reduxjs/toolkit";
import ordersReducer from "./slices/ordersSlice.js";

const store = configureStore({
  reducer: {
    orders: ordersReducer,
  },
});

export default store;