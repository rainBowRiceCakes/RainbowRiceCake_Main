// components/rider/main/RiderNoticeBar.jsx
// 어드민 페이지에서 어드민이 공지사항을 올리면 우리가 받아서 보여주는 바
import "./RiderNoticeBar.css";
import { useSelector } from "react-redux"; // Uncomment useSelector

export default function RiderNoticeBar({ riderId, onNavigateToNotices }) {
  const ongoingNotices = useSelector((state) => state.notices.ongoingNotices);

  if (!ongoingNotices || ongoingNotices.length === 0) {
    return null; // Return null if no notices for today
  }

  return (
    <div onClick={() => onNavigateToNotices(riderId)} className="rider-notice-bar-container">
      <div className="rider-notice-bar">
        <div className="rider-notice-marquee">
          <p className="rider-notice-text">
            {ongoingNotices.map(notice => `✓ ${notice.title}`).join(" \u00A0\u00A0")}
          </p>
        </div>
      </div>
    </div>
  );
}
