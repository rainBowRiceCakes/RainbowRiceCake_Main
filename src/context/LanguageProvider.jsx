/**
 * @file src/context/LanguageContext.jsx
 * @description KO/EN 번역 스토어 다른 언어 (영어, 중국어 추가 시 확장성을 위해 context 폴더로 따로 관리 )
 * 251219 v1.0.0 sara init 
 */

import { useState, useMemo } from 'react';
import { LANG_CNG } from '../lang/langCng';
import { LanguageContext } from './LanguageContext.js'; // 정의 파일에서 가져오기

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en'); // 기본 언어 설정

  const t = useMemo(() => {
    return (key) => {
      if (LANG_CNG[key] && LANG_CNG[key][lang]) {
        return LANG_CNG[key][lang];
      }
      return key; // 번역이 없으면 키 반환
    };
  }, [lang]);

  const value = useMemo(() => {
    return { lang, setLang, t };
  }, [lang, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}