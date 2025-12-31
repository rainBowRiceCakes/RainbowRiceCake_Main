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
// 1. 이미지 업로드 Thunk import
import { riderImageUploadThunk, partnerImageUploadThunk } from '../../../store/thunks/imageUploadThunk.js'; 
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

  // [모달 핸들러]
  const openModal = (target, type) => {
    const currentAgreements = target === 'rider' ? riderAgreements : partnerAgreements;
    
    if (!currentAgreements[type]) {
      setActiveModal(`${target}_${type}`);
      document.body.style.overflow = 'hidden';
    } else {
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

  const confirmModal = () => {
    if (activeModal) {
      const [target, type] = activeModal.split('_');
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

    if (!riderAgreements.terms || !riderAgreements.privacy) {
      alert(t('ptnsAgreeRequiredAlert') || "이용약관과 개인정보 수집에 동의해주세요.");
      return;
    }
    
    const form = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(form.entries());

    try {
      let licenseImgPath = null;

      // 1. 이미지 선 업로드
      if (rawData.licenseImage && rawData.licenseImage.size > 0) {
          // Thunk에는 파일 객체 자체를 넘깁니다. (Thunk 내부에서 FormData 생성)
          const uploadResult = await dispatch(riderImageUploadThunk(rawData.licenseImage)).unwrap();

          
          // 백엔드 응답 구조: { success: true, path: "/uploads/..." }
          licenseImgPath = uploadResult.data.path;
          console.log("✅ 라이더 이미지 업로드 완료:", licenseImgPath);
      }

      // 2. 최종 신청 데이터 (JSON) 구성
      const payload = {
        phone: rawData.riderPhone,
        address: rawData.riderAddress,
        bank: rawData.bankName,
        bankNum: rawData.accountNumber,
        licenseImg: licenseImgPath // 이미지 경로(String) 포함
      };

      // 3. 신청서 제출
      await dispatch(riderFormThunk(payload)).unwrap();
      navigate('/');

    } catch (error) {
      console.error(error);
      alert("신청 중 오류가 발생했습니다: " + (error.msg || error.message || "알 수 없는 오류"));
    }
  };

  // 🏢 [파트너] 제출 핸들러 (수정됨)
  const onSubmitPartner = async (e) => {
    e.preventDefault();

    if (!partnerAgreements.terms || !partnerAgreements.privacy) {
      alert(t('ptnsAgreeRequiredAlert') || "이용약관과 개인정보 수집에 동의해주세요.");
      return;
    }

    const form = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(form.entries());

    try {
      let logoImgPath = null;

      // 1. 이미지 선 업로드
      if (rawData.storeLogo && rawData.storeLogo.size > 0) {
          const uploadResult = await dispatch(partnerImageUploadThunk(rawData.storeLogo)).unwrap();
          
          logoImgPath = uploadResult.data.path;
          console.log("✅ 파트너 이미지 업로드 완료:", logoImgPath);
      }

      // 2. 최종 신청 데이터 (JSON) 구성
      const payload = {
        manager: rawData.managerName,
        phone: rawData.partnerPhone,
        address: rawData.storeAddress,
        krName: rawData.storeNameKr,
        enName: rawData.storeNameEn,
        businessNum: rawData.businessNumber,
        lat: 37.5665, 
        lng: 126.9780,
        logoImg: logoImgPath // 이미지 경로(String) 포함
      };

      // 3. 신청서 제출
      await dispatch(partnerFormThunk(payload)).unwrap();
      navigate('/');

    } catch (error) {
      console.error("Submission Error:", error);
      alert("신청 중 오류가 발생했습니다: " + (error.msg || error.message || "알 수 없는 오류"));
    }
  };

  // 모달 콘텐츠 매핑
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
            
            {/* 라이더 폼 */}
            <form className="mainptns-card-box form-section" onSubmit={onSubmitRider}>
              <div className="form-header-row">
                <h3 className="mainptns-card-title-text">{t('ptnsFormRiderTitle') || "라이더 제휴 신청"}</h3>
              </div>
              <div className="mainptns-form-fields-group">
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

            {/* 파트너 폼 */}
            <form className="mainptns-card-box form-section" onSubmit={onSubmitPartner}>
              <div className="form-header-row">
                <h3 className="mainptns-card-title-text">{t('ptnsFormPartnerTitle') || "파트너 제휴 신청"}</h3>
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