// src/components/rider/mypage/RiderNoticeList.jsx
import "./RiderNoticeList.css";
import { dummyNotices } from "../../../../data/dummyNotices.js";

function NoticeItem({ notice }) {
  // Determine status class based on notice status
  const statusClass = notice.status === '진행중' ? 'rnl-status-ongoing' : 'rnl-status-completed';

  return (
    <article className="rnl-item-card">
      <div className="rnl-item-header">
        <h3 className="rnl-item-title">
          <span className="rnl-icon" aria-hidden="true">⚠️</span>
          {notice.title}
        </h3>
        <span className="rnl-item-date">{notice.date}</span>
      </div>
      <div className="rnl-item-body">
        <div className="rnl-item-row">
          <span className="rnl-label">상태</span>
          <span className={`rnl-value ${statusClass}`}>{notice.status}</span>
        </div>
        <div className="rnl-item-row">
          <span className="rnl-label">이슈사항</span>
          <span className="rnl-value">{notice.issue}</span>
        </div>
      </div>
    </article>
  );
}

export default function RiderNoticeList() {
  return (
    <div className="rnl-list-container">
      {dummyNotices.map((notice) => (
        <NoticeItem key={notice.id} notice={notice} />
      ))}
    </div>
  );
}
