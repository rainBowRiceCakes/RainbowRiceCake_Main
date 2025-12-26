
import { useContext } from "react";
import { motion } from "framer-motion";
import { LanguageContext } from "../context/LanguageContext";
import "./useLanguageToggle.css";

// 언어 토글 컴포넌트
const LanguageToggle = () => {
  const { lang, setLang } = useContext(LanguageContext);
  const isKo = lang === 'ko';
  return (
    <div 
      className="lang-toggle-container" 
      onClick={() => setLang(isKo ? 'en' : 'ko')} 
      style={{ justifyContent: isKo ? 'flex-start' : 'flex-end' }}
    >
      <span className={`lang-toggle-text ${isKo ? 'active' : ''}`}>KO</span>
      <span className={`lang-toggle-text ${!isKo ? 'active' : ''}`}>EN</span>
      <motion.div 
        className="lang-toggle-handle" 
        layout 
        transition={{ type: "spring", stiffness: 500, damping: 30 }} 
      />
    </div>
  );
};

export default LanguageToggle;
