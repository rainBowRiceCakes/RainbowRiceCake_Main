import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './InquiryHistoryModal.css';
import { clearSelectedInquiry } from '../../../store/slices/inquirySlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { getInquiriesThunk } from '../../../store/thunks/questions/getInquiriesThunk.js';
import { getInquiryDetailThunk } from '../../../store/thunks/questions/getInquiryDetailThunk.js';

const InquiryHistoryModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { inquiries, selectedInquiry, loading } = useSelector((state) => state.inquiry);

  useEffect(() => {
    if (isOpen) {
      dispatch(getInquiriesThunk());
    }
  }, [isOpen, dispatch]);

  const handleItemClick = (id) => {
    // 상세 데이터를 별도로 가져오거나, 이미 목록에 있다면 바로 설정 가능
    dispatch(getInquiryDetailThunk(id));
  };

  const handleBackToList = () => {
    dispatch(clearSelectedInquiry());
  };

  const handleClose = () => {
    dispatch(clearSelectedInquiry());
    onClose();
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal_overlay" onClick={() => {
      dispatch(clearSelectedInquiry());
      onClose();
    }}>
      <div className="modern_modal_container" onClick={(e) => e.stopPropagation()}>
        <header className="modern_modal_header">
          <div className="header_title_area">
            {selectedInquiry && (
              <button className="icon_back_btn" onClick={handleBackToList}>‹</button>
            )}
            <h2>{selectedInquiry ? "문의 상세내용" : "문의 내역"}</h2>
          </div>
          <button className="icon_close_btn" onClick={handleClose}>&times;</button>
        </header>

        <main className="modern_modal_content">
          {loading ? (
            <div className="loader_container"><div className="spinner"></div></div>
          ) : selectedInquiry ? (
            /* --- 상세 뷰 --- */
            <div className="modern_detail_view">
              <div className="detail_top_card">
                <span className={`status_pill ${selectedInquiry.status ? "completed" : "pending"}`}>
                  {selectedInquiry.status ? "답변완료" : "대기중"}
                </span>
                <h3 className="detail_title">{selectedInquiry.title}</h3>
                <time className="detail_time">{selectedInquiry.createdAt}</time>
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
                    <div className="card_left">
                      <span className={`status_dot ${item.status ? "completed" : "pending"}`}></span>
                      <div className="card_text">
                        <span className="card_title">{item.title}</span>
                        <span className="card_date">{item.createdAt}</span>
                      </div>
                    </div>
                    <div className={`status_text_tag ${item.status ? "completed" : "pending"}`}>
                      {item.status ? "답변완료" : "대기중"}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty_state">문의 내역이 없습니다.</div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>,
    document.body
  );
};

export default InquiryHistoryModal;