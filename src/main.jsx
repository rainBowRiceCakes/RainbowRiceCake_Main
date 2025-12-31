/**
 * @file src/main.jsx
 * @description main컴포넌트
 * 251210 v1.0.0 wook 최초 생성
 */

import { createRoot } from 'react-dom/client'
import Router from './routes/Router.jsx';
import './index.css'
import { Provider } from 'react-redux';
import store from './store/store.js';
import { LanguageProvider } from './context/LanguageProvider.jsx';
import { injectStoreInAxios } from './api/axiosInstance.js';


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <LanguageProvider>
      <Router />
    </LanguageProvider>
  </Provider>
)

// 스토어가 생성되자마자 axiosInstance에 주입
injectStoreInAxios(store);