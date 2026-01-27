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

  const hasLoginSignal = (() => {
    try { return !!localStorage.getItem('isLoginSignal'); }
    catch { return false; }
  })();

  /** 
   * 3단계 분기 목표 
   * 1) INITIAL: 아직 인증 체크 전 → 로더
   * 2) REISSUE: 신호 있고, 아직 redux 로그인 false라서 복구 중 → 로더
   * 3) READY: 체크 끝 → 기존 라우팅 분기 수행
   */  
  const [phase, setPhase] = useState(() => {
    if (isLoggedIn) return 'READY';
    if (hasLoginSignal) return 'REISSUE';
    return 'READY'; // 신호도 없으면 바로 라우팅 분기로 넘겨서 /login 처리 등 하게 함
  });

  useEffect(() => {
    let alive = true;

    async function restoreSession() {
      // ✅ /social 은 복구 스킵(기존 로직 유지)
      if (location.pathname === "/social") {
        if (alive) setPhase("READY");
        return;
      }

      // 이미 로그인 되어있으면 끝
      if (isLoggedIn) {
        if (alive) setPhase("READY");
        return;
      }

      // 로그인 신호가 없으면 복구할 것도 없음
      if (!hasLoginSignal) {
        if (alive) setPhase("READY");
        return;
      }

      // 신호가 있는데 아직 isLoggedIn이 아니면 → 복구 시도
      if (alive) setPhase("REISSUE");

      try {
        await dispatch(reissueThunk()).unwrap();
      } catch (error) {
        console.error("Session restoration failed:", error);
        try {
          localStorage.removeItem("isLoginSignal");
        } catch (removeErr) {
          console.error("Failed to remove login signal:", removeErr);
        }
        dispatch(clearAuth());
      } finally {
        if (alive) setPhase("READY");
      }
    }

    restoreSession();
    return () => {
      alive = false;
    };
  }, [dispatch, isLoggedIn, hasLoginSignal, location.pathname]);

  if (phase === 'REISSUE') {
   return <FullScreenLoader />;
  } 

  const isGuestRoute = GUEST_ONLY_ROUTES.some(regex => regex.test(location.pathname));

  // 5. 게스트 전용 페이지 처리
  if (isGuestRoute) {
    if (isLoggedIn) return <Navigate to="/" replace />;
    return <Outlet />;
  }

  // 비로그인 사용자 처리
  if (!isLoggedIn) {
    if (location.pathname === "/" || location.pathname === "/social") return <Outlet />;

    // 신호가 없으면 로그인으로
    if (!hasLoginSignal) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // 신호는 있는데 READY까지 왔는데도 로그인 아니면(복구 실패/만료) → 로더 대신 로그인으로 보내도 됨
    return <Navigate to="/login" replace state={{ from: location }} />;
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