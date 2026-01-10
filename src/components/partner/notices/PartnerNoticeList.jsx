import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { noticeIndexThunk } from '../../../store/thunks/notices/noticeIndexThunk.js';
import './PartnerNoticeList.css';

const PartnerNoticeListPage = () => {
  const dispatch = useDispatch();

  // Redux 스토어에서 데이터 가져오기
  const allNotices = useSelector((state) => {
    console.log("리덕스 상태:", state.notices); // <-- 여기를 확인!
    return state.notices.allNotices || [];
  });
  const loading = useSelector((state) => state.notices.loading);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  // 1. 데이터가 없을 경우에만 초기 데이터 로드 (필요 시)
  useEffect(() => {
    // 2. setAllNotices()가 아니라 Thunk를 dispatch 하세요!
    // 페이지 번호나 리미트가 필요하다면 객체로 전달합니다.
    dispatch(noticeIndexThunk({ page: 1, limit: 10 }));
  }, [dispatch]);

  if (loading && allNotices.length === 0) {
    return <div className="loading">데이터 로딩 중...</div>;
  }
  const itemsPerPage = 6;

  // 2. 전체 페이지 수 계산 (데이터가 없을 때를 대비해 0 처리)
  const totalPages = allNotices.length > 0 ? Math.ceil(allNotices.length / itemsPerPage) : 1;
  // 3. 현재 페이지 데이터 추출
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNotices = allNotices.slice(startIndex, startIndex + itemsPerPage);

  // 4. 페이지 변경 함수 (스크롤 상단 이동 추가)
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
                  {notice.isNew && <span className="new_badge">NEW</span>}
                  <span className="notice_date">{notice.date}</span>
                </div>
                <p className="notice_summary">{notice.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no_data">등록된 공지사항이 없습니다.</div>
        )}
      </div>

      {/* 페이지네이션 UI */}
      {allNotices.length > 0 && (
        <div className="notice_pagination">
          {/* 이전 페이지 버튼 */}
          <button
            className="page_btn"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            {"<"}
          </button>

          {/* 페이지 번호 리스트 */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={`page_btn ${currentPage === num ? 'active' : ''}`}
              onClick={() => handlePageChange(num)}
            >
              {num}
            </button>
          ))}

          {/* 다음 페이지 버튼 */}
          <button
            className="page_btn"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            {">"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PartnerNoticeListPage;