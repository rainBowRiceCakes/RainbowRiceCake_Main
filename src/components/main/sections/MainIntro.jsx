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
            <div className="mainIntro-hero-img-wrapper">
              <img
                src="/resource/serviceIntro.png"
                alt="DGD Service"
                className="mainIntro-hero-img"
              />
            </div>

            <div className="mainIntro-hero-top">
              <div className="mainIntro-badge">DGD</div>
            </div>

            <div className="mainIntro-hero-content">
              <div className="mainIntro-hero-eyebrow">{t("introHeroEyebrow")}</div>
              <h2 className="mainIntro-hero-title">{t("introHeroTitle")}</h2>
              <p className="mainIntro-hero-desc">{t("introHeroDesc")}</p>
              <div className="mainIntro-hero-actions">
                <a className="mainIntro-cta mainIntro-cta--primary" href="#plans">
                  {t("introHeroCtaPrimary")}
                </a>
                <a className="mainIntro-cta" href="#mainptnssearch">
                  {t("introHeroCtaSecondary")}
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: CARDS */}
          <aside className="mainIntro-side" aria-label="DGD steps">
            {[1, 2, 3, 4].map((step) => (
              <div className="mainIntro-side-card" key={step}>
                <div className="mainIntro-side-head">
                  <h3 className="mainIntro-side-title">
                    {t(`introCardStep${step}Title`)}
                  </h3>
                  <span className="mainIntro-side-icon">{step}</span>
                </div>
                <p className="mainIntro-side-desc">
                  {t(`introCardStep${step}Desc`)}
                </p>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}