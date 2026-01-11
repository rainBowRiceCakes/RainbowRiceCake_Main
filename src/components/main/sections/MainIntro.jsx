/**
 * @file src/components/main/sections/MainIntro.jsx
 * @description 서비스 인트로 추가 
 * 260110 v1.0.0 sara init
 * 260111 v2.0.0 sara update layout redesign (hero-left + cards-right)
 */

import { useContext } from "react";
import { LanguageContext } from "../../../context/LanguageContext.js";
import "./MainIntro.css";

export default function MainIntro() {
  const { t } = useContext(LanguageContext);

  return (
    <section className="mainIntro-frame mainshow-section-frame" id="intro">
      <div className="mainshow-section-wrapper">
        <div className="mainIntro-layout">

          {/* LEFT: HERO */}
          <div className="mainIntro-hero">
            <div className="mainIntro-hero-top">
              <div className="mainIntro-badge">DGD</div>
            </div>

            <div className="mainIntro-hero-content">
              <div className="mainIntro-hero-eyebrow">{t("introHeroEyebrow")}</div>
              <h2 className="mainIntro-hero-title">{t("introHeroTitle")}</h2>
              <p className="mainIntro-hero-desc">{t("introHeroDesc")}</p>

              <div className="mainIntro-hero-actions">
                <a className="mainIntro-cta mainIntro-cta--primary" href="#download">
                  {t("introHeroCtaPrimary")}
                </a>
                <a className="mainIntro-cta" href="#fee">
                  {t("introHeroCtaSecondary")}
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: CARDS */}
          <aside className="mainIntro-side">
            <div className="mainIntro-side-card">
              <div className="mainIntro-side-head">
                <h3 className="mainIntro-side-title">{t("introCardWhoTitle")}</h3>
                <span className="mainIntro-side-icon">▦</span>
              </div>
              <ul className="mainIntro-side-list">
                <li>{t("introCardWhoItem1")}</li>
                <li>{t("introCardWhoItem2")}</li>
              </ul>
            </div>

            <div className="mainIntro-side-card">
              <div className="mainIntro-side-head">
                <h3 className="mainIntro-side-title">{t("introCardGoalTitle")}</h3>
                <span className="mainIntro-side-icon">◎</span>
              </div>
              <ul className="mainIntro-side-list">
                <li>{t("introCardGoalItem1")}</li>
                <li>{t("introCardGoalItem2")}</li>
              </ul>
            </div>

            <div className="mainIntro-side-card">
              <div className="mainIntro-side-head">
                <h3 className="mainIntro-side-title">{t("introCardFeaturesTitle")}</h3>
                <span className="mainIntro-side-icon">▣</span>
              </div>
              <ul className="mainIntro-side-list">
                <li>{t("introCardFeaturesItem1")}</li>
                <li>{t("introCardFeaturesItem2")}</li>
                <li>{t("introCardFeaturesItem3")}</li>
              </ul>
            </div>

            <div className="mainIntro-side-card">
              <div className="mainIntro-side-head">
                <h3 className="mainIntro-side-title">{t("introCardPainTitle")}</h3>
                <span className="mainIntro-side-icon">!</span>
              </div>
              <ul className="mainIntro-side-list">
                <li>{t("introCardPainItem1")}</li>
                <li>{t("introCardPainItem2")}</li>
              </ul>
            </div>

            <div className="mainIntro-side-foot">
              <a className="mainIntro-miniLink" href="#ptns">{t("introMiniLinkPartners")}</a>
              <span className="mainIntro-miniDot">•</span>
              <a className="mainIntro-miniLink" href="#cs">{t("introMiniLinkSupport")}</a>
            </div>
          </aside>

        </div>
      </div>
    </section>
  );
}