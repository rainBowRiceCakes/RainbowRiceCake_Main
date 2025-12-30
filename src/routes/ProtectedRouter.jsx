/**
 * @file src/routes/ProtectedRouter.jsx
 * @description 라우터
 * 251214 v1.0.0 wook init
 */

import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { reissueThunk } from "../store/thunks/authThunk.js";
import { LanguageContext } from "../context/LanguageContext";

// 이 컴포넌트가 라우터 요소로 사용되므로, 함수형으로 export 합니다.
export default function ProtectedRouter() {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector(state => state.auth);
  const location = useLocation();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const { t } = useContext(LanguageContext); // Get translation function

  useEffect(() => {
    const checkSession = async () => {
      if (!isLoggedIn) {
        try {
          await dispatch(reissueThunk()).unwrap();
        } catch (e) {
          // 재발급 실패는 에러가 아니므로 콘솔에만 표시
          console.error("Session reissue failed:", e);
        }
      }
      setIsAuthChecked(true);
    };

    checkSession();
  }, [dispatch, isLoggedIn]);


  // 제공된 ROLE 및 PATH 설정
  const ROLE = {
    ADM: 'ADM',
    PTN: 'PTN',
    DLV: 'DLV',
    COM: 'COM'
  };
  const { ADM, COM, DLV, PTN } = ROLE;

  // 인증 및 인가가 필요한 라우트
  const AUTH_REQUIRED_ROUTES = [
    { path: /^\/mypage$/, roles: [ COM, DLV, PTN, ADM ]},
    { path: /^\/users\/[0-9]+$/, roles: [ COM, DLV, PTN ]},
    { path: /^\/sections\/ptns\/[0-9]+$/, roles: [ COM ]},
    // { path: /^\/posts\/[0-9]+$/, roles: [ COM ]},
    // { path: /^\/posts\/create$/, roles: [ COM ]},
    // MainShow 관련 경로 추가 (예시)
  ];

  if (!isAuthChecked) {
    return <div>{t('sessionChecking')}</div>; // or a spinner component
  }

  const matchRole = AUTH_REQUIRED_ROUTES.find(item => item.path.test(location.pathname));

  if (matchRole && !isLoggedIn) {
    alert(t('coverLoginRequired'));
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (matchRole) {
    if (user && matchRole.roles.includes(user.role)) {
      return <Outlet/>;
    } else {
      alert(t('insufficientPermissions'));
      return <Navigate to="/" replace />;
    }
  }

  // 일치하는 보호된 라우트가 없는 경우, Outlet을 렌더링하여 자식 라우트를 표시합니다.
  return <Outlet/>;
}