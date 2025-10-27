import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';

// Import translation files
import en from './locales/en.json';
import de from './locales/de.json';

const LANGUAGE_DETECTOR = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      // First, try to get saved language from AsyncStorage
      const savedLanguage = await AsyncStorage.getItem('@spooned:language');
      if (savedLanguage) {
        callback(savedLanguage);
        return;
      }

      // If no saved language, get device language
      const deviceLanguage = RNLocalize.getLocales()[0]?.languageCode;
      
      // Check if device language is supported, otherwise default to English
      const supportedLanguage = ['en', 'de'].includes(deviceLanguage) ? deviceLanguage : 'en';
      callback(supportedLanguage);
    } catch (error) {
      console.error('Error detecting language:', error);
      callback('en'); // Default to English on error
    }
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    try {
      await AsyncStorage.setItem('@spooned:language', lng);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  },
};

i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: {
        translation: en,
      },
      de: {
        translation: de,
      },
    },
    fallbackLng: 'en',
    debug: __DEV__,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;

// Helper function to change language
export const changeLanguage = async (language: string) => {
  try {
    await i18n.changeLanguage(language);
    await AsyncStorage.setItem('@spooned:language', language);
  } catch (error) {
    console.error('Error changing language:', error);
  }
};

// Helper function to get current language
export const getCurrentLanguage = () => i18n.language;

// Helper function to get available languages
export const getAvailableLanguages = () => [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];