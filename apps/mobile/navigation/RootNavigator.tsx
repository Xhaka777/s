import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { QueryProvider } from '../providers/query';
import { tokenStorage } from '../api/services/tokenStorage';
import { onboardingService } from '../api/services/onboarding';

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
  }, []);

  const checkInitialState = async () => {
    try {
      // Check if we have a valid session token
      const token = await tokenStorage.getToken();

      if (token) {
        try {
          // Verify the session with the backend
          const sessionData = await onboardingService.checkSession(token);

          if (sessionData.authenticated) {
            if (sessionData.onbordingCompleted) {
              // User is authenticated and onboarding is complete
              setIsAuthenticated(true);
              await AsyncStorage.setItem(AUTH_COMPLETED_KEY, 'true');
            } else {
              // User is authenticated but needs to complete onboarding
              setIsAuthenticated(false);
              await AsyncStorage.removeItem(AUTH_COMPLETED_KEY);
            }
          } else {
            // Session is invalid
            setIsAuthenticated(false);
            await AsyncStorage.removeItem(AUTH_COMPLETED_KEY);
            await tokenStorage.clearToken();
          }
        } catch (error) {
          console.error('Session check failed:', error);
          setIsAuthenticated(false);
          await AsyncStorage.removeItem(AUTH_COMPLETED_KEY);
          await tokenStorage.clearToken();
        }
      } else {
        setIsAuthenticated(false);
        await AsyncStorage.removeItem(AUTH_COMPLETED_KEY);
      }
    } catch (error) {
      console.error('Error checking initial state:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };


  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#B8457B' />
      </View>
    )
  }

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