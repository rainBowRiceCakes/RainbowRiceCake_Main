/**
 * @file src/components/main/sections/MainPTNS.jsx
 * @description 제휴업체 페이지 
 * 251216 v1.0.0 sara init 
 * 251221 v1.1.0 Gemini i18n
 */

import { useContext } from 'react';
import { LanguageContext } from '../../../context/LanguageContext';
import './MainPTNS.css';

export default function MainPTNS() {
  const { t } = useContext(LanguageContext);

  const onSubmit = (e) => {
      e.preventDefault();
      const form = new FormData(e.currentTarget);

      if (!form.get("agree")) {
        alert(t('ptnsAgreeRequiredAlert'));
        return;
      }

      alert(t('ptnsSubmitSuccessAlert'));
      e.currentTarget.reset();
    };

    return (
      <div className="mainptns-frame mainshow-section-frame" id="partners">
        <div className="mainshow-section-wrapper">
          <div className="mainptns-header-group">
            <div>
              <h2 className="mainptns-title-text">{t('ptnsTitle')}</h2>
              <p className="mainptns-desc-text">{t('ptnsDesc')}</p>
            </div>
          </div>

          <div className="mainptns-grid-2">
            
            <form className="mainptns-card-box mainptns-card-box--form" onSubmit={onSubmit}>
              <h3 className="mainptns-card-title-text">{t('ptnsFormTitle')}</h3>

              <div className="mainptns-form-fields-group">
                <label className="mainptns-form-label-group">
                  <div className="mainptns-field-label">{t('ptnsStoreNameLabel')}</div>
                  <input className="mainptns-field-input" name="storeName" required placeholder={t('ptnsStoreNamePlaceholder')} />
                </label>

                <label className="mainptns-form-label-group">
                  <div className="mainptns-field-label">{t('ptnsAddressLabel')}</div>
                  <input className="mainptns-field-input" name="address" required placeholder={t('ptnsAddressPlaceholder')} />
                </label>

                <div className="mainptns-input-grid-2">
                  <label className="mainptns-form-label-group">
                    <div className="mainptns-field-label">{t('ptnsPhoneLabel')}</div>
                    <input
                      className="mainptns-field-input"
                      name="phone"
                      required
                      placeholder={t('ptnsPhonePlaceholder')}
                      pattern="^[0-9\\-+() ]{7,20}$"
                    />
                  </label>
                  <label className="mainptns-form-label-group">
                    <div className="mainptns-field-label">{t('ptnsEmailRequired')}</div>
                    <input className="mainptns-field-input" name="email" type="email" required placeholder={t('dlvsEmailPlaceholder')} />
                  </label>
                </div>

                <label className="mainptns-form-label-group">
                  <div className="mainptns-field-label">{t('ptnsInquiryPurposeLabel')}</div>
                  <textarea
                    name="message"
                    placeholder={t('ptnsInquiryPurposePlaceholder')}
                    className="mainptns-form-textarea"
                  />
                </label>

                <label className="mainptns-agreement-label">
                  <input type="checkbox" name="agree" />
                  <span className="mainptns-agreement-text">
                    {t('ptnsAgreementLabel')}
                  </span>
                </label>

                <button className="mainptns-submit-button mainptns-submit-button--primary" type="submit">
                  {t('ptnsSubmitButton')}
                </button>
              </div>
            </form>

            <div className="mainptns-card-box mainptns-card-box--guide">
              <h3 className="mainptns-card-title-text">{t('ptnsGuideTitle')}</h3>

              <div className="mainptns-note-list-group">
                <div className="mainptns-note-item">
                  <div className="mainptns-note-title-text">{t('ptnsProcessTitle')}</div>
                  <div className="mainptns-note-desc-text">{t('ptnsProcessDesc')}</div>
                </div>
                <div className="mainptns-note-item">
                  <div className="mainptns-note-title-text">{t('ptnsInfoRequiredTitle')}</div>
                  <div className="mainptns-note-desc-text">{t('ptnsInfoRequiredDesc')}</div>
                </div>
                <div className="mainptns-note-item">
                  <div className="mainptns-note-title-text">{t('ptnsAgreementTitle')}</div>
                  <div className="mainptns-note-desc-text">{t('ptnsAgreementDesc')}</div>
                </div>
              </div>

              <div className="mainptns-message-box">
                <div className="mainptns-message-title-text">{t('ptnsReceiptMessageTitle')}</div>
                <div className="mainptns-message-desc-text">
                  {t('ptnsReceiptMessageDesc')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}