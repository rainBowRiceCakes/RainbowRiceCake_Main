/**
 * @file src/store/store.js
 * @description slice 모아두는 store파일
 * 251214 v1.0.0 wook 최초 생성
 */

import { configureStore } from "@reduxjs/toolkit";
import ordersReducer from "./slices/ordersSlice.js";
import noticesReducer from "./slices/noticesSlice.js";
import questionsReducer from "./slices/questionsSlice.js";
import partnerMenuReducer from "./slices/partnerMenuSlice.js";
import riderReducer from "./slices/riderSlice.js";
import partnerReducer from "./slices/partnerSlice.js";

const store = configureStore({
  reducer: {
    orders: ordersReducer, // 통합된 주문 관리 (점주+기사 데이터 공유)
    notices: noticesReducer,
    questions: questionsReducer,
    menu: partnerMenuReducer,
    rider: riderReducer,
    partner: partnerReducer,
  },
});

export default store;


// slices과 연결