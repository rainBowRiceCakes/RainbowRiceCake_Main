/**
 * @file src/components/main/sections/MainCoverItems/MainCoverModal.jsx
 * @description 메인커버화면에 들어갈 배송조회 모달
 * 251224 v1.0.0 sara init  
 */


import { useEffect } from "react";
import "./MainCoverModal.css";
import DeliveryStatusCards from "./DeliveryStatusCards";

import { useTranslation } from "../../../../context/LanguageContext";

export default function MainCoverModal({ isOpen, onClose, order }) {
  const { t } = useTranslation();
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
              {t('coverModalTitle')}
            </h3>
            <p className="maincover-modal-sub">
              {t('coverModalSub')}
            </p>
          </div>

          <button className="maincover-modal-close" onClick={onClose} aria-label={t('coverModalClose')}>
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
            <span className="maincover-modal-k">{t('coverModalDeliveryNumber')}</span>
            <strong className="maincover-modal-v">{order.id}</strong>
          </div>

          <div className="maincover-modal-row">
            <span className="maincover-modal-k">{t('coverModalRecipient')}</span>
            <strong className="maincover-modal-v">{order.name}</strong>
          </div>

          {order.driverPhone && (
            <div className="maincover-modal-row">
              <span className="maincover-modal-k">{t('coverModalDriverContact')}</span>
              <strong className="maincover-modal-v">{order.driverPhone}</strong>
            </div>
          )}

          <div className="maincover-modal-row no-border">
            <span className="maincover-modal-k">{t('coverModalPaymentAmount')}</span>
            <strong className="maincover-modal-v maincover-modal-price">
              {(order.price || 0).toLocaleString()}{t('coverModalCurrency')}
            </strong>
          </div>
        </div>

        <button className="maincover-modal-cta" onClick={onClose}>
          {t('confirm')}
        </button>
      </div>
    </div>
  );
}