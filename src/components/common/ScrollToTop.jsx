/**
 * @file src/components/common/ScrollToTop.jsx
 * @description 페이지 이동 시 스크롤을 최상단으로 이동시키는 컴포넌트(라우터에도 적용힘!)
 * 260103 v1.0.0 sara init
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
