/**
 * @file src/components/main/sections/MainCoverItems/MainCoverModal.jsx
 * @description 메인커버화면에 들어갈 배송조회 모달
 * 251224 v1.0.0 sara init  
 */


import { useEffect } from "react";
import "./MainCoverModal.css";
import DeliveryStatusCards from "./DeliveryStatusCards";

export default function MainCoverModal({ isOpen, onClose, order }) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  return (
    <div className="maincover-modal-overlay" onClick={onClose}>
      <div
        className="maincover-modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="maincover-modal-title"
      >
        <div className="maincover-modal-header">
          <div>
            <h3 className="maincover-modal-title" id="maincover-modal-title">
              배송 상세 내역
            </h3>
            <p className="maincover-modal-sub">
              백과 조회 기반으로 최신 배송 상태를 표시합니다.
            </p>
          </div>

          <button className="maincover-modal-close" onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </div>

        {/* 상태 스텝퍼 */}
        <div className="maincover-modal-block">
          <DeliveryStatusCards status={order.status} />
        </div>

        {/* 상세 정보 */}
        <div className="maincover-modal-detail">
          <div className="maincover-modal-row">
            <span className="maincover-modal-k">배송 번호</span>
            <strong className="maincover-modal-v">{order.id}</strong>
          </div>

          <div className="maincover-modal-row">
            <span className="maincover-modal-k">받는 사람</span>
            <strong className="maincover-modal-v">{order.name}</strong>
          </div>

          <div className="maincover-modal-row no-border">
            <span className="maincover-modal-k">결제 금액</span>
            <strong className="maincover-modal-v maincover-modal-price">
              {(order.price || 0).toLocaleString()}원
            </strong>
          </div>
        </div>

        <button className="maincover-modal-cta" onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
}