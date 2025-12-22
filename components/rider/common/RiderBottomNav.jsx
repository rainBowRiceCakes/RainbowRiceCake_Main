// components/rider/common/RiderBottomNav.jsx
import "./RiderBottomNav.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function RiderBottomNav() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;

  // ✅ 현재 탭 active 판별
  const isActive = (key) => {
    if (key === "home") {
      // /rider/:id (메인) - 보통 여기서는 BottomNav를 안 쓰지만, 혹시라도 대비
      return pathname === `/rider/${id}` || pathname === `/rider/${id}/`;
    }
    if (key === "history") {
      // 예: /rider/:id/mypage/history 또는 /rider/:id/history 로 바뀔 수도 있어서 includes로 안전하게
      return pathname.includes(`/rider/${id}/mypage/history`);
    }
    if (key === "account") {
      return pathname.includes(`/rider/${id}/mypage`);
    }
    return false;
  };

  const go = (key) => {
    // ✅ 마이페이지 레이아웃에서 쓸 거라 account 기본은 mypage index로
    if (key === "home") navigate(`/rider/${id}`);
    if (key === "history") navigate(`/rider/${id}/mypage/history`); // 아직 없으면 나중에 만들면 됨
    if (key === "account") navigate(`/rider/${id}/mypage`);
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
        className={`rbn-item ${isActive("account") ? "active" : ""}`}
        onClick={() => go("account")}
      >
        <span className="rbn-icon" aria-hidden="true">👤</span>
        <span className="rbn-label">마이 페이지</span>
      </button>
    </nav>
  );
}