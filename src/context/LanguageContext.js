import { createContext, useContext } from 'react';

// 1. Context 객체 생성 및 내보내기
export const LanguageContext = createContext();

// 2. Custom Hook 정의 및 내보내기
export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};