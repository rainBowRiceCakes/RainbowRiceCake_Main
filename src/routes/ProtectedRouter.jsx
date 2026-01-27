/**
 * @file src/routes/ProtectedRouter.jsx
 * @description 라우터
 * 251214 v1.0.0 wook init
 * 260103 v1.1.0 BSONG update 안전하게 role 기반 자동 리다이렉트 + direct URL 접근 처리
 * 260127 v1.2.0 sara update 3 step auth gating + fullscreen loader 
 */

import { useEffect, useState } from "react";
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
  const GUEST_ONLY_ROUTES = [/^\/login$/];

  // 1. 로그인 신호 확인 (브라우저 스토리지)
  const hasLoginSignal = (() => {
    try { return !!localStorage.getItem('isLoginSignal'); }
    catch { return false; }
  })();

  /** * 2. Phase 상태 세분화
   * INITIAL: 앱 시작 시 즉시 판단이 모호한 상태 (로더 유지)
   * REISSUE: 토큰 재발급 진행 중 (로더 유지)
   * READY: 모든 검증 완료 (비로소 페이지 이동 허용)
   */
  const [phase, setPhase] = useState(() => {
    // 이미 Redux에 정보가 있으면 바로 READY
    if (isLoggedIn) return 'READY';
    // 로그인 신호는 있는데 Redux가 비어있다면 새로고침된 상황 -> REISSUE 단계로 시작
    if (hasLoginSignal) return 'REISSUE';
    // 둘 다 없으면 비로그인 상태로 간주하고 READY
    return 'READY';
  });

  useEffect(() => {
    let alive = true;

    async function restoreSession() {
      // 이미 로그인 상태거나 소셜 로그인 처리 페이지면 즉시 완료
      if (isLoggedIn || location.pathname === "/social") {
        if (alive) setPhase("READY");
        return;
      }

      // 로그인 신호가 없으면 복구 생략
      if (!hasLoginSignal) {
        if (alive) setPhase("READY");
        return;
      }

      // 복구 시작
      try {
        // Redux action이 fulfilled 되기를 기다림
        await dispatch(reissueThunk()).unwrap();
      } catch (error) {
        console.error("Session restoration failed:", error);
        localStorage.removeItem("isLoginSignal");
        dispatch(clearAuth());
      } finally {
        if (alive) setPhase("READY");
      }
    }

    // phase가 REISSUE인 경우에만 복구 실행
    if (phase === 'REISSUE') {
      restoreSession();
    }

    return () => { alive = false; };
  }, [dispatch, isLoggedIn, hasLoginSignal, location.pathname, phase]);

  // 3. 검증 중일 때는 아무것도 하지 않고 로더만 보여줌 (매우 중요)
  if (phase !== 'READY') {
    return <FullScreenLoader />;
  }

  // --- 여기서부터는 phase가 'READY'인 상태이므로 isLoggedIn 값이 최신임 ---

  const isGuestRoute = GUEST_ONLY_ROUTES.some(regex => regex.test(location.pathname));

  // 4. 게스트 전용 페이지 (로그인 시 접근 불가)
  if (isGuestRoute) {
    if (isLoggedIn) return <Navigate to="/" replace />;
    return <Outlet />;
  }

  // 5. 비로그인 사용자 처리
  if (!isLoggedIn) {
    // 예외 페이지 허용
    if (location.pathname === "/" || location.pathname === "/social") return <Outlet />;
    
    // 권한이 필요한 페이지 접근 시 로그인으로 강제 이동
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 6. 로그인 사용자 - 대시보드 역할별 리다이렉트
  if (location.pathname === '/') {
    if (user?.role === ROLE.PTN) return <Navigate to="/partners" replace />;
    if (user?.role === ROLE.DLV) return <Navigate to="/riders" replace />;
  }

  // 7. 경로 기반 권한 체크
  let rolesToVerify = allowedRoles;
  if (!rolesToVerify) {
    if (location.pathname.startsWith('/riders')) rolesToVerify = [ROLE.DLV, ROLE.ADM];
    else if (location.pathname.startsWith('/partners')) rolesToVerify = [ROLE.PTN, ROLE.ADM];
  }

  if (rolesToVerify && user && !rolesToVerify.includes(user.role)) {
    alert('권한이 부족합니다.');
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}