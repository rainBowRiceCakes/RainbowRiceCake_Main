/**
 * @file src/components/main/sections/MainCS.jsx
 * @description 고객센터 페이지 (CustomerCenter.jsx 내용 통합)
 * 251216 v1.0.0 sara init 
 * 251221 v1.1.0 Gemini i18n
 */

import { useState, useContext } from "react";
import './MainCS.css';
import { LanguageContext } from "../../../context/LanguageContext";

export default function MainCS() {
  const { t } = useContext(LanguageContext);
  const [open, setOpen] = useState(-1); // FAQ 열림 상태

  const FAQ_DATA = [
    { q: t('csFaq1Question'), a: t('csFaq1Answer') },
    { q: t('csFaq2Question'), a: t('csFaq2Answer') },
    { q: t('csFaq3Question'), a: t('csFaq3Answer') },
  ];

  const onEmail = () => {
    window.location.href = `mailto:support@brand.com?subject=${t('csInquirySubject')}`;
  };

  const onCallback = (e) => {
    e.preventDefault();
    alert(t('csEmailCallbackAlert'));
    e.currentTarget.reset();
  };
  
  return (
    <div className="maincs-frame mainshow-section-frame" id="cs">
        <div className="mainshow-section-wrapper">
          <div className="maincs-header-group">
            <div>
              <h2 className="maincs-title-text">{t('csTitle')}</h2>
              <p className="maincs-subtitle-text">{t('csDesc')}</p>
            </div>

            <div className="maincs-actions-group">
              <button className="maincs-button maincs-button--primary" type="button" onClick={onEmail}>
                {t('csEmailInquiryButton')}
              </button>
            </div>
          </div>

          <div className="maincs-grid-2">
            
            <div className="maincs-card-box maincs-card-box--faq">
              <h3 className="maincs-card-title-text">{t('csFaqTitle')}</h3>

              <div className="maincs-faq-list-group">
                {FAQ_DATA.map((x, idx) => (
                  <div key={idx} className="maincs-faq-item">
                    <button
                      type="button"
                      onClick={() => setOpen(idx === open ? -1 : idx)}
                      className="maincs-faq-button"
                    >
                      {x.q}
                    </button>

                    {open === idx && (
                      <div className="maincs-faq-body-text">
                        {x.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="maincs-info-box">
                <div className="maincs-info-title-text">{t('csOperatingHoursTitle')}</div>
                <div className="maincs-info-desc-text">{t('csOperatingHoursTime')}</div>
                <div className="maincs-info-desc-text">
                  {t('csOperatingHoursNote')}
                </div>
              </div>
            </div>

            <div className="maincs-card-box maincs-card-box--callback">
              <h3 className="maincs-card-title-text">{t('csChatbotTitle')}</h3>
              <p className="maincs-card-desc-text">
                {t('csChatbotDesc')}
              </p>

              <div className="maincs-chat-actions-group">
                <button className="maincs-button maincs-button--primary" type="button" onClick={() => alert(t('csChatbotAlert'))}>
                  {t('csChatbotStartButton')}
                </button>
                <button className="maincs-button" type="button" onClick={onEmail}>
                  {t('csSwitchToEmailButton')}
                </button>
              </div>

              <div className="maincs-callback-area">
                <h4 className="maincs-callback-title-text">{t('csEmailCallbackTitle')}</h4>
                <p className="maincs-callback-desc-text">
                  {t('csEmailCallbackDesc')}
                </p>

                <form onSubmit={onCallback} className="maincs-callback-form">
                  <label className="maincs-form-label-group">
                    <div className="maincs-field-label">{t('csEmailRequired')}</div>
                    <input className="maincs-field-input" type="email" name="email" required placeholder={t('dlvsEmailPlaceholder')} />
                  </label>

                  <label className="maincs-form-label-group">
                    <div className="maincs-field-label">{t('csInquirySummaryOptional')}</div>
                    <input className="maincs-field-input" name="summary" placeholder={t('csInquirySummaryPlaceholder')} />
                  </label>

                  <button className="maincs-button maincs-button--primary" type="submit" style={{ height: 44, borderRadius: 12 }}>
                    {t('csSubmitButton')}
                  </button>

                  <div className="maincs-form-note-text">
                    {t('csSubmitSuccessNote')}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}