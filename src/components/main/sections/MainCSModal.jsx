/**
 * @file src/components/main/sections/MainCSModal.jsx
 * @description 고객센터 구글폼 페이지 
 * 251230 v1.0.0 sara init
 */

import { useState, useContext } from 'react';
import { LanguageContext } from '../../../context/LanguageContext';
import './MainCSModal.css';
import { FaXmark, FaPaperPlane } from "react-icons/fa6";

export default function MainCSModal({ isOpen, onClose, userRole }) { // userRole 추가
  const { t } = useContext(LanguageContext);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle');

  // [수정 완료] 발급받으신 URL을 여기에 적용했습니다.
  const GAS_URL = "https://script.google.com/macros/s/AKfycbxPVKTxLRDts64ToRx7UOrnxA5TjE735Ue4OL25HRnd1ZSiC-vEYxbO7P1NV1BrHWZf/exec";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // [수정 포인트] 'const response ='를 제거하고 fetch만 실행합니다.
      await fetch(GAS_URL, {
        method: "POST",
        mode: "no-cors", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: userRole 
        }),
      });

      // 전송 시도 자체가 성공하면 성공 상태로 변경
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 2500);

    } catch (error) {
      console.error("전송 오류:", error);
      alert(t('csModalSubmitError'));
      setStatus('idle');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cs-modal-overlay">
      <div className="cs-modal-content">
        <div className="maininfo-recommended-badge cs-ribbon">{t('csModalResponseBadge')}</div>
        
        <div className="cs-modal-header">
          <h2 className="cs-modal-title">{t('csModalTitle')}</h2>
          <button className="cs-modal-close" onClick={onClose}><FaXmark /></button>
        </div>

        {status === 'success' ? (
          <div className="cs-success-message">
            <p style={{ fontSize: '18px', marginBottom: '10px' }}>✅</p>
            <p>{t('csModalSuccessMessage1')}</p>
            <p>{t('csModalSuccessMessage2')}</p>
          </div>
        ) : (
          <form className="cs-modal-form" onSubmit={handleSubmit}>
            {/* ... (입력 필드들: Name, Email, Subject, Message 동일) */}
            <div className="cs-form-group">
              <label>{t('csModalFormName')}</label>
              <input type="text" required value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="cs-form-group">
              <label>{t('csModalFormEmail')}</label>
              <input type="email" required value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="cs-form-group">
              <label>{t('csModalFormSubject')}</label>
              <input type="text" required value={formData.subject} onChange={(e)=>setFormData({...formData, subject: e.target.value})} />
            </div>
            <div className="cs-form-group">
              <label>{t('csModalFormMessage')}</label>
              <textarea rows="4" required value={formData.message} onChange={(e)=>setFormData({...formData, message: e.target.value})} />
            </div>
            
            <button type="submit" className="ptnssearch-search-find-btn cs-submit-btn" disabled={status === 'loading'}>
              <FaPaperPlane /> <span>{status === 'loading' ? t('csModalFormSubmitting') : t('csModalFormSubmit')}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}