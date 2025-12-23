// src/components/rider/mypage/RiderNoticeList.jsx
import "./RiderNoticeList.css";
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";

const ITEMS_PER_PAGE = 6;

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
  const allNotices = useSelector((state) => state.notices.allNotices);
  const [currentPage, setCurrentPage] = useState(1);

  const pagedNotices = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const items = allNotices.slice(startIndex, endIndex);
    const totalPage = Math.ceil(allNotices.length / ITEMS_PER_PAGE);
    return { items, totalPage };
  }, [allNotices, currentPage]);

  return (
    <div className="rnl-list-container">
      {pagedNotices.items.map((notice) => (
        <NoticeItem key={notice.id} notice={notice} />
      ))}

      {pagedNotices.totalPage > 1 && (
        <div className="pagination-container">
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            이전
          </button>
          
          {[...Array(pagedNotices.totalPage)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}

          <button 
            disabled={currentPage === pagedNotices.totalPage} 
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
