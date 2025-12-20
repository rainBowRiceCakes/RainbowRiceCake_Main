import { createContext, useState, useMemo } from 'react';
import { LANG_CNG } from '../lang/langCng';

// 1. Create Context
const LanguageContext = createContext();

// 2. Create Provider Component
function LanguageProvider({ children }) {
  const [lang, setLang] = useState('ko'); // Default language is Korean

  const t = useMemo(() => {
    return (key) => {
      if (LANG_CNG[key] && LANG_CNG[key][lang]) {
        return LANG_CNG[key][lang];
      }
      // Return the key itself if translation is not found
      return key;
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

export { LanguageContext, LanguageProvider };
