import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { QueryProvider } from '../providers/query';

export type RootStackParamList = {
  Auth: undefined;
  Onboarding: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const ONBOARDING_COMPLETED_KEY = '@spooned:onboarding_completed';
const AUTH_COMPLETED_KEY = '@spooned:auth_completed';

export default function RootNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkInitialState();

    // Set up a listener for auth state changes
    const interval = setInterval(checkInitialState, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  const checkInitialState = async () => {
    try {
      const [authStatus, onboardingStatus] = await Promise.all([
        AsyncStorage.getItem(AUTH_COMPLETED_KEY),
        AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY),
      ]);

      const newAuthStatus = authStatus === 'true';
      const newOnboardingStatus = onboardingStatus === 'true';

      if (newAuthStatus !== isAuthenticated) {
        setIsAuthenticated(newAuthStatus);
      }
      if (newOnboardingStatus !== hasCompletedOnboarding) {
        setHasCompletedOnboarding(newOnboardingStatus);
      }
    } catch (error) {
      console.error('Error checking initial state:', error);
    } finally {
      if (isLoading) {
        setIsLoading(false);
      }
    }
  };


  return (
    <QueryProvider>

      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          ) : (
            <Stack.Screen name="Main" component={MainNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </QueryProvider>
  );
}

// At the end of RootNavigator.js, add this export
export const useAuthCompletion = () => {
  return {
    completeAuthentication: async () => {
      try {
        await AsyncStorage.setItem(AUTH_COMPLETED_KEY, 'true');
        // The RootNavigator will automatically re-render and show MainNavigator
        return true;
      } catch (error) {
        console.error('Error completing authentication:', error);
        return false;
      }
    }
  };
};


const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
});

// Export the completion function for use in CountrySetupScreen
// export { completeAuthentication };