/**
 * @file src/components/main/sections/MainPTNS.jsx
 * @description 제휴업체 페이지 
 * 251216 v1.0.0 sara init
 * 251223 v2.0.0 jun 라이더, 파트너 form 추가
 */

import { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../../../context/LanguageContext';
import { footerData } from '../../../data/footerData'; // 약관 데이터
import './MainPTNS.css';

export default function MainPTNS() {
  const { t, language } = useContext(LanguageContext);


  // 미리보기 상태 분리 (라이더용/파트너용)
  const [licensePreview, setLicensePreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // 체크박스 상태 관리
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false
  });

  // 모달 상태 ('terms' | 'privacy' | null)
  const [activeModal, setActiveModal] = useState(null);

  // 메모리 누수 방지 (컴포넌트 언마운트 시 URL 해제)
  useEffect(() => {
    return () => {
      if (licensePreview) URL.revokeObjectURL(licensePreview);
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [licensePreview, logoPreview]);

  // 파일 변경 핸들러 개선
  const changeFiles = (e) => {
    const file = e.target.files[0];
    const name = e.target.name; // input의 name 속성 확인 ('licenseImage' or 'storeLogo')

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      
      if (name === 'licenseImage') {
        setLicensePreview(objectUrl);
      } else if (name === 'storeLogo') {
        setLogoPreview(objectUrl);
      }
    }
  };

  // 모달 열기 (체크박스 클릭 시)
  const openModal = (e, type) => {
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

    // 상태 초기화
    setAgreements({ terms: false, privacy: false });
    setLicensePreview(null);
    setLogoPreview(null);
  };

  // 현재 활성화된 모달 데이터
    const modalContent = activeModal
      ? (footerData[language] ? footerData[language][activeModal] : footerData['ko'][activeModal])
      : null;
  
    useEffect(() => {
      if (activeModal && modalContent) {
        console.log("PTNS Modal: Current Language:", language, "Modal Content Title:", modalContent.title);
      }
    }, [activeModal, language, modalContent]);
  return (
    <>
      <div className="mainptns-frame mainshow-section-frame" id="partners">
        <div className="mainshow-section-wrapper">
          
          {/* 상단 헤더 */}
          <div className="mainptns-header-group">
            <h2 className="mainptns-title-text">{t('ptnsTitle')}</h2>
            <p className="mainptns-desc-text">{t('ptnsDesc')}</p>
          </div>

          {/* 메인 폼 그리드 */}
          <div className="mainptns-grid-2">
            <form className="mainptns-card-box form-section" onSubmit={onSubmit}>
              
              {/* 탭 헤더 */}
              <div className="form-header-row">
                {/* 타이틀 */}
                <h3 className="mainptns-card-title-text">
                  {t('ptnsFormRiderTitle') || "라이더 제휴 신청"}
                </h3>

  
              </div>

              {/* 라이더 폼 필드 */}
              <div className="mainptns-form-fields-group">


                    {/* 휴대폰 번호 */}
                    <label className="mainptns-field-label">
                      {t('ptnsPhoneLabel')}
                      <input className="mainptns-field-input" name="riderPhone" required placeholder="010-0000-0000" />
                    </label>

                    {/* 주소 */}
                    <label className="mainptns-field-label">
                      {t('ptnsAddressLabel')}
                      <input className="mainptns-field-input" name="riderAddress" required placeholder={t('ptnsAddressPlaceholder')} />
                    </label>

                    {/* 은행 이름 */}
                    <label className="mainptns-field-label">
                      {t('ptnsBankNameLabel') || "Bank Name"}
                      <input className="mainptns-field-input" name="bankName" required placeholder={t('ptnsStoreNamePlaceholder')} />
                    </label>

                    {/* 계좌 번호 */}
                    <label className="mainptns-field-label">
                      {t('ptnsAccountNumLabel') || "Account Number"}
                      <input className="mainptns-field-input" name="accountNumber" required placeholder={t('ptnsAccountNumber') || "123-45-67890"} />
                    </label>

                    {/* 운전 면허 등록 */}
                    <div className="mainptns-field-label">
                      {t('ptnsLicenseLabel') || "Driver License"}
                      <div style={{ marginTop: '8px' }}>
                        {/* 이미지 미리보기 */}
                        <input
                          type="file"
                          onChange={changeFiles}
                          name="licenseImage"
                          id="licenseImage"
                          className="mainptns-file-hidden"
                          accept="image/*"
                          required
                        />
                        <label
                          htmlFor="licenseImage"
                          className="mainptns-file-box"
                          style={{
                            backgroundImage: licensePreview ? `url("${licensePreview}")` : 'none',
                            backgroundSize: 'contain',
                            height: licensePreview ? '200px' : undefined,
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            color: licensePreview ? 'transparent' : 'inherit'
                          }}
                        >
                          {!licensePreview && t('ptnsUploadPlaceholder') || "Upload Photo"}
                        </label>
                      </div>
                    </div>

                

                <div className="mainptns-form-footer" style={{ marginTop: '20px' }}>
                  {/* 이용 약관 동의 */}
                  <label className="mainptns-agreement-label">
                    <input type="checkbox" name="agreeTerms" 
                      checked={agreements.terms} 
                      onClick={(e) => openModal(e, 'terms')} readOnly />
                    <span className="mainptns-agreement-text" onClick={(e) => openModal(e, 'terms')} style={{ cursor: 'pointer' }}>
                      {t('ptnsTermsLabel') || "I agree to Terms of Service."}
                      <span style={{ color: '#ee0000', marginLeft: '6px', fontSize: '12px', fontWeight: '900' }}>{t('ptnsRequired')}</span>
                    </span>
                  </label>

                  {/* 개인정보 수집 및 이용 동의 */}
                  <label className="mainptns-agreement-label" style={{ marginTop: '8px' }}>
                    <input type="checkbox" name="agreePrivacy" 
                      checked={agreements.privacy} 
                      onClick={(e) => openModal(e, 'privacy')} readOnly />
                    <span className="mainptns-agreement-text" onClick={(e) => openModal(e, 'privacy')} style={{ cursor: 'pointer' }}>
                      {t('ptnsAgreementLabel')}
                      <span style={{ color: '#ee0000', marginLeft: '6px', fontSize: '12px', fontWeight: '900' }}>{t('ptnsRequired')}</span>
                    </span>
                  </label>
                  
                  {/* 폼 등록하기 버튼 */}
                  <button className="mainptns-submit-button" type="submit" style={{ marginTop: '20px' }}>
                    {t('ptnsRiderSubmit') || "Register Rider"}
                  </button>
                </div>
              </div>
            </form>

            {/* 파트너 제휴 신청 */}
            <form className="mainptns-card-box" onSubmit={onSubmit}>
              <div className="form-header-row">
                <h3 className="mainptns-card-title-text">
                  {t('ptnsFormPartnerTitle') || "파트너 제휴 신청"}
                </h3>
              </div>
              <div className="mainptns-form-fields-group">
                <div className="mainptns-input-grid-2">
                  {/* 담당자 이름 */}
                  <label className="mainptns-field-label">
                    {t('ptnsManagerNameLabel') || "Manager Name"}
                    <input className="mainptns-field-input" name="managerName" required placeholder={t('ptnsManagerNamePlaceholder') || "Name"} />
                  </label>

                  {/* 휴대폰 번호 */}
                  <label className="mainptns-field-label">
                    {t('ptnsPhoneLabel')}
                    <input className="mainptns-field-input" name="partnerPhone" required placeholder="010-0000-0000" />
                  </label>
                </div>

                <div className="mainptns-input-grid-2">
                  {/* 가계 한글 이름 */}
                  <label className="mainptns-field-label">
                    {t('ptnsStoreNameKrLabel') || "Store Name (KR)"}
                    <input className="mainptns-field-input" name="storeNameKr" required placeholder={t('ptnsStoreNamePlaceholder')} />
                  </label>

                  {/* 가계 영어 이름 */}
                  <label className="mainptns-field-label">
                    {t('ptnsStoreNameEnLabel') || "Store Name (EN)"}
                    <input className="mainptns-field-input" name="storeNameEn" required placeholder={t('ptnsStoreEnNamePlaceholder') || "English Name"} />
                  </label>
                </div>

                {/* 사업자 번호 */}
                <label className="mainptns-field-label">
                  {t('ptnsBusinessNumLabel') || "Business Number"}
                  <input className="mainptns-field-input" name="businessNumber" required placeholder="000-00-00000" />
                </label>

                {/* 주소 */}
                <label className="mainptns-field-label">
                  {t('ptnsAddressLabel')}
                  <input className="mainptns-field-input" name="storeAddress" required placeholder={t('ptnsAddressPlaceholder')} />
                </label>

                {/* 가계 로고 사진 */}
                <div className="mainptns-field-label">
                  {t('ptnsStoreLogoLabel') || "Store Logo"}
                  <div style={{ marginTop: '8px' }}>
                    {/* 이미지 미리보기 */}
                    <input
                      type="file"
                      onChange={changeFiles}
                      name="storeLogo"
                      id="storeLogo"
                      className="mainptns-file-hidden"
                      accept="image/*"
                      required
                    />
                    <label
                      htmlFor="storeLogo"
                      className="mainptns-file-box"
                      style={{
                        backgroundImage: logoPreview ? `url("${logoPreview}")` : 'none',
                        backgroundSize: 'contain',
                        height: logoPreview ? '200px' : undefined,
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        color: logoPreview ? 'transparent' : 'inherit'
                      }}
                    >
                      {!logoPreview && t('ptnsUploadPlaceholder') || "Upload Photo"}
                    </label>
                  </div>
                </div>

                {/* 약관 체크박스 (for partner form) */}
                <div className="mainptns-form-footer" style={{ marginTop: '20px' }}>
                  {/* 이용 약관 동의 */}
                  <label className="mainptns-agreement-label">
                    <input type="checkbox" name="agreeTerms"
                      checked={agreements.terms}
                      onClick={(e) => openModal(e, 'terms')} readOnly />
                    <span className="mainptns-agreement-text" onClick={(e) => openModal(e, 'terms')} style={{ cursor: 'pointer' }}>
                      {t('ptnsTermsLabel') || "I agree to Terms of Service."}
                      <span style={{ color: '#ee0000', marginLeft: '6px', fontSize: '12px', fontWeight: '900' }}>{t('ptnsRequired')}</span>
                    </span>
                  </label>

                  {/* 개인정보 수집 및 이용 동의 */}
                  <label className="mainptns-agreement-label" style={{ marginTop: '8px' }}>
                    <input type="checkbox" name="agreePrivacy"
                      checked={agreements.privacy}
                      onClick={(e) => openModal(e, 'privacy')} readOnly />
                    <span className="mainptns-agreement-text" onClick={(e) => openModal(e, 'privacy')} style={{ cursor: 'pointer' }}>
                      {t('ptnsAgreementLabel')}
                      <span style={{ color: '#ee0000', marginLeft: '6px', fontSize: '12px', fontWeight: '900' }}>{t('ptnsRequired')}</span>
                    </span>
                  </label>

                  {/* 폼 등록하기 버튼 */}
                  <button className="mainptns-submit-button" type="submit" style={{ marginTop: '20px' }}>
                    {t('ptnsPartnerSubmit') || "Register Partner"}
                  </button>
                </div>
              </div>
            </form>
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
          <div className="mainptns-text-content">
            {modalContent.description && (
              <p className="mainptns-modal-description">
                {modalContent.description}
              </p>
            )}
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
          <button className="mainptns-btn-cancel" onClick={closeModal}>{t('ptnsModalCancel')}</button>
          <button className="mainptns-btn-confirm" onClick={confirmModal}>{t('ptnsModalConfirm')}</button>
        </div>
      </div>
    </div>
  )}
  </>
  );
}