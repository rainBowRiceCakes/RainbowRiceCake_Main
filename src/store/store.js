/**
 * @file src/store/store.js
 * @description slice 모아두는 store파일
 * 251214 v1.0.0 wook 최초 생성
 * 251226 v1.1.0 jun
 */

import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice.js';

export default configureStore ({
  reducer: {
    auth:authReducer,
  }
});