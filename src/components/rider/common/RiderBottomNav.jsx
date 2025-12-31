// components/rider/common/RiderBottomNav.jsx
import "./RiderBottomNav.css";
import { useLocation, useNavigate } from "react-router-dom";

export default function RiderBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;

  // ✅ 현재 탭 active 판별
  const isActive = (key) => {
    if (key === "home") {
      // /rider/:id (메인) - 보통 여기서는 BottomNav를 안 쓰지만, 혹시라도 대비
      return pathname === `/rider` || pathname === `/rider/`;
    }
    if (key === "mypage") {
      return pathname.includes(`/rider/mypage`);
    }
    return false;
  };

  const go = (key) => {
    // ✅ 마이페이지 레이아웃에서 쓸 거라 mypage 기본은 mypage index로
    if (key === "home") navigate(`/rider`);
    if (key === "mypage") navigate(`/rider/mypage`);
  };

  return (
    <nav className="rider-bottom-nav" aria-label="하단 탭">
      <button
        type="button"
        className={`rbn-item ${isActive("home") ? "active" : ""}`}
        onClick={() => go("home")}
      >
        <span className="rbn-icon" aria-hidden="true">🏠</span>
        <span className="rbn-label">홈</span>
      </button>
      <button
        type="button"
        className={`rbn-item ${isActive("mypage") ? "active" : ""}`}
        onClick={() => go("mypage")}
      >
        <span className="rbn-icon" aria-hidden="true">👤</span>
        <span className="rbn-label">마이 페이지</span>
      </button>
    </nav>
  );
}