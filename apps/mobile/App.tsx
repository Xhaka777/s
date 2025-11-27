import { StatusBar, useColorScheme } from 'react-native';
// import './global.css';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { RootNavigator } from './navigation';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SplashScreen } from './components';
import './global.css';
import { LanguageProvider } from './contexts/LanguageContext';
import './i18n';

globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;


function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show splash for 2-3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Show splash screen while loading
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LanguageProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <AppContent />
        </LanguageProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  return <RootNavigator />;
}

export default App;