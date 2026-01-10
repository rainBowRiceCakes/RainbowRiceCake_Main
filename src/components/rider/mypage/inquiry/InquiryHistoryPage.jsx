import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위해 추가
import { useDispatch, useSelector } from 'react-redux';
import { clearSelectedInquiry } from '../../../../store/slices/inquirySlice.js';
import { getInquiriesThunk } from '../../../../store/thunks/questions/getInquiriesThunk.js';
import { getInquiryDetailThunk } from '../../../../store/thunks/questions/getInquiryDetailThunk.js';
import './InquiryHistoryPage.css'; // 페이지 전용 CSS

const InquiryHistoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { inquiries, selectedInquiry, loading } = useSelector((state) => state.inquiry);

  useEffect(() => {
    // 페이지 진입 시 목록 데이터 로드
    dispatch(getInquiriesThunk());

    // 페이지를 나갈 때(Unmount) 상세 내역 초기화
    return () => {
      dispatch(clearSelectedInquiry());
    };
  }, [dispatch]);

  const handleItemClick = (id) => {
    dispatch(getInquiryDetailThunk(id));
  };

  const handleBack = () => {
    if (selectedInquiry) {
      dispatch(clearSelectedInquiry());
      window.scrollTo(0, 0); // 상세에서 목록으로 갈 때 상단으로!
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="rider_page_container">
      <header className="rider_page_header">
        <div className="header_title_area">
          {/* 상세 페이지든 목록 페이지든 상단에 뒤로가기 버튼 배치 */}
          <button className="icon_back_btn" onClick={handleBack}>‹</button>
          <h2>{selectedInquiry ? "문의 상세내용" : "1:1 문의 내역"}</h2>
        </div>
      </header>

      <main className="rider_page_content">
        {loading ? (
          <div className="loader_container"><div className="spinner"></div></div>
        ) : selectedInquiry ? (
          /* --- 상세 뷰 --- */
          <div className="rider_detail_view">
            <div className="detail_card">
              <span className={`status_badge ${selectedInquiry.status ? "done" : "hold"}`}>
                {selectedInquiry.status ? "답변완료" : "대기중"}
              </span>
              <h3 className="detail_title">{selectedInquiry.title}</h3>
              <span className="detail_date">{selectedInquiry.createdAt}</span>
            </div>

            <div className="content_stack">
              <div className="content_bubble question">
                <span className="bubble_label">Q. 질문</span>
                <p>{selectedInquiry.content}</p>
              </div>
              {selectedInquiry.res && (
                <div className="content_bubble answer">
                  <span className="bubble_label">A. 답변</span>
                  <p>{selectedInquiry.res}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* --- 목록 뷰 --- */
          <div className="modern_list_view">
            {inquiries.length > 0 ? (
              inquiries.map((item) => (
                <div key={item.id} className="modern_inquiry_card" onClick={() => handleItemClick(item.id)}>
                  <div className="item_main">
                    <span className="item_title">{item.title}</span>
                    <span className="item_date">{item.createdAt}</span>
                  </div>
                  <div className={`item_status_text ${item.status ? "done" : ""}`}>
                    {item.status ? "답변완료" : "대기중"}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty_msg">문의 내역이 없습니다.</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default InquiryHistoryPage;