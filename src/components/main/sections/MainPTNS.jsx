/**
 * @file src/components/main/sections/MainPTNS.jsx
 * @description 제휴업체 페이지 
 * 251216 v1.0.0 sara init
 * 251223 v2.0.0 jun 라이더, 파트너 form 추가
 */

import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../../../context/LanguageContext';
import { footerData } from '../../../data/footerData'; // 약관 데이터
import { riderFormThunk } from '../../../store/thunks/formThunk.js';
import { partnerFormThunk } from '../../../store/thunks/formThunk.js';
import './MainPTNS.css';

export default function MainPTNS() {
  const { t, language } = useContext(LanguageContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 미리보기 상태
  const [licensePreview, setLicensePreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // [상태 분리] 약관 동의 상태를 라이더/파트너 각각 관리
  const [riderAgreements, setRiderAgreements] = useState({ terms: false, privacy: false });
  const [partnerAgreements, setPartnerAgreements] = useState({ terms: false, privacy: false });

  // 모달 상태 ('rider_terms' | 'rider_privacy' | 'partner_terms' | 'partner_privacy')
  const [activeModal, setActiveModal] = useState(null);

  // 메모리 누수 방지
  useEffect(() => {
    return () => {
      if (licensePreview) URL.revokeObjectURL(licensePreview);
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [licensePreview, logoPreview]);

  // 파일 변경 핸들러
  const changeFiles = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      if (name === 'licenseImage') {
        setLicensePreview(objectUrl);
      } else if (name === 'storeLogo') {
        setLogoPreview(objectUrl);
      }
    }
  };

  // [모달 핸들러 수정] 어떤 폼(target)의 어떤 약관(type)인지 구분
  // target: 'rider' | 'partner', type: 'terms' | 'privacy'
  const openModal = (target, type) => {
    const currentAgreements = target === 'rider' ? riderAgreements : partnerAgreements;
    
    if (!currentAgreements[type]) {
      // 체크가 안 되어 있으면 모달 열기
      setActiveModal(`${target}_${type}`); // 예: rider_terms
      document.body.style.overflow = 'hidden';
    } else {
      // 이미 체크되어 있으면 해제
      if (target === 'rider') {
        setRiderAgreements(prev => ({ ...prev, [type]: false }));
      } else {
        setPartnerAgreements(prev => ({ ...prev, [type]: false }));
      }
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'auto';
  };

  // [동의 처리 수정] 현재 활성화된 모달에 따라 해당 상태 업데이트
  const confirmModal = () => {
    if (activeModal) {
      const [target, type] = activeModal.split('_'); // 'rider', 'terms' 분리

      if (target === 'rider') {
        setRiderAgreements(prev => ({ ...prev, [type]: true }));
      } else {
        setPartnerAgreements(prev => ({ ...prev, [type]: true }));
      }
      closeModal();
    }
  };

  // 🛵 [라이더] 제출 핸들러
  const onSubmitRider = async (e) => {
    e.preventDefault();

    // 라이더 약관 확인
    if (!riderAgreements.terms || !riderAgreements.privacy) {
      alert(t('ptnsAgreeRequiredAlert') || "이용약관과 개인정보 수집에 동의해주세요.");
      return;
    }
    
    const form = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(form.entries());
    const payload = new FormData();

    payload.append('phone', rawData.riderPhone);
    payload.append('address', rawData.riderAddress);
    payload.append('bank', rawData.bankName);
    payload.append('bankNum', rawData.accountNumber);
    
    if (rawData.licenseImage && rawData.licenseImage.size > 0) {
        payload.append('licenseImg', rawData.licenseImage); 
    }

    try {
      await dispatch(riderFormThunk(payload)).unwrap();
      navigate('/');
    } catch (error) {
      console.error(error);
      alert("이미 라이더 권한을 보유하고 계십니다.");
    }
  };

  // 🏢 [파트너] 제출 핸들러
  const onSubmitPartner = async (e) => {
    e.preventDefault();

    // 파트너 약관 확인
    if (!partnerAgreements.terms || !partnerAgreements.privacy) {
      alert(t('ptnsAgreeRequiredAlert') || "이용약관과 개인정보 수집에 동의해주세요.");
      return;
    }

    const form = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(form.entries());
    const payload = new FormData();

    payload.append('manager', rawData.managerName);
    payload.append('phone', rawData.partnerPhone);
    payload.append('address', rawData.storeAddress);
    payload.append('krName', rawData.storeNameKr);
    payload.append('enName', rawData.storeNameEn);
    payload.append('businessNum', rawData.businessNumber);
    payload.append('lat', 37.5665); 
    payload.append('lng', 126.9780);

    if (rawData.storeLogo && rawData.storeLogo.size > 0) {
        payload.append('logoImg', rawData.storeLogo);
    }
    
    try {
      await dispatch(partnerFormThunk(payload)).unwrap();
      navigate('/');
    } catch (error) {
      console.error("Submission Error:", error);
      alert("이미 파트너 권한을 보유하고 계십니다.");
    }
  };

  // 모달 콘텐츠 매핑 (footerData 키값 매칭)
  // activeModal이 'rider_terms'라면 'terms' 데이터를 가져옴
  const getModalKey = () => activeModal ? activeModal.split('_')[1] : null;
  const modalKey = getModalKey();
  
  const modalContent = modalKey
    ? (footerData[language] ? footerData[language][modalKey] : footerData['ko'][modalKey]) 
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

          {/* 메인 폼 그리드 (좌: 라이더 / 우: 파트너) */}
          <div className="mainptns-grid-layout">
            
            {/* ========================================= */}
            {/* 🛵 [왼쪽] 라이더 신청 폼 카드 */}
            {/* ========================================= */}
            <form className="mainptns-card-box form-section" onSubmit={onSubmitRider}>
              <div className="form-header-row">
                <h3 className="mainptns-card-title-text">
                  {t('ptnsFormRiderTitle') || "라이더 제휴 신청"}
                </h3>
              </div>

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
                    <input type="file" onChange={changeFiles} name="licenseImage" id="licenseImage" className="mainptns-file-hidden" accept="image/*" required />
                    <label htmlFor="licenseImage" className="mainptns-file-box" style={{
                        backgroundImage: licensePreview ? `url("${licensePreview}")` : 'none',
                        backgroundSize: 'contain', height: licensePreview ? '200px' : undefined,
                        backgroundPosition: 'center', backgroundRepeat: 'no-repeat', color: licensePreview ? 'transparent' : 'inherit'
                      }}>
                      {!licensePreview && (t('ptnsUploadPlaceholder') || "Upload Photo")}
                    </label>
                  </div>
                </div>
              </div>

              {/* 라이더 약관 및 제출 버튼 */}
              <div className="mainptns-form-footer" style={{ marginTop: '20px' }}>
                <label className="mainptns-agreement-label">
                  <input type="checkbox" checked={riderAgreements.terms} onClick={() => openModal('rider', 'terms')} readOnly />
                  <span className="mainptns-agreement-text">
                    {t('ptnsTermsLabel') || "I agree to Terms of Service."}
                    <span style={{ color: '#ee0000', marginLeft: '6px', fontSize: '12px', fontWeight: '900' }}>(필수)</span>
                  </span>
                </label>
                <label className="mainptns-agreement-label" style={{ marginTop: '8px' }}>
                  <input type="checkbox" checked={riderAgreements.privacy} onClick={() => openModal('rider', 'privacy')} readOnly />
                  <span className="mainptns-agreement-text">
                    {t('ptnsAgreementLabel')}
                    <span style={{ color: '#ee0000', marginLeft: '6px', fontSize: '12px', fontWeight: '900' }}>(필수)</span>
                  </span>
                </label>
                <button className="mainptns-submit-button" type="submit" style={{ marginTop: '20px' }}>
                  {t('ptnsRiderSubmit') || "Register Rider"}
                </button>
              </div>
            </form>


            {/* ========================================= */}
            {/* 🏢 [오른쪽] 파트너 신청 폼 카드 */}
            {/* ========================================= */}
            <form className="mainptns-card-box form-section" onSubmit={onSubmitPartner}>
              <div className="form-header-row">
                <h3 className="mainptns-card-title-text">
                  {t('ptnsFormPartnerTitle') || "파트너 제휴 신청"}
                </h3>
              </div>

              <div className="mainptns-form-fields-group">
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
                    <input type="file" onChange={changeFiles} name="storeLogo" id="storeLogo" className="mainptns-file-hidden" accept="image/*" required />
                    <label htmlFor="storeLogo" className="mainptns-file-box" style={{
                        backgroundImage: logoPreview ? `url("${logoPreview}")` : 'none',
                        backgroundSize: 'contain', height: logoPreview ? '200px' : undefined,
                        backgroundPosition: 'center', backgroundRepeat: 'no-repeat', color: logoPreview ? 'transparent' : 'inherit'
                      }}>
                      {!logoPreview && (t('ptnsUploadPlaceholder') || "Upload Photo")}
                    </label>
                  </div>
                </div>
              </div>

              {/* 파트너 약관 및 제출 버튼 */}
              <div className="mainptns-form-footer" style={{ marginTop: '20px' }}>
                <label className="mainptns-agreement-label">
                  <input type="checkbox" checked={partnerAgreements.terms} onClick={() => openModal('partner', 'terms')} readOnly />
                  <span className="mainptns-agreement-text">
                    {t('ptnsTermsLabel') || "I agree to Terms of Service."}
                    <span style={{ color: '#ee0000', marginLeft: '6px', fontSize: '12px', fontWeight: '900' }}>(필수)</span>
                  </span>
                </label>
                <label className="mainptns-agreement-label" style={{ marginTop: '8px' }}>
                  <input type="checkbox" checked={partnerAgreements.privacy} onClick={() => openModal('partner', 'privacy')} readOnly />
                  <span className="mainptns-agreement-text">
                    {t('ptnsAgreementLabel')}
                    <span style={{ color: '#ee0000', marginLeft: '6px', fontSize: '12px', fontWeight: '900' }}>(필수)</span>
                  </span>
                </label>
                <button className="mainptns-submit-button" type="submit" style={{ marginTop: '20px' }}>
                  {t('ptnsPartnerSubmit') || "Register Partner"}
                </button>
              </div>
            </form>
          </div>

          {/* 통합 모달 */}
          {modalContent && (
            <div className="mainptns-modal-overlay" onClick={closeModal}>
              <div className="mainptns-modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="mainptns-modal-header">
                  <h3>{modalContent.title}</h3>
                  <button className="mainptns-close-x-btn" onClick={closeModal}>✕</button>
                </div>
                <div className="mainptns-modal-body">
                  <div className="mainptns-text-content">
                    {/* 모달 내용 렌더링 (기존 동일) */}
                    {modalContent.description && <p className="mainptns-modal-description">{modalContent.description}</p>}
                    {modalContent.articles && modalContent.articles.map((article, idx) => (
                      <div key={idx} style={{ marginBottom: '20px' }}>
                        {article.heading && <h4>{article.heading}</h4>}
                        {article.text && <p>{article.text}</p>}
                        {article.list && <ul>{article.list.map((item, i) => <li key={i}>{item}</li>)}</ul>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mainptns-modal-footer">
                  <button className="mainptns-btn-cancel" onClick={closeModal}>취소</button>
                  <button className="mainptns-btn-confirm" onClick={confirmModal}>동의 및 확인</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}