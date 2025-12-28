/**
 * @file src/components/main/sections/MainPTNS.jsx
 * @description 제휴업체 페이지 
 * 251216 v1.0.0 sara init
 * 251223 v2.0.0 jun 라이더, 파트너 form 추가
 */

import { useContext, useEffect, useState, useRef } from 'react';
import { LanguageContext } from '../../../context/LanguageContext';
import { footerData } from '../../../data/footerData';
import TrashBinBoldShort from '../../common/icons/TrashBinBoldShort';
import './MainPTNS.css';

export default function MainPTNS() {
  const { t, lang } = useContext(LanguageContext);
  const [licensePreview, setLicensePreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const licenseInputRef = useRef(null);
  const logoInputRef = useRef(null);
  
  const [agreements, setAgreements] = useState({ terms: false, privacy: false });
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    return () => {
      if (licensePreview) URL.revokeObjectURL(licensePreview);
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [licensePreview, logoPreview]);

  const changeFiles = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      if (name === 'licenseImage') setLicensePreview(objectUrl);
      else if (name === 'storeLogo') setLogoPreview(objectUrl);
    }
  };

  const removeLicensePreview = () => {
    setLicensePreview(null);
    if (licenseInputRef.current) licenseInputRef.current.value = "";
  };

  const removeLogoPreview = () => {
    setLogoPreview(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const openModal = (e, type) => {
    e.preventDefault();
    setActiveModal(type);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'auto';
  };

  const confirmModal = () => {
    if (activeModal) {
      setAgreements((prev) => ({ ...prev, [activeModal]: true }));
      closeModal();
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!agreements.terms || !agreements.privacy) {
      alert(t('ptnsAgreeRequiredAlert'));
      return;
    }
    alert(t('ptnsSubmitSuccessAlert'));
    e.currentTarget.reset();
    setAgreements({ terms: false, privacy: false });
    removeLicensePreview();
    removeLogoPreview();
  };

  const modalContent = activeModal ? footerData[lang]?.[activeModal] : null;

  return (
    <div className="mainptns-frame mainshow-section-frame" id="partners">
      <div className="mainshow-section-wrapper">
        <div className="mainptns-header-group">
          <h2 className="mainptns-title-text">{t('ptnsTitle')}</h2>
          <p className="mainptns-desc-text">{t('ptnsDesc')}</p>
        </div>

        <div className="mainptns-grid-2">
          {/* 라이더 제휴 신청 폼 */}
          <form className="mainptns-card-box" onSubmit={onSubmit}>
            <h3 className="mainptns-card-title-text">{t('ptnsFormRiderTitle')}</h3>
            <div className="mainptns-form-fields-group">
              <label className="mainptns-form-label-group">
                <div className="mainptns-field-label">{t('ptnsPhoneLabel')}</div>
                <input className="mainptns-field-input" name="riderPhone" required placeholder="010-0000-0000" />
              </label>
              
              <label className="mainptns-form-label-group">
                <div className="mainptns-field-label">{t('ptnsAddressLabel')}</div>
                <input className="mainptns-field-input" name="riderAddress" required placeholder={t('ptnsAddressPlaceholder')} />
              </label>

              <label className="mainptns-form-label-group">
                <div className="mainptns-field-label">{t('ptnsBankNameLabel')}</div>
                <input className="mainptns-field-input" name="bankName" required placeholder={t('ptnsStoreNamePlaceholder')} />
              </label>

              <label className="mainptns-form-label-group">
                <div className="mainptns-field-label">{t('ptnsAccountNumLabel')}</div>
                <input className="mainptns-field-input" name="accountNumber" required placeholder="123-456-7890" />
              </label>

              <div className="mainptns-form-label-group">
                <div className="mainptns-field-label">{t('ptnsLicenseLabel')}</div>
                <div className="mainptns-custom-file-wrapper">
                  <input ref={licenseInputRef} type="file" onChange={changeFiles} name="licenseImage" id="riderLicense" className="mainptns-file-hidden" accept="image/*" required={!licensePreview} />
                  {licensePreview ? (
                    <div className="mainptns-preview-area">
                      <img src={licensePreview} alt="License" className="mainptns-thumb" />
                      <button type="button" className="mainptns-delete-btn" onClick={removeLicensePreview}>
                        <TrashBinBoldShort size={18} />
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="riderLicense" className="mainptns-file-placeholder">{t('ptnsUploadPlaceholder')}</label>
                  )}
                </div>
              </div>

              <div className="mainptns-agreement-group">
                <label className="mainptns-checkbox-label">
                  <input type="checkbox" checked={agreements.terms} onChange={() => {}} onClick={(e) => openModal(e, 'terms')} />
                  <span>{t('ptnsTermsLabel')} <span className="required-star">{t('ptnsRequired')}</span></span>
                </label>
                <label className="mainptns-checkbox-label">
                  <input type="checkbox" checked={agreements.privacy} onChange={() => {}} onClick={(e) => openModal(e, 'privacy')} />
                  <span>{t('ptnsAgreementLabel')} <span className="required-star">{t('ptnsRequired')}</span></span>
                </label>
              </div>

              <button className="mainptns-submit-button" type="submit">{t('ptnsRiderSubmit')}</button>
            </div>
          </form>

          {/* 파트너 제휴 신청 폼 */}
          <form className="mainptns-card-box" onSubmit={onSubmit}>
            <h3 className="mainptns-card-title-text">{t('ptnsFormPartnerTitle')}</h3>
            <div className="mainptns-form-fields-group">
              <div className="mainptns-input-grid-2">
                <label className="mainptns-form-label-group">
                  <div className="mainptns-field-label">{t('ptnsManagerNameLabel')}</div>
                  <input className="mainptns-field-input" name="managerName" required placeholder="Name" />
                </label>
                <label className="mainptns-form-label-group">
                  <div className="mainptns-field-label">{t('ptnsPhoneLabel')}</div>
                  <input className="mainptns-field-input" name="partnerPhone" required placeholder="010-0000-0000" />
                </label>
              </div>

              <div className="mainptns-input-grid-2">
                <label className="mainptns-form-label-group">
                  <div className="mainptns-field-label">{t('ptnsStoreNameKrLabel')}</div>
                  <input className="mainptns-field-input" name="storeNameKr" required placeholder="Korean Name" />
                </label>
                <label className="mainptns-form-label-group">
                  <div className="mainptns-field-label">{t('ptnsStoreNameEnLabel')}</div>
                  <input className="mainptns-field-input" name="storeNameEn" required placeholder="English Name" />
                </label>
              </div>

              <label className="mainptns-form-label-group">
                <div className="mainptns-field-label">{t('ptnsBusinessNumLabel')}</div>
                <input className="mainptns-field-input" name="businessNum" required placeholder="000-00-00000" />
              </label>

              <label className="mainptns-form-label-group">
                <div className="mainptns-field-label">{t('ptnsAddressLabel')}</div>
                <input className="mainptns-field-input" name="storeAddress" required placeholder={t('ptnsAddressPlaceholder')} />
              </label>

              <div className="mainptns-form-label-group">
                <div className="mainptns-field-label">{t('ptnsStoreLogoLabel')}</div>
                <div className="mainptns-custom-file-wrapper">
                  <input ref={logoInputRef} type="file" onChange={changeFiles} name="storeLogo" id="partnerLogo" className="mainptns-file-hidden" accept="image/*" required={!logoPreview} />
                  {logoPreview ? (
                    <div className="mainptns-preview-area">
                      <img src={logoPreview} alt="Logo" className="mainptns-thumb" />
                      <button type="button" className="mainptns-delete-btn" onClick={removeLogoPreview}>
                        <TrashBinBoldShort size={18} />
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="partnerLogo" className="mainptns-file-placeholder">{t('ptnsUploadPlaceholder')}</label>
                  )}
                </div>
              </div>

              <div className="mainptns-agreement-group">
                <label className="mainptns-checkbox-label">
                  <input type="checkbox" checked={agreements.terms} onChange={() => {}} onClick={(e) => openModal(e, 'terms')} />
                  <span>{t('ptnsTermsLabel')} <span className="required-star">{t('ptnsRequired')}</span></span>
                </label>
                <label className="mainptns-checkbox-label">
                  <input type="checkbox" checked={agreements.privacy} onChange={() => {}} onClick={(e) => openModal(e, 'privacy')} />
                  <span>{t('ptnsAgreementLabel')} <span className="required-star">{t('ptnsRequired')}</span></span>
                </label>
              </div>

              <button className="mainptns-submit-button" type="submit">{t('ptnsPartnerSubmit')}</button>
            </div>
          </form>
        </div>
      </div>

      {activeModal && (
        <div className="mainptns-modal-overlay" onClick={closeModal}>
          <div className="mainptns-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="mainptns-modal-header">
              <h3>{modalContent?.title}</h3>
              <button className="mainptns-close-x-btn" onClick={closeModal}>✕</button>
            </div>
            <div className="mainptns-modal-body">
              <div className="mainptns-modal-scroll-area">
                <p className="mainptns-modal-description">{modalContent?.description}</p>
                {modalContent?.articles?.map((art, i) => (
                  <div key={i} className="modal-article">
                    <h4>{art.heading}</h4>
                    <p>{art.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mainptns-modal-footer">
              <button className="btn-cancel" onClick={closeModal}>{t('ptnsModalCancel')}</button>
              <button className="btn-confirm" onClick={confirmModal}>{t('ptnsModalConfirm')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}