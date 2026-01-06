/**
 * @file src/components/main/sections/MainPTNS.jsx
 * @description 제휴업체 페이지 
 * 251216 v1.0.0 sara init
 * 251223 v2.0.0 jun 라이더, 파트너 form 추가
 * 260102 v2.1.0 sara 미리보기 사진 삭제 기능 removeFile 복구, 주소 변환 부분 searchAddressToCoords 유틸로 분리
 * 260103 v2.2.0 sara placeholder 다국어 처리, 휴지통 아이콘 컴포넌트화
*/

import { useContext, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../../../context/LanguageContext';
import { footerData } from '../../../data/footerData';
import { riderFormThunk, partnerFormThunk } from '../../../store/thunks/formThunk.js';
import TrashBinIcon from '../../common/icons/TrashBinIcon.jsx'; // 휴지통 아이콘
import { riderImageUploadThunk, partnerImageUploadThunk } from '../../../store/thunks/imageUploadThunk.js'; 
import { useKakaoLoader } from 'react-kakao-maps-sdk';
import { searchAddressToCoords } from '../../../utils/searchAddressToCoords.js'; // 주소 -> 좌표 변환 유틸
import './MainPTNS.css';

export default function MainPTNS() {
  const { t, lang } = useContext(LanguageContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);

  // 1. 프리뷰 및 실제 파일 상태 관리
  const [licenseFile, setLicenseFile] = useState(null);
  const [licensePreview, setLicensePreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // 2. Input 초기화를 위한 Ref
  const riderFileInputRef = useRef(null);
  const partnerFileInputRef = useRef(null);

  // 3. 약관 동의 및 모달 상태
  const [riderAgreements, setRiderAgreements] = useState({ terms: false, privacy: false });
  const [partnerAgreements, setPartnerAgreements] = useState({ terms: false, privacy: false });
  const [activeModal, setActiveModal] = useState(null);

  // 4. 카카오 API 로더
  useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_API_KEY,
    libraries: ["services"],
  });

  // 5. 메모리 누수 방지 (Object URL 해제)
  useEffect(() => {
    return () => {
      if (licensePreview) URL.revokeObjectURL(licensePreview);
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [licensePreview, logoPreview]);

  // 6. 이미지 삭제 핸들러
  const removeFile = (type) => {
    if (type === 'license') {
      if (licensePreview) URL.revokeObjectURL(licensePreview);
      setLicensePreview(null);
      setLicenseFile(null);
      if (riderFileInputRef.current) riderFileInputRef.current.value = '';
    } else if (type === 'logo') {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      setLogoPreview(null);
      setLogoFile(null);
      if (partnerFileInputRef.current) partnerFileInputRef.current.value = '';
    }
  };

  // 7. 파일 선택 핸들러
  const changeFiles = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      if (name === 'licenseImg') {
        setLicenseFile(file);
        setLicensePreview(objectUrl);
      } else if (name === 'storeLogo') {
        setLogoFile(file);
        setLogoPreview(objectUrl);
      }
    }
  };

  // 8. 약관 모달 핸들러
  const openModal = (target, type) => {
    if (!isLoggedIn) return alert(t('coverLoginRequired'));
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

  // 9. 라이더 제휴 폼 제출
  const onSubmitRider = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert(t('coverLoginRequired'));
      navigate('/login');
      return;
    }
    if (!riderAgreements.terms || !riderAgreements.privacy) {
      alert(t('ptnsAgreeRequiredAlert'));
      return;
    }
    const form = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(form.entries());

    // Validation
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(rawData.riderPhone)) {
      alert(t('ptnsInvalidPhoneAlert'));
      return;
    }
    const numericRegex = /^\d+$/;
    if (!numericRegex.test(rawData.accountNumber)) {
      alert(t('ptnsInvalidAccountAlert'));
      return;
    }

    try {
      let licenseImgPath = null;
      if (licenseFile) {
        const uploadResult = await dispatch(riderImageUploadThunk(licenseFile)).unwrap();
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
      alert(t('ptnsErrorAlert') + (error.msg || error.message));
    }
  };

  // 10. 파트너 제휴 폼 제출
  const onSubmitPartner = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert(t('coverLoginRequired'));
      navigate('/login');
      return;
    }
    if (!partnerAgreements.terms || !partnerAgreements.privacy) {
      alert(t('ptnsAgreeRequiredAlert'));
      return;
    }
    const form = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(form.entries());

    // Validation
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(rawData.partnerPhone)) {
      alert(t('ptnsInvalidPhoneAlert'));
      return;
    }
    const businessNumRegex = /^\d{10}$/;
    if (!businessNumRegex.test(rawData.businessNumber)) {
      alert(t('ptnsInvalidBusinessNumAlert'));
      return;
    }

    try {
      let logoImgPath = null;
      if (logoFile) {
        const uploadResult = await dispatch(partnerImageUploadThunk(logoFile)).unwrap();
        logoImgPath = uploadResult.data.path;
      }

      // 11. 주소 좌표 변환 로직
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
      alert(t('ptnsErrorAlert') + (error.msg || error.message));
    }
  };

  const modalType = activeModal ? activeModal.split('_')[1] : null;
  const modalContent = modalType
    ? footerData[lang]?.[modalType] || footerData.ko?.[modalType]
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
            <form id="rider-application-form" className={`mainptns-card-box form-section ${!isLoggedIn ? 'mainptns-disabled' : ''}`} onSubmit={onSubmitRider}>
              {!isLoggedIn && (
               <div className="mainptns-disabled-overlay">
                  <span className="mainptns-disabled-text">{t('coverLoginRequired')}</span>
                  <button type="button" className="mainptns-disabled-login-btn" onClick={() => navigate('/login')}>
                    {t('headerLogin')}
                  </button>
                </div>
                )}
                <div className="form-header-row">
                  <h3 className="mainptns-card-title-text">{t('ptnsFormRiderTitle')}</h3>
                </div>
                <div className="mainptns-form-fields-group">
                  <label className="mainptns-field-label">{t('ptnsPhoneLabel')}
                    <input className="mainptns-field-input" name="riderPhone" required placeholder={t('ptnsRiderPhonePlaceholder')} />
                  </label>
                  <label className="mainptns-field-label">{t('ptnsAddressLabel')}
                    <input className="mainptns-field-input" name="riderAddress" required placeholder={t('ptnsAddressPlaceholder')} />
                  </label>
                  <label className="mainptns-field-label">{t('ptnsBankNameLabel')}
                    <input className="mainptns-field-input" name="bankName" required placeholder={t('ptnsBankNamePlaceholder')} />
                  </label>
                  <label className="mainptns-field-label">{t('ptnsAccountNumLabel')}
                    <input className="mainptns-field-input" name="accountNumber" required placeholder={t('ptnsAccountNumPlaceholder')} />
                  </label>
                  <div className="mainptns-field-label">
                    {t('ptnsLicenseLabel')}
                    <div style={{ marginTop: '8px', position: 'relative' }}>
                      <input type="file" onChange={changeFiles} name="licenseImg" id="licenseImg" className="mainptns-file-hidden" accept="image/*" required ref={riderFileInputRef} disabled={!isLoggedIn} />
                      <label htmlFor="licenseImg" className="mainptns-file-box" style={{
                          backgroundImage: licensePreview ? `url("${licensePreview}")` : 'none',
                          backgroundSize: 'contain', height: licensePreview ? '200px' : '80px',
                          backgroundPosition: 'center', backgroundRepeat: 'no-repeat', color: licensePreview ? 'transparent' : '#ccc'
                        }}>
                        {!licensePreview && (t('ptnsUploadPlaceholder'))}
                      </label>
                      {licensePreview && (
                        <button type="button" className="mainptns-preview-delete-btn" onClick={() => removeFile('license')}>
                          <TrashBinIcon size={22} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mainptns-form-footer">
                  <label className="mainptns-agreement-label">
                    <input type="checkbox" checked={riderAgreements.terms} onClick={() => openModal('rider', 'terms')} readOnly />
                    <span className="mainptns-agreement-text">{t('ptnsTermsLabel')} <span className="is-required">{t('ptnsRequired')}</span></span>
                  </label>
                  <label className="mainptns-agreement-label">
                    <input type="checkbox" checked={riderAgreements.privacy} onClick={() => openModal('rider', 'privacy')} readOnly />
                    <span className="mainptns-agreement-text">{t('ptnsAgreementLabel')} <span className="is-required">{t('ptnsRequired')}</span></span>
                  </label>
                  <button className="mainptns-submit-button" type="submit">{t('ptnsRiderSubmit')}</button>
                </div>
            </form>

            {/* 파트너 폼 */}
            <form
             id="partner-application-form"
              className={`mainptns-card-box form-section ${!isLoggedIn ? 'mainptns-disabled' : ''}`} 
              onSubmit={onSubmitPartner}
            >
              {/* 비로그인 오버레이 */}
              {!isLoggedIn && (
               <div className="mainptns-disabled-overlay">
                  <span className="mainptns-disabled-text">{t('coverLoginRequired')}</span>
                  <button type="button" className="mainptns-disabled-login-btn" onClick={() => navigate('/login')}>
                    {t('headerLogin')}
                  </button>
                </div>
                )}

                <div className="form-header-row">
                  <h3 className="mainptns-card-title-text">{t('ptnsFormPartnerTitle')}</h3>
                </div>

                <div className="mainptns-form-fields-group">
                    <div className="mainptns-input-grid-2">
                      <label className="mainptns-field-label">{t('ptnsManagerNameLabel')}
                        <input className="mainptns-field-input" name="managerName" required placeholder={t('ptnsManagerNamePlaceholder')} disabled={!isLoggedIn} />
                      </label>
                      <label className="mainptns-field-label">{t('ptnsPhoneLabel')}
                        <input className="mainptns-field-input" name="partnerPhone" required placeholder={t('ptnsPartnerPhonePlaceholder')} disabled={!isLoggedIn} />
                      </label>
                    </div>

                    <div className="mainptns-input-grid-2">
                      <label className="mainptns-field-label">{t('ptnsStoreNameKrLabel')}
                        <input className="mainptns-field-input" name="storeNameKr" required placeholder={t('ptnsStoreNameKrPlaceholder')} disabled={!isLoggedIn} />
                      </label>
                      <label className="mainptns-field-label">{t('ptnsStoreNameEnLabel')}
                        <input className="mainptns-field-input" name="storeNameEn" required placeholder={t('ptnsStoreNameEnPlaceholder')} disabled={!isLoggedIn} />
                      </label>
                    </div>

                    <label className="mainptns-field-label">{t('ptnsBusinessNumLabel')}
                      <input className="mainptns-field-input" name="businessNumber" required placeholder={t('ptnsBusinessNumPlaceholder')} maxLength="11" disabled={!isLoggedIn} />
                    </label>

                    <label className="mainptns-field-label">{t('ptnsAddressLabel')}
                      <input className="mainptns-field-input" name="storeAddress" required placeholder={t('ptnsAddressPlaceholder')} disabled={!isLoggedIn} />
                    </label>

                    <div className="mainptns-field-label">
                      {t('ptnsStoreLogoLabel')}
                      <div style={{ marginTop: '8px', position: 'relative' }}>
                        <input type="file" onChange={changeFiles} name="storeLogo" id="storeLogo" className="mainptns-file-hidden" accept="image/*" required ref={partnerFileInputRef} disabled={!isLoggedIn} />
                        <label htmlFor="storeLogo" className="mainptns-file-box" style={{
                            backgroundImage: logoPreview ? `url("${logoPreview}")` : 'none',
                            backgroundSize: 'contain', height: logoPreview ? '200px' : '80px',
                            backgroundPosition: 'center', backgroundRepeat: 'no-repeat', color: logoPreview ? 'transparent' : '#ccc',
                            cursor: !isLoggedIn ? 'not-allowed' : 'pointer'
                          }}>
                          {!logoPreview && (t('ptnsUploadPlaceholder'))}
                        </label>
                        {logoPreview && isLoggedIn && (
                          <button type="button" className="mainptns-preview-delete-btn" onClick={() => removeFile('logo')}>
                            <TrashBinIcon size={22} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>  

                  <div className="mainptns-form-footer">
                      <label className="mainptns-agreement-label">
                        <input type="checkbox" checked={partnerAgreements.terms} onClick={() => openModal('partner', 'terms')} readOnly disabled={!isLoggedIn} />
                        <span className="mainptns-agreement-text">{t('ptnsTermsLabel')} <span className="is-required">{t('ptnsRequired')}</span></span>
                      </label>
                      <label className="mainptns-agreement-label">
                        <input type="checkbox" checked={partnerAgreements.privacy} onClick={() => openModal('partner', 'privacy')} readOnly disabled={!isLoggedIn} />
                        <span className="mainptns-agreement-text">{t('ptnsAgreementLabel')} <span className="is-required">{t('ptnsRequired')}</span></span>
                      </label>
                      <button className="mainptns-submit-button" type="submit" disabled={!isLoggedIn}>{t('ptnsPartnerSubmit')}</button>
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
                  <button className="mainptns-btn-cancel" onClick={closeModal}>{t('ptnsModalCancel')}</button>
                  <button className="mainptns-btn-confirm" onClick={confirmModal}>{t('ptnsModalConfirm')}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
