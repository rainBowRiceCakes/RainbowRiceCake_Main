/**
 * @file src/components/main/sections/MainInfo.jsx
 * @description 이미지 스타일을 반영한 플랜 선택 UI (모바일 가로 배열 최적화)
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import './MainInfo.css';
import { useTranslation } from '../../../context/LanguageContext'; //
import { FaCheck } from "react-icons/fa6";

const plansStructure = [
  { id: 'basic', nameKey: "planNameBasic", priceKey: "planPriceBasic", featureKeys: ["planFeature1ItemDelivery", "planFeatureSameDay", "planFeatureQRRegistration"] },
  { id: 'standard', nameKey: "planNameStandard", priceKey: "planPriceStandard", featureKeys: ["planFeature1ItemDelivery", "planFeatureSameDay", "planFeatureQRRegistration"], recommended: true },
  { id: 'premium', nameKey: "planNamePremium", priceKey: "planPricePremium", featureKeys: ["planFeature1ItemDelivery", "planFeatureSameDay", "planFeatureQRRegistration"] },
];

export default function MainInfo() {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState('Standard');
  const [isMobile, setIsMobile] = useState(false);

  // 화면 크기 감지 (모바일 여부 확인)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="mainshow-section-wrapper main-section-padding">
        <div className="maininfo-header-group">
          <h2 className="maininfo-title-text">{t('planTitle')}</h2>
        </div>

        <div className="maininfo-plans-container">
          {plansStructure.map((plan) => {
            const isActive = selectedPlan === t(plan.nameKey);

            return (
              <motion.div
                key={plan.id}
                layout // 레이아웃 변화 자동 애니메이션
                className={`maininfo-plan-card ${isActive ? 'is-selected' : ''}`}
                onClick={() => setSelectedPlan(t(plan.nameKey))}
              >
                {plan.recommended && (
                  <div className="maininfo-recommended-badge">{t('planRecommended')}</div>
                )}
                
                <div className="maininfo-plan-header">
                  <h3 className="maininfo-plan-name">{t(plan.nameKey)}</h3>
                  <p className="maininfo-plan-price">
                    <span className="price-unit">{t('currencyUnit')}</span>{t(plan.priceKey)}
                  </p>
                </div>

                {/* ✅ 모바일일 때는 선택된 카드만 리스트 노출, 웹은 항상 노출 */}
                <AnimatePresence>
                  {(!isMobile || isActive) && (
                    <motion.ul 
                      className="maininfo-features-list"
                      initial={isMobile ? { height: 0, opacity: 0 } : false}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {plan.featureKeys.map((featureKey, idx) => (
                        <li key={idx} className="maininfo-feature-item">
                          <FaCheck className="maininfo-feature-icon" />
                          <span>{t(featureKey)}</span>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>

                <button className={`maininfo-plan-button ${isActive ? 'active' : ''}`}>
                  {isActive ? t('planSelected') : t('planSelect')}
                </button>
              </motion.div>
            );
          })}
        </div>
    </div>
  );
}