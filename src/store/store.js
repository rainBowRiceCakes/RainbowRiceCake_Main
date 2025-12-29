/**
 * @file src/store/store.js
 * @description slice 모아두는 store파일
 * 251214 v1.0.0 wook 최초 생성
 */

import { configureStore } from "@reduxjs/toolkit";
import ordersReducer from "./slices/ordersSlice.js";
import noticesReducer from "./slices/noticesSlice.js";
import questionsReducer from "./slices/questionsSlice.js";

const store = configureStore({
  reducer: {
    orders: ordersReducer,
    notices: noticesReducer,
    questions: questionsReducer,
  },
});

export default store;


// slices과 연결