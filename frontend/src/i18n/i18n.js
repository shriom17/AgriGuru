import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslations from './locales/en/common.json';
import hiTranslations from './locales/hi/common.json';
import taTranslations from './locales/ta/common.json';
import teTranslations from './locales/te/common.json';
import bnTranslations from './locales/bn/common.json';
import mrTranslations from './locales/mr/common.json';
import guTranslations from './locales/gu/common.json';
import knTranslations from './locales/kn/common.json';
import mlTranslations from './locales/ml/common.json';
import paTranslations from './locales/pa/common.json';

// Language resources
const resources = {
  en: {
    common: enTranslations
  },
  hi: {
    common: hiTranslations
  },
  ta: {
    common: taTranslations
  },
  te: {
    common: teTranslations
  },
  bn: {
    common: bnTranslations
  },
  mr: {
    common: mrTranslations
  },
  gu: {
    common: guTranslations
  },
  kn: {
    common: knTranslations
  },
  ml: {
    common: mlTranslations
  },
  pa: {
    common: paTranslations
  }
};

// Detect browser language or use saved preference
const getBrowserLanguage = () => {
  const savedLang = localStorage.getItem('KisanMitra_language');
  if (savedLang) return savedLang;
  
  const browserLang = navigator.language || navigator.languages[0];
  
  // Map browser language codes to our supported languages
  const langMap = {
    'en': 'en',
    'en-US': 'en',
    'en-IN': 'en',
    'hi': 'hi',
    'hi-IN': 'hi',
    'ta': 'ta',
    'ta-IN': 'ta',
    'te': 'te',
    'te-IN': 'te',
    'bn': 'bn',
    'bn-IN': 'bn',
    'mr': 'mr',
    'mr-IN': 'mr',
    'gu': 'gu',
    'gu-IN': 'gu',
    'kn': 'kn',
    'kn-IN': 'kn',
    'ml': 'ml',
    'ml-IN': 'ml',
    'pa': 'pa',
    'pa-IN': 'pa'
  };
  
  return langMap[browserLang] || langMap[browserLang.split('-')[0]] || 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getBrowserLanguage(),
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // Namespace configuration
    defaultNS: 'common',
    ns: ['common'],
    
    // React specific options
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em']
    },
    
    // Save language preference
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    
    // Missing key handling
    saveMissing: true,
    missingKeyHandler: (lng, ns, key, fallbackValue) => {
      console.warn(`🚨 Missing translation key: ${lng}.${ns}.${key}`);
      return fallbackValue;
    }
  })
  .then(() => {
    console.log('i18n initialized successfully');
    console.log('Available languages:', Object.keys(resources));
    console.log('Current language:', i18n.language);
  });

// Language change handler
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('KisanMitra_language', lng);
  document.documentElement.lang = lng;
  
  // Set RTL for specific languages if needed
  const rtlLanguages = ['ar', 'ur']; // Add RTL languages if you support them
  document.documentElement.dir = rtlLanguages.includes(lng) ? 'rtl' : 'ltr';
});

export default i18n;
