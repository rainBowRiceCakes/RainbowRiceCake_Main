import axios from 'axios';
import { reissueThunk } from '../store/thunks/auth/authThunk.js';

// store 저장용 변수
let store = null;

// store 주입용 함수
export function injectStoreInAxios(_store) {
    store = _store;
}

// axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: '', // Vite proxy를 사용하므로 빈 문자열 (상대 경로로 /api 호출)
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    // 개발 환경에서 서버 도메인이 다르다.(크로스 도메인) 그렇지만 요청들을 주고 받을 수 있게, credential 정보를 담아서 보낼 수 있게 true로 설정. 기본은 false.
    // credential 정보: 1. 쿠키, 2. 헤더 authorization 항목
});

// axiosInstance.interceptors.response.use(
//     response => response,
//     error => {
//         if (error.response.status === 401) {
//             store.dispatch(reissueThunk()).unwrap();
//         }
//         return Promise.reject(error);
//     }
// );

export default axiosInstance;