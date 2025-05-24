import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import en from '../translations/en';
import ar from '../translations/ar';

type LanguageContextType = {
  locale: string;
  translations: typeof en;
  setLocale: (locale: string) => void;
};

const translations = { en, ar };

const LanguageContext = createContext<LanguageContextType>({} as LanguageContextType);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [locale, setLocale] = useState(router.locale || 'en');

  useEffect(() => {
    if (router.locale !== locale) {
      router.push(router.pathname, router.asPath, { locale });
    }
  }, [locale, router]);

  return (
    <LanguageContext.Provider
      value={{
        locale,
        translations: translations[locale as keyof typeof translations],
        setLocale,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);