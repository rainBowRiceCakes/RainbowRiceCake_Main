import './PartnerPolicyModal.css';

const PartnerPolicyModal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="policy-modal-overlay" onClick={onClose}>
      <div className="policy-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="policy-modal-header">
          <h2>{title}</h2>
          <button className="policy-close-x" onClick={onClose}>X</button>
        </div>

        <div className="policy-text-area">
          <div className="policy-inner-box">
            {/* 실제 현업에서는 HTML/Markdown 형태로 오기도 하므로 pre-wrap 적용 */}
            <pre>{content}</pre>
          </div>
        </div>

        <div className="policy-modal-footer">
          <button className="policy-close-btn" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default PartnerPolicyModal;