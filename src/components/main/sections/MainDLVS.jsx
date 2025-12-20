/**
 * @file src/components/main/sections/MainDLVS.jsx
 * @description 배송 현황 페이지
 * 251216 v1.0.0 sara init 
 */
import { useState, useContext } from "react";
import './MainDLVS.css';
import { LanguageContext } from '../../../context/LanguageContext';

export default function MainDLVS() {
  const { t } = useContext(LanguageContext);
  const [result, setResult] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const code = (form.get("code") || "").toString().trim();
    const email = (form.get("email") || "").toString().trim();

    if (!code || !email) return;

    // 더미: code === none → 알림 + 초기화
    if (code.toLowerCase() === "none") {
      alert(t('dlvsNoInfo'));
      e.currentTarget.reset();
      setResult(null);
      return;
    }

    setResult({
      code,
      email,
      step: "DELIVERING",
      timeline: [
        { t: t('dlvsTimelineStep1'), d: t('dlvsTimelineStep1Desc') },
        { t: t('dlvsTimelineStep2'), d: t('dlvsTimelineStep2Desc') },
        { t: t('dlvsTimelineStep3'), d: t('dlvsTimelineStep3Desc') },
      ],
    });
  };

  // section -> div, class/id update
  return (
    <div className="maindlvs-frame mainshow-section-frame" id="dlvs">
      <div className="mainshow-section-wrapper">
        
        {/* Header Group (이전 section__head) */}
        <div className="maindlvs-header-group">
          <div>
            <h2 className="maindlvs-title-text">{t('dlvsTitle')}</h2>
            <p className="maindlvs-desc-text">
              {t('dlvsDesc')}
            </p>
          </div>
        </div>

        <div className="maindlvs-grid-2">
          
          {/* 배송 조회 폼 (이전 card + form) */}
          <form className="maindlvs-card-box" onSubmit={onSubmit}>
            <h3 className="maindlvs-card-title-text">{t('dlvsTrackingFormTitle')}</h3>

            <div className="maindlvs-form-fields-group">
              <label className="maindlvs-form-label-group">
                <div className="maindlvs-field-label">{t('dlvsCodeLabel')}</div>
                <input className="maindlvs-field-input" name="code" placeholder={t('dlvsCodePlaceholder')} required />
              </label>

              <label className="maindlvs-form-label-group">
                <div className="maindlvs-field-label">{t('dlvsEmailLabel')}</div>
                <input className="maindlvs-field-input" name="email" type="email" placeholder={t('dlvsEmailPlaceholder')} required />
              </label>

              <button 
                className="maindlvs-submit-button maindlvs-submit-button--primary" 
                type="submit" 
              >
                {t('dlvsTrackButton')}
              </button>

              <div className="maindlvs-note-text" dangerouslySetInnerHTML={{ __html: t('dlvsTestNote') }} />
            </div>
          </form>

          {/* 조회 결과 (이전 card) */}
          <div className="maindlvs-card-box">
            <h3 className="maindlvs-card-title-text">{t('dlvsResultTitle')}</h3>

            {!result ? (
              <div className="maindlvs-result-placeholder">
                {t('dlvsResultPlaceholder')}
              </div>
            ) : (
              <div className="maindlvs-result-content">
                <div className="maindlvs-result-meta-text">{t('dlvsResultCode')} {result.code}</div>
                <div className="maindlvs-result-meta-text">{t('dlvsResultEmail')} {result.email}</div>

                <div className="maindlvs-status-box">
                  <div className="maindlvs-status-title-text">{t('dlvsResultCurrentStatus')} {result.step}</div>
                  <div className="maindlvs-status-desc-text">
                    {t('dlvsStatusFlow')}
                  </div>
                </div>

                <div className="maindlvs-timeline-group">
                  <div className="maindlvs-timeline-title-text">{t('dlvsTimelineTitle')}</div>
                  <div className="maindlvs-timeline-list">
                    {result.timeline.map((x, idx) => (
                      <div key={idx} className="maindlvs-timeline-item">
                        <div className="maindlvs-timeline-step-text">{x.t}</div>
                        <div className="maindlvs-timeline-desc-text">{x.d}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="maindlvs-proof-group">
                  <div className="maindlvs-proof-title-text">{t('dlvsPhotoProofTitle')}</div>
                  <div className="maindlvs-proof-box">{t('dlvsProofPhotoPlaceholder')}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
