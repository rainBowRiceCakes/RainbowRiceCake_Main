/**
 * @file src/components/main/sections/MainPTNS.jsx
 * @description 제휴업체 페이지 
 * 251216 v1.0.0 sara init
 * 251223 v2.0.0 jun 라이더, 파트너 form 추가
 * 260102 v2.1.0 sara 미리보기 사진 삭제 기능 removeFile 복구, 주소 변환 부분 searchAddressToCoords 유틸로 분리
 */

import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../../../context/LanguageContext';
import { footerData } from '../../../data/footerData';
import { riderFormThunk } from '../../../store/thunks/formThunk.js';
import { partnerFormThunk } from '../../../store/thunks/formThunk.js';
import TrashBinBoldShort from '../../common/icons/TrashBinBoldShort.jsx'; // 휴지통 아이콘
import { riderImageUploadThunk, partnerImageUploadThunk } from '../../../store/thunks/imageUploadThunk.js'; 
import './MainPTNS.css';
import { useKakaoLoader } from 'react-kakao-maps-sdk';
import { searchAddressToCoords } from '../../../utils/searchAddressToCoords.js';

export default function MainPTNS() {
  const { t, language } = useContext(LanguageContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. 프리뷰 상태 관리
  const [licensePreview, setLicensePreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // 2. 약관 동의 상태
  const [riderAgreements, setRiderAgreements] = useState({ terms: false, privacy: false });
  const [partnerAgreements, setPartnerAgreements] = useState({ terms: false, privacy: false });

  // 3. 모달 상태
  const [activeModal, setActiveModal] = useState(null);

  // 카카오 API 로더
  useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_API_KEY,
    libraries: ["services"],
  });

  // 메모리 누수 방지 (Object URL 해제)
  useEffect(() => {
    return () => {
      if (licensePreview) URL.revokeObjectURL(licensePreview);
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [licensePreview, logoPreview]);

  // 이미지 삭제 핸들러
  const removeFile = (type) => {
    if (type === 'licenseImg') {
      if (licensePreview) URL.revokeObjectURL(licensePreview);
      setLicensePreview(null);
      const input = document.getElementById('licenseImg');
      if (input) input.value = ''; // input 초기화로 동일 파일 재선택 가능케 함
    } else if (type === 'storeLogo') {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      setLogoPreview(null);
      const input = document.getElementById('storeLogo');
      if (input) input.value = '';
    }
  };

  // 파일 선택 핸들러
  const changeFiles = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      if (name === 'licenseImg') setLicensePreview(objectUrl);
      else if (name === 'storeLogo') setLogoPreview(objectUrl);
    }
  };

  // 약관 모달 핸들러
  const openModal = (target, type) => {
    const currentAgreements = target === 'rider' ? riderAgreements : partnerAgreements;
    if (!currentAgreements[type]) {
      setActiveModal(`${target}_${type}`);
      document.body.style.overflow = 'hidden';
    } else {
      const setter = target === 'rider' ? setRiderAgreements : setPartnerAgreements;
      setter(prev => ({ ...prev, [type]: false }));
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'auto';
  };

  const confirmModal = () => {
    if (activeModal) {
      const [target, type] = activeModal.split('_');
      const setter = target === 'rider' ? setRiderAgreements : setPartnerAgreements;
      setter(prev => ({ ...prev, [type]: true }));
      closeModal();
    }
  };

  // 🛵 라이더 제출
  const onSubmitRider = async (e) => {
    e.preventDefault();
    if (!riderAgreements.terms || !riderAgreements.privacy) {
      alert(t('ptnsAgreeRequiredAlert'));
      return;
    }
    const form = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(form.entries());

    try {
      let licenseImgPath = null;
      if (rawData.licenseImg && rawData.licenseImg.size > 0) {
        const uploadResult = await dispatch(riderImageUploadThunk(rawData.licenseImg)).unwrap();
        licenseImgPath = uploadResult.data.path;
      }

      const payload = {
        phone: rawData.riderPhone,
        address: rawData.riderAddress,
        bank: rawData.bankName,
        bankNum: rawData.accountNumber,
        licenseImg: licenseImgPath
      };

      await dispatch(riderFormThunk(payload)).unwrap();
      navigate('/');
    } catch (error) {
      alert("오류 발생: " + (error.msg || error.message));
    }
  };

  // 🏢 파트너 제출
  const onSubmitPartner = async (e) => {
    e.preventDefault();
    if (!partnerAgreements.terms || !partnerAgreements.privacy) {
      alert(t('ptnsAgreeRequiredAlert'));
      return;
    }
    const form = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(form.entries());

    try {
      let logoImgPath = null;
      if (rawData.storeLogo && rawData.storeLogo.size > 0) {
        const uploadResult = await dispatch(partnerImageUploadThunk(rawData.storeLogo)).unwrap();
        logoImgPath = uploadResult.data.path;
      }

      // 주소 좌표 변환 로직
      const coords = await searchAddressToCoords(rawData.storeAddress);

      const payload = {
        manager: rawData.managerName,
        phone: rawData.partnerPhone,
        address: rawData.storeAddress,
        krName: rawData.storeNameKr,
        enName: rawData.storeNameEn,
        businessNum: rawData.businessNumber,
        logoImg: logoImgPath,
        lat: coords.lat,
        lng: coords.lng
      };

      await dispatch(partnerFormThunk(payload)).unwrap();
      navigate('/');
    } catch (error) {
      alert("오류 발생: " + (error.msg || error.message));
    }
  };

  const modalContent = activeModal 
    ? (footerData[language]?.[activeModal.split('_')[1]] || footerData['ko']?.[activeModal.split('_')[1]])
    : null;

  return (
    <>
      <div className="mainptns-frame" id="partners">
        <div className="mainptns-container">
          <div className="mainptns-header-group">
            <h2 className="mainptns-title-text">{t('ptnsTitle')}</h2>
            <p className="mainptns-desc-text">{t('ptnsDesc')}</p>
          </div>

          <div className="mainptns-grid-layout">
            {/* 라이더 폼 */}
            <form className="mainptns-card-box form-section" onSubmit={onSubmitRider}>
              <div className="form-header-row">
                <h3 className="mainptns-card-title-text">{t('ptnsFormRiderTitle')}</h3>
              </div>
              <div className="mainptns-form-fields-group">
                <label className="mainptns-field-label">{t('ptnsPhoneLabel')}
                  <input className="mainptns-field-input" name="riderPhone" required placeholder="010-0000-0000" />
                </label>
                <label className="mainptns-field-label">{t('ptnsAddressLabel')}
                  <input className="mainptns-field-input" name="riderAddress" required placeholder={t('ptnsAddressPlaceholder')} />
                </label>
                <label className="mainptns-field-label">{t('ptnsBankNameLabel')}
                  <input className="mainptns-field-input" name="bankName" required />
                </label>
                <label className="mainptns-field-label">{t('ptnsAccountNumLabel')}
                  <input className="mainptns-field-input" name="accountNumber" required />
                </label>
                <div className="mainptns-field-label">
                  {t('ptnsLicenseLabel')}
                  <div style={{ marginTop: '8px', position: 'relative' }}>
                    <input type="file" onChange={changeFiles} name="licenseImg" id="licenseImg" className="mainptns-file-hidden" accept="image/*" required />
                    <label htmlFor="licenseImg" className="mainptns-file-box" style={{
                        backgroundImage: licensePreview ? `url("${licensePreview}")` : 'none',
                        backgroundSize: 'contain', height: licensePreview ? '200px' : '80px',
                        backgroundPosition: 'center', backgroundRepeat: 'no-repeat', color: licensePreview ? 'transparent' : 'inherit'
                      }}>
                      {!licensePreview && (t('ptnsUploadPlaceholder'))}
                    </label>
                    {licensePreview && (
                      <button type="button" className="maincs-preview-delete-btn" onClick={() => removeFile('license')}>
                        <TrashBinBoldShort size={22} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="mainptns-form-footer">
                <label className="mainptns-agreement-label">
                  <input type="checkbox" checked={riderAgreements.terms} onClick={() => openModal('rider', 'terms')} readOnly />
                  <span className="mainptns-agreement-text">{t('ptnsTermsLabel')} <span className="is-required">(필수)</span></span>
                </label>
                <label className="mainptns-agreement-label">
                  <input type="checkbox" checked={riderAgreements.privacy} onClick={() => openModal('rider', 'privacy')} readOnly />
                  <span className="mainptns-agreement-text">{t('ptnsAgreementLabel')} <span className="is-required">(필수)</span></span>
                </label>
                <button className="mainptns-submit-button" type="submit">{t('ptnsRiderSubmit')}</button>
              </div>
            </form>

            {/* 파트너 폼 */}
            <form className="mainptns-card-box form-section" onSubmit={onSubmitPartner}>
              <div className="form-header-row">
                <h3 className="mainptns-card-title-text">{t('ptnsFormPartnerTitle')}</h3>
              </div>
              <div className="mainptns-form-fields-group">
                <div className="mainptns-input-grid-2">
                  <label className="mainptns-field-label">{t('ptnsManagerNameLabel')}
                    <input className="mainptns-field-input" name="managerName" required />
                  </label>
                  <label className="mainptns-field-label">{t('ptnsPhoneLabel')}
                    <input className="mainptns-field-input" name="partnerPhone" required />
                  </label>
                </div>
                <div className="mainptns-input-grid-2">
                  <label className="mainptns-field-label">{t('ptnsStoreNameKrLabel')}
                    <input className="mainptns-field-input" name="storeNameKr" required />
                  </label>
                  <label className="mainptns-field-label">{t('ptnsStoreNameEnLabel')}
                    <input className="mainptns-field-input" name="storeNameEn" required />
                  </label>
                </div>
                <label className="mainptns-field-label">{t('ptnsBusinessNumLabel')}
                  <input className="mainptns-field-input" name="businessNumber" required />
                </label>
                <label className="mainptns-field-label">{t('ptnsAddressLabel')}
                  <input className="mainptns-field-input" name="storeAddress" required />
                </label>
                <div className="mainptns-field-label">
                  {t('ptnsStoreLogoLabel')}
                  <div style={{ marginTop: '8px', position: 'relative' }}>
                    <input type="file" onChange={changeFiles} name="storeLogo" id="storeLogo" className="mainptns-file-hidden" accept="image/*" required />
                    <label htmlFor="storeLogo" className="mainptns-file-box" style={{
                        backgroundImage: logoPreview ? `url("${logoPreview}")` : 'none',
                        backgroundSize: 'contain', height: logoPreview ? '200px' : '80px',
                        backgroundPosition: 'center', backgroundRepeat: 'no-repeat', color: logoPreview ? 'transparent' : 'inherit'
                      }}>
                      {!logoPreview && (t('ptnsUploadPlaceholder'))}
                    </label>
                    {logoPreview && (
                      <button type="button" className="maincs-preview-delete-btn" onClick={() => removeFile('logo')}>
                        <TrashBinBoldShort size={22} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="mainptns-form-footer">
                <label className="mainptns-agreement-label">
                  <input type="checkbox" checked={partnerAgreements.terms} onClick={() => openModal('partner', 'terms')} readOnly />
                  <span className="mainptns-agreement-text">{t('ptnsTermsLabel')} <span className="is-required">(필수)</span></span>
                </label>
                <label className="mainptns-agreement-label">
                  <input type="checkbox" checked={partnerAgreements.privacy} onClick={() => openModal('partner', 'privacy')} readOnly />
                  <span className="mainptns-agreement-text">{t('ptnsAgreementLabel')} <span className="is-required">(필수)</span></span>
                </label>
                <button className="mainptns-submit-button" type="submit">{t('ptnsPartnerSubmit')}</button>
              </div>
            </form>
          </div>

          {/* 모달 */}
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
                    {modalContent.articles?.map((article, idx) => (
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