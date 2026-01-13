/**
 * @file src/components/common/Modal.jsx
 * @description 전역 모달 스타일 정의 파일 
 * 251229 v1.1.0 sara init
 */

import { useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import "./Modal.css";

export default function Modal({ isOpen, onClose, title, children }) {
  const { t } = useContext(LanguageContext);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label={t('modalCloseAriaLabel')}>
            {t('footerCloseX')}
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
