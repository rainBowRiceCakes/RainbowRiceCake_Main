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
  { id: 'basic', name: "Basic", price: "5,000", features: ["1 Item Delivery", "Same-day", "QR Registration"] },
  { id: 'standard', name: "Standard", price: "10,000", features: ["3 Items Delivery", "Pre-Check-in", "QR Registration", "Hotel Drop-off"], recommended: true },
  { id: 'premium', name: "Premium", price: "20,000", features: ["5 Items Delivery", "Time Selection", "QR Registration", "Live Tracking"] },
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
            const isActive = selectedPlan === plan.name;

            return (
              <motion.div
                key={plan.id}
                layout // 레이아웃 변화 자동 애니메이션
                className={`maininfo-plan-card ${isActive ? 'is-selected' : ''}`}
                onClick={() => setSelectedPlan(plan.name)}
              >
                {plan.recommended && (
                  <div className="maininfo-recommended-badge">{t('planRecommended')}</div>
                )}
                
                <div className="maininfo-plan-header">
                  <h3 className="maininfo-plan-name">{plan.name}</h3>
                  <p className="maininfo-plan-price">
                    <span className="price-unit">₩</span>{plan.price}
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
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="maininfo-feature-item">
                          <FaCheck className="maininfo-feature-icon" />
                          <span>{feature}</span>
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