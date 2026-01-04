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
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // ROLE 정의
  const ROLE = { ADM: 'ADM', PTN: 'PTN', DLV: 'DLV', COM: 'COM' };
  const { ADM, DLV, PTN, COM } = ROLE;

  // 게스트 전용 라우트
  const GUEST_ONLY_ROUTES = [/^\/login$/];

  // 인증 체크
  useEffect(() => {
    async function checkAuth() {
      if (!isLoggedIn) {
        try {
          await dispatch(reissueThunk()).unwrap();
        } catch (error) {
          console.log('ProtectedRouter: Auth check failed', error);
          dispatch(clearAuth());
        }
      }
      setIsAuthChecked(true);
    }
    checkAuth();
  }, [dispatch, isLoggedIn]);

  // 로딩 중 또는 user 정보가 아직 준비 안됨
  if (!isAuthChecked || (isLoggedIn && !user)) {
    return <div>Loading...</div>; // 여기 대신 스피너 컴포넌트 넣어도 OK
  }

  const isGuestRoute = GUEST_ONLY_ROUTES.some(regex => regex.test(location.pathname));

  // 게스트 전용 페이지 처리
  if (isGuestRoute) {
    if (isLoggedIn) return <Navigate to="/" replace />;
    return <Outlet />;
  }

  // 로그인 필수 페이지 처리
  if (!isLoggedIn) {
    alert('로그인이 필요한 서비스입니다.');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // role 기반 허용 경로
  let rolesToVerify = allowedRoles;
  if (!rolesToVerify) {
    if (location.pathname.startsWith('/riders')) rolesToVerify = [DLV, ADM];
    else if (location.pathname.startsWith('/partners')) rolesToVerify = [PTN, ADM];
    else rolesToVerify = [COM, DLV, PTN, ADM];
  }

  // 권한 체크
  if (rolesToVerify && !rolesToVerify.includes(user.role)) {
    alert('권한이 부족하여 사용할 수 없습니다.');
    return <Navigate to="/" replace />;
  }

  // 로그인 후 role 기반 자동 리다이렉트
  if (location.pathname === '/') {
    switch (user.role) {
      case PTN: return <Navigate to="/partners" replace />;
      case DLV: return <Navigate to="/riders" replace />;
      default: return <Outlet />;
    }
  }

  // 모든 체크 통과
  return <Outlet />;
}