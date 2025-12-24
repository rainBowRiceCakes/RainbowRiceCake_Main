/**
 * @file src/components/main/sections/MainCoverItems/MainCoverModal.jsx
 * @description 메인커버화면에 들어갈 배송조회 모달
 * 251224 v1.0.0 sara init  
 */


import './MainCoverModal.css';
import DeliveryStatusCards from './DeliveryStatusCards';

export default function MainCoverModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  return (
    <div className="maincover-modal-overlay" onClick={onClose}>
      <div className="maincover-modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">배송 상세 내역</h3>
          <button className="close-x-btn" onClick={onClose}>✕</button>
        </div>

        {/* 배송 상태 카드 섹션 (4단계 캐릭터형) */}
        <DeliveryStatusCards status={order.status} rider={order.rider_name} phone={order.rider_phone} />

        {/* 상세 정보 테이블 */}
        <div className="modal-detail-container">
          <div className="detail-info-row"><span>배송 번호</span><strong>{order.id}</strong></div>
          <div className="detail-info-row"><span>받는 사람</span><strong>{order.name}</strong></div>
          <div className="detail-info-row no-border">
            <span>결제 금액</span>
            <strong className="price-text">{(order.price || 0).toLocaleString()}원</strong>
          </div>
        </div>

        <button className="modal-bottom-close-btn" onClick={onClose}>확인</button>
      </div>
    </div>
  );
}