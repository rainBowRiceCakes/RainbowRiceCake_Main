/**
 * @file src/components/main/sections/MainPTNS.jsx
 * @description 제휴업체 페이지 
 * 251216 v1.0.0 sara init
 * 251223 v2.0.0 jun 라이더, 파트너 form 추가
 */

import { useContext, useState } from 'react';
import { LanguageContext } from '../../../context/LanguageContext';
import { footerData } from '../../../data/footerData'; // 약관 데이터
import './MainPTNS.css';

export default function MainPTNS() {
  const { t, language } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState('rider'); // 'rider' | 'partner'

  // 체크박스 상태 관리
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false
  });

  // 모달 상태 ('terms' | 'privacy' | null)
  const [activeModal, setActiveModal] = useState(null);

  // 모달 열기 (체크박스 클릭 시)
  const openModal = (e, type) => {
    e.preventDefault(); // 체크 방지
    if (!agreements[type]) {
      setActiveModal(type);
      document.body.style.overflow = 'hidden'; // 스크롤 잠금
    } else {
      // 이미 체크된 경우 해제
      setAgreements(prev => ({ ...prev, [type]: false }));
    }
  };

  // 모달 닫기
  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'auto'; // 스크롤 해제
  };

  // 모달 확인 (동의 처리)
  const confirmModal = () => {
    if (activeModal) {
      setAgreements(prev => ({ ...prev, [activeModal]: true }));
      closeModal();
    }
  };

  // 폼 제출
  const onSubmit = (e) => {
    e.preventDefault();
    if (!agreements.terms || !agreements.privacy) {
      alert(t('ptnsAgreeRequiredAlert'));
      return;
    }
    
    // 데이터 로그
    const form = new FormData(e.currentTarget);
    const submitData = {
      ...Object.fromEntries(form.entries()),
      agreeTerms: agreements.terms ? 'on' : 'off',
      agreePrivacy: agreements.privacy ? 'on' : 'off'
    };
    console.log("Submit Data:", submitData);
    alert(t('ptnsSubmitSuccessAlert'));
    e.currentTarget.reset();
    setAgreements({ terms: false, privacy: false });
  };

  // 현재 활성화된 모달 데이터
  const modalContent = activeModal 
    ? (footerData[language] ? footerData[language][activeModal] : footerData['ko'][activeModal]) 
    : null;

  return (
    <>
      <div className="mainptns-frame" id="partners">
        <div className="mainptns-container">
          
          {/* 상단 헤더 */}
          <div className="mainptns-header-group">
            <h2 className="mainptns-title-text">{t('ptnsTitle')}</h2>
            <p className="mainptns-desc-text">{t('ptnsDesc')}</p>
          </div>

          {/* 메인 폼 그리드 */}
          <div className="mainptns-grid-layout">
            <form className="mainptns-card-box form-section" onSubmit={onSubmit}>
              
              {/* 탭 헤더 */}
              <div className="form-header-row">
                <h3 className="mainptns-card-title-text">
                  {activeTab === 'rider' ? (t('ptnsFormRiderTitle') || "라이더 제휴 신청") 
                    : (t('ptnsFormPartnerTitle') || "파트너 제휴 신청")}
                </h3>
                <div className="mainptns-tab-group">
                  <button type="button" 
                    className={`mainptns-tab-btn ${activeTab === 'rider' ? 'active' : ''}`}
                    onClick={() => setActiveTab('rider')}>{t('ptnsTabRider') || "Rider"}</button>
                  <button type="button" 
                    className={`mainptns-tab-btn ${activeTab === 'partner' ? 'active' : ''}`}
                    onClick={() => setActiveTab('partner')}>{t('ptnsTabPartner') || "Partner"}</button>
                </div>
              </div>

              {/* 라이더 폼 필드 */}
              <div className="mainptns-form-fields-group">
                {activeTab === 'rider' && (
                  <>
                    <label className="mainptns-field-label">
                      {t('ptnsPhoneLabel')}
                      <input className="mainptns-field-input" name="riderPhone" required placeholder="010-0000-0000" />
                    </label>
                    <label className="mainptns-field-label">
                      {t('ptnsAddressLabel')}
                      <input className="mainptns-field-input" name="riderAddress" required placeholder={t('ptnsAddressPlaceholder')} />
                    </label>
                    <label className="mainptns-field-label">
                      {t('ptnsBankNameLabel') || "Bank Name"}
                      <input className="mainptns-field-input" name="bankName" required placeholder={t('ptnsStoreNamePlaceholder')} />
                    </label>
                    <label className="mainptns-field-label">
                      {t('ptnsAccountNumLabel') || "Account Number"}
                      <input className="mainptns-field-input" name="accountNumber" required placeholder={t('ptnsAccountNumber') || "123-45-67890"} />
                    </label>
                    <div className="mainptns-field-label">
                      {t('ptnsLicenseLabel') || "Driver License"}
                      <div style={{ marginTop: '8px' }}>
                        <input type="file" name="licenseImage" id="licenseImage" className="mainptns-file-hidden" required />
                        <label htmlFor="licenseImage" className="mainptns-file-box">
                          {t('ptnsUploadPlaceholder') || "Upload Photo"}
                        </label>
                      </div>
                    </div>
                  </>
                )}
                
                {/* 파트너 폼 필드 */}
                {activeTab === 'partner' && (
                  <>
                    <div className="mainptns-input-grid-2">
                      <label className="mainptns-field-label">
                        {t('ptnsManagerNameLabel') || "Manager Name"}
                        <input className="mainptns-field-input" name="managerName" required placeholder={t('ptnsManagerNamePlaceholder') || "Name"} />
                      </label>
                      <label className="mainptns-field-label">
                        {t('ptnsPhoneLabel')}
                        <input className="mainptns-field-input" name="partnerPhone" required placeholder="010-0000-0000" />
                      </label>
                    </div>
                    <div className="mainptns-input-grid-2">
                      <label className="mainptns-field-label">
                        {t('ptnsStoreNameKrLabel') || "Store Name (KR)"}
                        <input className="mainptns-field-input" name="storeNameKr" required placeholder={t('ptnsStoreNamePlaceholder')} />
                      </label>
                      <label className="mainptns-field-label">
                        {t('ptnsStoreNameEnLabel') || "Store Name (EN)"}
                        <input className="mainptns-field-input" name="storeNameEn" required placeholder={t('ptnsStoreEnNamePlaceholder') || "English Name"} />
                      </label>
                    </div>
                    <label className="mainptns-field-label">
                      {t('ptnsBusinessNumLabel') || "Business Number"}
                      <input className="mainptns-field-input" name="businessNumber" required placeholder="000-00-00000" />
                    </label>
                    <label className="mainptns-field-label">
                      {t('ptnsAddressLabel')}
                      <input className="mainptns-field-input" name="storeAddress" required placeholder={t('ptnsAddressPlaceholder')} />
                    </label>
                    <div className="mainptns-field-label">
                      {t('ptnsStoreLogoLabel') || "Store Logo"}
                      <div style={{ marginTop: '8px' }}>
                        <input type="file" name="storeLogo" id="storeLogo" className="mainptns-file-hidden" required />
                        <label htmlFor="storeLogo" className="mainptns-file-box">
                          {t('ptnsUploadPlaceholder') || "Upload Photo"}
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {/* 약관 체크박스 */}
                <div className="mainptns-form-footer" style={{ marginTop: '20px' }}>
                  <label className="mainptns-agreement-label">
                    <input type="checkbox" name="agreeTerms" 
                      checked={agreements.terms} 
                      onClick={(e) => openModal(e, 'terms')} readOnly />
                    <span className="mainptns-agreement-text">
                      {t('ptnsTermsLabel') || "I agree to Terms of Service."}
                      <span style={{ color: '#3498db', marginLeft: '6px', fontSize: '12px' }}>(보기)</span>
                    </span>
                  </label>
                  <label className="mainptns-agreement-label" style={{ marginTop: '8px' }}>
                    <input type="checkbox" name="agreePrivacy" 
                      checked={agreements.privacy} 
                      onClick={(e) => openModal(e, 'privacy')} readOnly />
                    <span className="mainptns-agreement-text">
                      {t('ptnsAgreementLabel')}
                      <span style={{ color: '#3498db', marginLeft: '6px', fontSize: '12px' }}>(보기)</span>
                    </span>
                  </label>

                  <button className="mainptns-submit-button" type="submit" style={{ marginTop: '20px' }}>
                    {activeTab === 'rider' ? (t('ptnsRiderSubmit') || "Register Rider") : (t('ptnsPartnerSubmit') || "Register Partner")}
                  </button>
                </div>
              </div>
            </form>

            {/* 우측 가이드 */}
            <div className="mainptns-card-box" style={{ height: 'fit-content' }}>
              <div className="mainptns-guide-section">
                <h3 className="mainptns-section-header">{t('ptnsGuideTitle')}</h3>
                <div className="mainptns-guide-card-list">
                  <div className="mainptns-guide-card">
                    <div className="mainptns-guide-title">{t('ptnsProcessTitle')}</div>
                    <div className="mainptns-guide-desc">{t('ptnsProcessDesc')}</div>
                  </div>
                  <div className="mainptns-guide-card">
                    <div className="mainptns-guide-title">{t('ptnsInfoRequiredTitle')}</div>
                    <div className="mainptns-guide-desc">{t('ptnsInfoRequiredDesc')}</div>
                  </div>
                  <div className="mainptns-guide-card">
                    <div className="mainptns-guide-title">{t('ptnsAgreementTitle')}</div>
                    <div className="mainptns-guide-desc">{t('ptnsAgreementDesc')}</div>
                  </div>
                  <div className="mainptns-guide-message-box">
                    <div className="mainptns-guide-title">{t('ptnsReceiptMessageTitle')}</div>
                    <div className="mainptns-guide-desc">{t('ptnsReceiptMessageDesc')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

  {/* --- 통합된 모달 영역 --- */}
  {modalContent && (
    <div className="mainptns-modal-overlay" onClick={closeModal}>
      <div className="mainptns-modal-box" onClick={(e) => e.stopPropagation()}>
        
        {/* 모달 헤더 */}
        <div className="mainptns-modal-header">
          <h3>{modalContent.title}</h3>
          <button className="mainptns-close-x-btn" onClick={closeModal}>✕</button>
        </div>

        {/* 모달 본문 */}
        <div className="mainptns-modal-body">
          {modalContent.description && (
            <p className="mainptns-modal-description">
              {modalContent.description}
            </p>
          )}

          <div className="mainptns-text-content">
            {modalContent.articles && modalContent.articles.map((article, idx) => (
              <div key={idx} style={{ marginBottom: '20px' }}>
                {article.heading && <h4>{article.heading}</h4>}
                {article.text && <p>{article.text}</p>}
                
                {article.list && (
                  <ul>
                    {article.list.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                )}

                {article.text2 && <p>{article.text2}</p>}
                {article.text3 && <p>{article.text3}</p>}
                {article.list2 && (
                  <ul>
                    {article.list2.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 모달 푸터 (취소/동의 버튼) */}
        <div className="mainptns-modal-footer">
          <button className="mainptns-btn-cancel" onClick={closeModal}>취소</button>
          <button className="mainptns-btn-confirm" onClick={confirmModal}>동의 및 확인</button>
        </div>
      </div>
    </div>
  )}
  </>
  );
}