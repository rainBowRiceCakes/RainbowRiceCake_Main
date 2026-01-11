import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearSelectedInquiry } from '../../../../store/slices/inquirySlice.js';
import { getInquiriesThunk } from '../../../../store/thunks/questions/getInquiriesThunk.js';
import { getInquiryDetailThunk } from '../../../../store/thunks/questions/getInquiryDetailThunk.js';
import './InquiryHistoryPage.css';

const InquiryHistoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { inquiries, selectedInquiry, loading } = useSelector((state) => state.inquiry);

  useEffect(() => {
    dispatch(getInquiriesThunk());
    return () => {
      dispatch(clearSelectedInquiry());
    };
  }, [dispatch]);

  const handleItemClick = (id) => {
    dispatch(getInquiryDetailThunk(id));
  };

  const showList = () => {
    dispatch(clearSelectedInquiry());
  };

  return (
    <div className="rider_page_container">
      {/* 탭 메뉴: 상세 보기 중일 때도 탭처럼 작동하도록 구성 */}
      <div className="history_tab_container">
        <button
          className={`tab_btn ${!selectedInquiry ? 'active' : ''}`}
          onClick={showList}
        >
          문의 목록
        </button>
        <button
          className={`tab_btn ${selectedInquiry ? 'active' : ''}`}
          disabled={!selectedInquiry}
        >
          상세 내용
        </button>
      </div>

      <main className="rider_page_content">
        {loading ? (
          <div className="loader_container"><div className="spinner"></div></div>
        ) : selectedInquiry ? (
          /* --- 상세 뷰 탭 --- */
          <div className="rider_detail_view animate_fade_in">
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

            <button className="list_return_btn" onClick={showList}>목록으로 돌아가기</button>
          </div>
        ) : (
          /* --- 리스트 뷰 탭 --- */
          <div className="modern_list_view animate_fade_in">
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