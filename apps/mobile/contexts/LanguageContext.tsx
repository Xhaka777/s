import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { changeLanguage, getCurrentLanguage, getAvailableLanguages } from '../i18n';

interface LanguageContextType {
  currentLanguage: string;
  availableLanguages: Array<{
    code: string;
    name: string;
    flag: string;
  }>;
  changeLanguage: (language: string) => Promise<void>;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [isLoading, setIsLoading] = useState(true);

  const availableLanguages = getAvailableLanguages();

  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // Wait for i18n to be initialized
        if (i18n.isInitialized) {
          setCurrentLanguage(getCurrentLanguage());
          setIsLoading(false);
        } else {
          // Wait for i18n initialization
          i18n.on('initialized', () => {
            setCurrentLanguage(getCurrentLanguage());
            setIsLoading(false);
          });
        }

        // Listen for language changes
        i18n.on('languageChanged', (lng: string) => {
          setCurrentLanguage(lng);
        });
      } catch (error) {
        console.error('Error initializing language:', error);
        setIsLoading(false);
      }
    };

    initializeLanguage();

    // Cleanup
    return () => {
      i18n.off('initialized');
      i18n.off('languageChanged');
    };
  }, [i18n]);

  const handleChangeLanguage = async (language: string) => {
    try {
      setIsLoading(true);
      await changeLanguage(language);
      setCurrentLanguage(language);
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: LanguageContextType = {
    currentLanguage,
    availableLanguages,
    changeLanguage: handleChangeLanguage,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;