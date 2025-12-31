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
import uiReducer from "./slices/partnerUiSlice.js";
import deliveryReducer from "./slices/parternerDeliverySlice.js";
import profileReducer from "./slices/profileSlice.js";
import authReducer from './slices/authSlice.js';
import formReducer from './slices/formSlice.js';
import questionStoreReducer from "./slices/questionStoreSlice.js";
import deliveryShowReducer from './slices/deliveryShowSlice.js';
import partnerStoreReducer from './slices/partnerStoreSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    form: formReducer, // 준영님
    questionStore: questionStoreReducer,
    deliveryShow: deliveryShowReducer, // 배송현황에서 Go to My Deliveries 시 마이페이지로 이동 
    partnerStore: partnerStoreReducer,
    orders: ordersReducer, // 통합된 주문 관리 (점주+기사 데이터 공유)
    notices: noticesReducer,
    questions: questionsReducer,
    menu: partnerMenuReducer,
    rider: riderReducer,
    partner: partnerReducer,
    profile: profileReducer,
    ui: uiReducer, // UI 상태 관리 (사이드바 접기/펼치기 등)
    delivery: deliveryReducer, // 배송 요청 상태 관리
  },
});

export default store;


// slices과 연결