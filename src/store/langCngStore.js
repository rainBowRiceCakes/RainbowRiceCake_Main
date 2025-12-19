/**
 * @file src/store/langCngStore.js
 * @description KO/EN 번역 스토어
 * 251219 v1.0.0 sara init 
 */

import { createContext, useContext, useState } from "react";
import { LANG_CNG } from "../lang/langCng.js";

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState("ko"); // 새로고침하면 ko로 초기화

  const t = (key) => LANG_CNG[key]?.[lang] ?? key;

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}