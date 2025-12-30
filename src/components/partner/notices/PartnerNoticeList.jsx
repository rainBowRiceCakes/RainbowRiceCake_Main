import { useState } from 'react';
import { useSelector } from 'react-redux';
import './PartnerNoticeList.css';

const PartnerNoticeListPage = () => {
  // 기존에 만드신 슬라이스의 allNotices 데이터를 가져옵니다.
  const allNotices = useSelector((state) => state.notices.allNotices);

  // 페이지네이션을 위한 상태 (기본 1페이지)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(allNotices.length / itemsPerPage);

  // 현재 페이지 데이터 추출
  const currentNotices = allNotices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="notice_page">
      <h2 className="notice_title">공지사항</h2>

      <div className="notice_list_container">
        {currentNotices.length > 0 ? (
          currentNotices.map((notice) => (
            <div key={notice.id} className="notice_item">
              <div className="notice_content_box">
                <div className="notice_header">
                  <span className="notice_badge">공지</span>
                  <span className="notice_subject">{notice.title}</span>
                  {/* 날짜가 오늘 날짜와 같으면 NEW 뱃지 표시 (선택사항) */}
                  {notice.isNew && <span className="new_badge">NEW</span>}
                  <span className="notice_date">{notice.date}</span>
                  <span className="comment_icon">💬</span>
                </div>
                <p className="notice_summary">{notice.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no_data">등록된 공지사항이 없습니다.</div>
        )}
      </div>

      {/* 동적 페이지네이션 */}
      {totalPages > 0 && (
        <div className="notice_pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={`page_btn ${currentPage === num ? 'active' : ''}`}
              onClick={() => setCurrentPage(num)}
            >
              {num}
            </button>
          ))}
          <button
            className="page_btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            {">"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PartnerNoticeListPage;