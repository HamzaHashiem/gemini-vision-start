import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config";
import i18n from "./i18n/config";

// Function to update document direction and language
const updateDocumentLanguage = (language: string) => {
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = language;
};

// Initialize document direction and language based on saved language
const getSavedLanguage = () => {
  try {
    return localStorage.getItem('language') || 'en';
  } catch (error) {
    console.warn('localStorage not available, using default language');
    return 'en';
  }
};

const savedLang = getSavedLanguage();
updateDocumentLanguage(savedLang);

// Listen for language changes and update document accordingly
i18n.on('languageChanged', (lng) => {
  updateDocumentLanguage(lng);
});

createRoot(document.getElementById("root")!).render(<App />);
