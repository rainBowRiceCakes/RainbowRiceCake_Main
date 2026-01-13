/**
 * @file src/api/axiosInstance.js
 */

import axios from 'axios';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
import { reissueThunk } from '../store/thunks/authThunk.js';

// store 저장용 변수
let store = null;

// store 주입용 변수
export function injectStoreInAxios(_store) {
  store = _store;
}

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL, // 기본 URL(axios 호출 시 가장 앞에 자동으로 연결하여 동작)
  headers: { // 포스트맨에 있는 headers와 같음
    'Content-Type': 'application/json',
  },
  // 크로스 도메인(서로 다른 도메인)에 요청 보낼때 credential 정보를 담아서 보낼지 여부 설정
  // credential 정보: 1. 쿠키, 2. 헤더 Authorization 항목
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
  // 1. 리트라이 제외 URL 설정 (기존 유지)
  const noRetry = /^\/api\/auth\/reissue$/;

  let { accessToken } = store.getState().auth;
  const hasLoginSignal = !!localStorage.getItem('isLoginSignal');

  try {
    // 2. reissue 요청은 로직을 타지 않고 즉시 반환 (무한 루프 방지)
    if (noRetry.test(config.url)) {
      return config;
    }

    // 3. 로그인 신호가 있는데 토큰이 없거나(새로고침) 만료된 경우
    if (hasLoginSignal) {
      let shouldReissue = false;

      if (!accessToken) {
        // 새로고침으로 인해 리덕스에 토큰이 없는 상태
        shouldReissue = true;
      } else {
        // 토큰 만료 확인 (5분 전 미리 갱신)
        const claims = jwtDecode(accessToken);
        const now = dayjs().unix();
        const expTime = dayjs.unix(claims.exp).subtract(5, 'minute').unix();
        if (now >= expTime) {
          shouldReissue = true;
        }
      }

      if (shouldReissue) {
        // ✅ reissue 수행 및 새로운 토큰 확보
        const response = await store.dispatch(reissueThunk()).unwrap();
        // 백엔드 응답 구조에 따라 수정 (예: response.accessToken)
        accessToken = response.data?.accessToken || response.accessToken;
      }
    }

    // 4. 최종 확보된 토큰이 있다면 헤더에 주입
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  } catch (error) {
    // reissue 실패 시 (Refresh Token 만료 등) 요청 중단
    return Promise.reject(error);
  }
});

export default axiosInstance;