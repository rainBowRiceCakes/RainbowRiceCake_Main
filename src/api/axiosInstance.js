/**
 * @file src/api/axiosInstance.js
 */
import axios from 'axios';

const axiosInstance = axios.create({
  // 💡 백엔드 서버(포트 3000)가 켜져 있는지 확인하세요!
  baseURL: 'http://localhost:3000', 
  timeout: 5000,
  withCredentials: true, // 💡 refresh token 쿠키 전송을 위해 추가
});

// 요청 인터셉터에서 토큰 로직을 잠시 꺼둡니다.
axiosInstance.interceptors.request.use(
  (config) => {
    /* 토큰 체크 로직 주석 처리 
    if (store) {
      const state = store.getState();
      ...
    }
    */
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;