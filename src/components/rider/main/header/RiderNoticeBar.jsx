// src/components/rider/main/header/RiderNoticeBar.jsx
import "./RiderNoticeBar.css";

export default function RiderNoticeBar({ ongoingNotices = [], onNavigateToNotices }) {

  // 공지가 없으면 컴포넌트 자체를 렌더링하지 않음 (Early Return)
  if (ongoingNotices.length === 0) return null;

  return (
    <div
      onClick={onNavigateToNotices}
      className="rider-notice-bar-container"
      role="button"
      aria-label="공지사항 확인하기"
    >
      <div className="rider-notice-bar">
        <div className="rider-notice-marquee">
          <p className="rider-notice-text">
            {ongoingNotices
              .slice(0, 5)
              .map(notice => `[공지] ${notice.title}`)
              .join(" \u00A0\u00B7\u00A0 ")}
          </p>
        </div>
      </div>
    </div>
  );
}