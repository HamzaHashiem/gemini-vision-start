import { useTranslation } from 'react-i18next';

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    try {
      localStorage.setItem('language', language);
    } catch (error) {
      console.warn('Unable to save language to localStorage:', error);
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    changeLanguage(newLang);
  };

  const getCurrentLanguage = () => {
    return i18n.language;
  };

  const getSavedLanguage = () => {
    try {
      return localStorage.getItem('language') || 'en';
    } catch (error) {
      console.warn('localStorage not available, using default language');
      return 'en';
    }
  };

  const isRTL = () => {
    return i18n.language === 'ar';
  };

  return {
    currentLanguage: i18n.language,
    changeLanguage,
    toggleLanguage,
    getCurrentLanguage,
    getSavedLanguage,
    isRTL,
  };
};