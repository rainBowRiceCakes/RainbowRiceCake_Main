/**
 * @file src/routes/ProtectedRouter.jsx
 * @description 라우터
 * 251214 v1.0.0 wook init
 * 260103 v1.1.0 BSONG update 안전하게 role 기반 자동 리다이렉트 + direct URL 접근 처리
 */

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { reissueThunk } from "../store/thunks/authThunk.js";
import { clearAuth } from "../store/slices/authSlice.js";

export default function ProtectedRouter({ allowedRoles }) {
  const { isLoggedIn, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  // 1. ⭐ 핵심: 쿠키 대신(또는 함께) localStorage의 로그인 신호를 확인
  // 자바스크립트가 즉시 읽을 수 있어 "Mount 즉시 로그인 상태" 유지가 가능합니다.
  const hasLoginSignal = !!localStorage.getItem('isLoginSignal');

  const [isReissuing, setIsReissuing] = useState(hasLoginSignal && !isLoggedIn);
  // 2. ⭐ 신호가 있다면 일단 인증 체크가 된 것으로 간주하여 Loading을 건너뜁니다.
  const [isAuthChecked, setIsAuthChecked] = useState(isLoggedIn || hasLoginSignal);

  const ROLE = { PTN: 'PTN', DLV: 'DLV', COM: 'COM', ADM: 'ADM' };
  const GUEST_ONLY_ROUTES = [/^\/login$/];

  useEffect(() => {
    async function restoreSession() {
      if (hasLoginSignal && !isLoggedIn) {
        try {
          setIsReissuing(true);
          // ✅ unwrap을 통해 성공 여부를 확실히 확인
          await dispatch(reissueThunk()).unwrap();
        } catch (error) {
          console.error('Session restoration failed:', error);
          localStorage.removeItem('isLoginSignal');
          dispatch(clearAuth());
        } finally {
          setIsReissuing(false);
        }
      }
    }

    if (location.pathname !== '/social') {
      restoreSession();
    }
  }, [dispatch, isLoggedIn, hasLoginSignal, location.pathname]);

  // 4. 로딩 가드 (신호도 없고 로그인도 안 된 완전 초기 상태만 로딩)
  if (!isAuthChecked) return null; // 또는 빈 div

  // 1️⃣ 유저 정보 복구 중(reissue 실행 중)이라면 대기 화면 (깜빡임 방지)
  if (isReissuing) return null;

  const isGuestRoute = GUEST_ONLY_ROUTES.some(regex => regex.test(location.pathname));

  // 5. 게스트 전용 페이지 처리
  if (isGuestRoute) {
    if (isLoggedIn) return <Navigate to="/" replace />;
    return <Outlet />;
  }

  // 3️⃣ 비로그인 사용자 처리
  if (!isLoggedIn) {
    if (location.pathname === '/' || location.pathname === '/social') return <Outlet />;

    // 신호가 없거나 복구가 실패했다면 로그인으로 보냄
    if (!hasLoginSignal) {
      alert('로그인이 필요한 서비스입니다.');
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return null;
  }

  // 7. 대시보드 Role 기반 자동 리다이렉트 및 권한 체크
  if (location.pathname === '/') {
    if (user?.role === ROLE.PTN) return <Navigate to="/partners" replace />;
    if (user?.role === ROLE.DLV) return <Navigate to="/riders" replace />;
  }

  let rolesToVerify = allowedRoles;
  if (!rolesToVerify) {
    if (location.pathname.startsWith('/riders')) rolesToVerify = [ROLE.DLV, ROLE.ADM];
    else if (location.pathname.startsWith('/partners')) rolesToVerify = [ROLE.PTN, ROLE.ADM];
  }

  // user 정보가 복구된 후 권한 체크
  if (rolesToVerify && user && !rolesToVerify.includes(user.role)) {
    alert('권한이 부족합니다.');
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}