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

  // 2. ⭐ 신호가 있다면 일단 인증 체크가 된 것으로 간주하여 Loading을 건너뜁니다.
  const [isAuthChecked, setIsAuthChecked] = useState(isLoggedIn || hasLoginSignal);

  const ROLE = { PTN: 'PTN', DLV: 'DLV', COM: 'COM', ADM: 'ADM' };
  const GUEST_ONLY_ROUTES = [/^\/login$/];

  useEffect(() => {
    async function checkAuth() {
      // 3. 신호는 있는데 리덕스 정보(user, isLoggedIn)가 없다면 새로고침 상황!
      if (!isLoggedIn && hasLoginSignal) {
        try {
          if (location.pathname !== '/social') {
            // 서버에 조용히 reissue 요청하여 user 정보를 복구합니다.
            await dispatch(reissueThunk()).unwrap();
          }
        } catch (error) {
          console.error('ProtectedRouter: Session expired');
          localStorage.removeItem('isLoginSignal');
          dispatch(clearAuth());
        }
      }
      setIsAuthChecked(true);
    }

    if (location.pathname !== '/social') {
      checkAuth();
    } else {
      setIsAuthChecked(true);
    }
  }, [dispatch, isLoggedIn, location.pathname, hasLoginSignal]);

  // 4. 로딩 가드 (신호도 없고 로그인도 안 된 완전 초기 상태만 로딩)
  if (!isAuthChecked) return null; // 또는 빈 div

  const isGuestRoute = GUEST_ONLY_ROUTES.some(regex => regex.test(location.pathname));

  // 5. 게스트 전용 페이지 처리
  if (isGuestRoute) {
    if (isLoggedIn) return <Navigate to="/" replace />;
    return <Outlet />;
  }

  // 6. 비로그인 사용자 처리
  if (!isLoggedIn) {
    // 🚩 핵심: reissue 중일 때(hasLoginSignal은 true지만 isLoggedIn은 아직 false일 때) 
    // 여기서 바로 튕겨내지 않도록 잠시 기다려주는 로직이 필요할 수 있습니다.
    // 하지만 isLoggedIn이 비동기로 채워지므로, '/' 같은 공통 경로는 Outlet을 보여줍니다.
    if (location.pathname === '/' || location.pathname === '/social') {
      return <Outlet />;
    }

    // 완전히 로그아웃된 상태라면 로그인으로 리다이렉트
    if (!hasLoginSignal) {
      alert('로그인이 필요한 서비스입니다.');
      return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // 만약 reissue 중이라면 잠깐 아무것도 안 보여주고 대기 (깜빡임 방지)
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