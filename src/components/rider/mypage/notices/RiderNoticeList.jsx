// src/components/rider/mypage/RiderNoticeList.jsx
import "./RiderNoticeList.css";
import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { noticeIndexThunk } from "../../../../store/thunks/notices/noticeIndexThunk.js";

const ITEMS_PER_PAGE = 9;

function NoticeItem({ notice }) {
  const statusClass = notice.status ? 'rnl-status-ongoing' : 'rnl-status-completed';
  const statusText = notice.status ? '진행중' : '완료';

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
          <span className={`rnl-value ${statusClass}`}>{statusText}</span>
        </div>
        <div className="rnl-item-row">
          <span className="rnl-label">이슈사항</span>
          <span className="rnl-value">{notice.content}</span>
        </div>
      </div>
    </article>
  );
}

export default function RiderNoticeList() {
  const dispatch = useDispatch();
  const { allNotices, loading, error } = useSelector((state) => state.notices);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(noticeIndexThunk({
      page: 1,
      limit: 100,
      from: 'rider'
    }));
  }, [dispatch]);

  const pagedNotices = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const items = allNotices.slice(startIndex, endIndex);
    const totalPage = Math.ceil(allNotices.length / ITEMS_PER_PAGE);
    return { items, totalPage };
  }, [allNotices, currentPage]);

  if (loading && allNotices.length === 0) {
    return (
      <div className="rnl-list-container">
        <div className="rnl-loading">공지사항을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rnl-list-container">
        <div className="rnl-error">
          <p>{error}</p>
          <button onClick={() => dispatch(noticeIndexThunk({ page: 1, limit: 100, from: 'rider' }))}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!loading && allNotices.length === 0) {
    return (
      <div className="rnl-list-container">
        <div className="rnl-empty">등록된 공지사항이 없습니다.</div>
      </div>
    );
  }


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
