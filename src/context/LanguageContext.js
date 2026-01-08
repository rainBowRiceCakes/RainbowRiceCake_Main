/**
 * @file src/context/LanguageContext.jsx
 * @description 언어(Context) 접근을 위한 기본 컨텍스트와 커스텀 훅 정의 파일
 *
 * - LanguageContext: 번역 함수(t), 현재 언어(lang), 언어 변경 함수(setLang) 등
 *   "언어 관련 값"을 Provider에서 내려주기 위한 컨텍스트 객체
 * - useTranslation(): LanguageContext 값을 안전하게 꺼내 쓰는 커스텀 훅
 *   (Provider 밖에서 사용하면 에러를 던져 개발 단계에서 실수를 빠르게 발견)
 *
 * ⚠️ 이 파일은 "번역 상태 관리(언어 상태, 번역 데이터, Provider 구현)"를 포함하지 않음.
 *    실제 값 제공은 LanguageProvider(별도 파일 또는 상위 컴포넌트)에서 담당.
 *
 * 251219 v1.0.0 sara init
 * 260108 v1.0.1 sara update 주석 설명 추가(공유파일)
 */

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