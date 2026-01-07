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

  // 인증 확인 상태 (이미 로그인된 상태라면 true로 시작)
  const [isAuthChecked, setIsAuthChecked] = useState(isLoggedIn);

  const ROLE = { PTN: 'PTN', DLV: 'DLV', COM: 'COM' };
  const GUEST_ONLY_ROUTES = [/^\/login$/];

  useEffect(() => {
    async function checkAuth() {
      // 1. 로그인이 안 되어 있을 때만 reissue 시도 (새로고침 대비)
      if (!isLoggedIn) {
        try {
          // Social.jsx와 중복되지 않도록 Social 경로에서는 실행 방지 로직을 넣거나
          // 단순히 비로그인 상태에서만 실행되게 합니다.
          if (location.pathname !== '/social') {
            await dispatch(reissueThunk()).unwrap();
          }
        } catch (error) {
          console.log('ProtectedRouter: Session expired or no token');
          dispatch(clearAuth());
        }
      }
      setIsAuthChecked(true);
    }

    // 소셜 로그인 진행 중인 페이지(/social)가 아닐 때만 체크 수행
    if (location.pathname !== '/social') {
      checkAuth();
    } else {
      // /social 페이지 자체는 Social.jsx가 처리하므로 체크 완료 처리
      setIsAuthChecked(true);
    }
  }, [dispatch, isLoggedIn, location.pathname]);

  // 1. 초기 로딩 처리 (reissue 완료 전까지 대기)
  if (!isAuthChecked) return <div>Loading...</div>;

  const isGuestRoute = GUEST_ONLY_ROUTES.some(regex => regex.test(location.pathname));

  // 2. 게스트 전용 페이지 (이미 로그인했는데 /login 접근 시)
  if (isGuestRoute) {
    if (isLoggedIn) return <Navigate to="/" replace />;
    return <Outlet />;
  }

  // 3. 비로그인 사용자 처리
  if (!isLoggedIn) {
    // 예외 처리: 메인 페이지('/')나 소셜 처리 페이지는 로그인이 없어도 튕기지 않음
    if (location.pathname === '/' || location.pathname === '/social') {
      return <Outlet />;
    }

    // 그 외의 보호된 경로는 로그인 페이지로 보냄
    alert('로그인이 필요한 서비스입니다.');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 4. 로그인된 유저가 '/' 접속 시 Role 기반 자동 리다이렉트 (기존 유지)
  if (location.pathname === '/') {
    if (user?.role === ROLE.PTN) return <Navigate to="/partners" replace />;
    if (user?.role === ROLE.DLV) return <Navigate to="/riders" replace />;
    return <Outlet />; // 일반 유저나 관리자는 메인 홈을 볼 수 있음
  }

  // 5. 특정 권한이 필요한 페이지 접근 제어
  let rolesToVerify = allowedRoles;
  if (!rolesToVerify) {
    if (location.pathname.startsWith('/riders')) rolesToVerify = [ROLE.DLV, ROLE.ADM];
    else if (location.pathname.startsWith('/partners')) rolesToVerify = [ROLE.PTN, ROLE.ADM];
  }

  // user 정보가 있고 rolesToVerify가 있을 때 체크
  if (rolesToVerify && user && !rolesToVerify.includes(user.role)) {
    alert('권한이 부족합니다.');
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}