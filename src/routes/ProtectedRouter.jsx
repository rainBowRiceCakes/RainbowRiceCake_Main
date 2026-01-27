/**
 * @file src/routes/ProtectedRouter.jsx
 * @description 라우터
 * 251214 v1.0.0 wook init
 * 260103 v1.1.0 BSONG update 안전하게 role 기반 자동 리다이렉트 + direct URL 접근 처리
 * 260127 v1.2.0 sara update 3 step auth gating + fullscreen loader 
 */

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { reissueThunk } from "../store/thunks/authThunk.js";
import { clearAuth } from "../store/slices/authSlice.js";
import FullScreenLoader from "../components/common/FullScreenLoader.jsx";

export default function ProtectedRouter({ allowedRoles }) {
  const { isLoggedIn, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  const ROLE = { PTN: 'PTN', DLV: 'DLV', COM: 'COM', ADM: 'ADM' };
  const GUEST_ONLY_ROUTES = useMemo(() => [/^\/login$/], []);

  // [1] 스토리지에서 직접 신호 확인 (Redux보다 빠름)
  const hasLoginSignal = localStorage.getItem('isLoginSignal') === 'true';

  // [2] 인증 프로세스 완료 여부 관리 (가장 중요)
  // 새로고침 시: signal이 있으면 false(확인중), 없으면 true(확인할필요없음)
  const [isAuthChecked, setIsAuthChecked] = useState(!hasLoginSignal);

  useEffect(() => {
    let alive = true;

    async function verifySession() {
      // 1. 이미 리덕스에 데이터가 있다면 체크 완료
      if (isLoggedIn && user) {
        if (alive) setIsAuthChecked(true);
        return;
      }

      // 2. 로그인 신호가 있다면 토큰 재발급 시도
      if (hasLoginSignal) {
        try {
          await dispatch(reissueThunk()).unwrap();
        } catch (error) {
          console.error("Session restoration failed:", error);
          localStorage.removeItem("isLoginSignal");
          dispatch(clearAuth());
        } finally {
          if (alive) setIsAuthChecked(true);
        }
      } else {
        // 3. 신호조차 없다면 즉시 체크 완료 (비로그인 상태 확정)
        if (alive) setIsAuthChecked(true);
      }
    }

    verifySession();
    return () => { alive = false; };
  }, [dispatch, isLoggedIn, user, hasLoginSignal]);

  // [3] 로더 노출: 인증 확인이 끝나기 전까지는 하단의 Navigate 로직을 아예 '무시'함
  if (!isAuthChecked) {
    return <FullScreenLoader />;
  }

  // --- 여기서부터는 '인증 확인'이 끝난 READY 상태임 ---

  const isGuestRoute = GUEST_ONLY_ROUTES.some(regex => regex.test(location.pathname));

  // [4] 게스트 전용 페이지 처리 (로그인 상태면 홈으로)
  if (isGuestRoute) {
    if (isLoggedIn) return <Navigate to="/" replace />;
    return <Outlet />;
  }

  // [5] 비로그인 사용자 처리
  if (!isLoggedIn) {
    // 예외 페이지(랜딩, 소셜로그인 등)는 통과
    if (location.pathname === "/" || location.pathname === "/social") return <Outlet />;
    
    // 그 외엔 로그인으로 (replace와 state 전달로 복귀 경로 확보)
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // [6] Role 기반 자동 리다이렉트 (대시보드 분기)
  if (location.pathname === '/') {
    if (user?.role === ROLE.PTN) return <Navigate to="/partners" replace />;
    if (user?.role === ROLE.DLV) return <Navigate to="/riders" replace />;
  }

  // [7] 상세 권한 체크
  let rolesToVerify = allowedRoles;
  if (!rolesToVerify) {
    if (location.pathname.startsWith('/riders')) rolesToVerify = [ROLE.DLV, ROLE.ADM];
    else if (location.pathname.startsWith('/partners')) rolesToVerify = [ROLE.PTN, ROLE.ADM];
  }

  if (rolesToVerify && user && !rolesToVerify.includes(user.role)) {
    alert('접근 권한이 없습니다.');
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}