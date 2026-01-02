/**
 * @file src/components/common/LanguageToggle.jsx
 * @description 한국어(KO) 및 영어(EN) 전환을 위한 애니메이션 토글 컴포넌트
 * 251229 v1.1.0 sara init
 */

import { useContext } from "react";
import { motion } from "framer-motion";
import { LanguageContext } from "../../context/LanguageContext";

const LanguageToggle = () => {
  const { lang, setLang } = useContext(LanguageContext);
  const isKo = lang === 'ko';

  // 스타일 정의 (전역 변수 활용)
  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      width: '56px',
      height: 'var(--com-gap-xl)', // 30px
      backgroundColor: 'var(--com-color-bg-light)',
      borderRadius: 'var(--com-radius-pill)',
      cursor: 'pointer',
      padding: '3px',
      userSelect: 'none',
      overflow: 'hidden',
      // 핸들 위치를 justify-content로 간단히 제어
      justifyContent: isKo ? 'flex-start' : 'flex-end',
    },
    handle: {
      width: 'var(--com-size-icon)', // 24px
      height: 'var(--com-size-icon)',
      backgroundColor: 'var(--com-color-white)',
      borderRadius: '50%',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
      zIndex: 2,
    },
    text: (isActive, position) => ({
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      left: position === 'left' ? 'var(--com-gap-xs)' : 'auto',
      right: position === 'right' ? 'var(--com-gap-xs)' : 'auto',
      fontSize: '10px',
      fontWeight: 'var(--com-font-weight-heavy)',
      color: isActive ? 'var(--com-font-primary-color)' : 'var(--com-font-muted)',
      transition: 'color 0.3s ease',
      pointerEvents: 'none',
      zIndex: 1,
    })
  };

  return (
    <motion.div 
      style={styles.container}
      onClick={() => setLang(isKo ? 'en' : 'ko')}
      whileHover={{ y: -1, borderColor: 'var(--com-font-muted)' }} // Hover 효과 통합
      transition={{ duration: 0.2 }}
    >
      {/* 배경 KO 텍스트 */}
      <span style={styles.text(isKo, 'left')}>KO</span>

      {/* 배경 EN 텍스트 */}
      <span style={styles.text(!isKo, 'right')}>EN</span>

      {/* 움직이는 핸들 */}
      <motion.div 
        style={styles.handle}
        layout // 이 속성 하나로 핸들 이동 애니메이션 자동 완성
        transition={{ type: "spring", stiffness: 500, damping: 30 }} 
      />
    </motion.div>
  );
};

export default LanguageToggle;