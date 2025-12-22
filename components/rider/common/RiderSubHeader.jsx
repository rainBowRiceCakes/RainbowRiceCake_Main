// components/rider/common/RiderSubHeader.jsx
import "./RiderSubHeader.css";
import { useNavigate } from "react-router-dom";

export default function RiderSubHeader({ title }) {
  const navigate = useNavigate();

  return (
    <header className="rider-sub-header">
      <button
        type="button"
        className="rider-sub-back"
        onClick={() => navigate(-1)}
        aria-label="뒤로가기"
      >
        ←
      </button>

      <h1 className="rider-sub-title">{title}</h1>

      {/* 기존 rod-spacer 역할 */}
      <div className="rider-sub-spacer" />
    </header>
  );
}