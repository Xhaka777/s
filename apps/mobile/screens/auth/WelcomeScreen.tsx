import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';
import WelcomeModal from '../../components/WelcomeModal';
import { Button } from '../../components';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe } from 'lucide-react-native';
import { tokenStorage } from '../../api/services/tokenStorage';
import { onboardingService } from '../../api/services/onboarding';
import { biometricService } from '../../service/Biometricservice';

const { width, height } = Dimensions.get('window');

type WelcomeScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometryType, setBiometryType] = useState<string | null>(null);
  const [hasExistingSession, setHasExistingSession] = useState(false);

  // Get current language display info
  const currentLanguageInfo = availableLanguages.find(lang => lang.code === currentLanguage);
  const displayLanguage = currentLanguageInfo?.code.toUpperCase() || 'EN';

  const handleSignIn = () => {
    setShowWelcomeModal(true);
  };

  const handleModalClose = () => {
    setShowWelcomeModal(false);
  };

  const handleModalContinue = () => {
    setShowWelcomeModal(false);
    navigation.navigate('SignIn');
  };

  const handleLanguagePress = async () => {
    // Toggle between English and German
    const newLanguage = currentLanguage === 'en' ? 'de' : 'en';
    try {
      await changeLanguage(newLanguage);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const handleTermsPress = () => {
    // Navigate to Terms and Conditions screen
    navigation.navigate('TermsAndConditions');
    console.log('Terms pressed');
  };

  const handlePrivacyPress = () => {
    // Navigate to Privacy Policy screen
    console.log('Privacy Policy pressed');
  };

  // Face ID Authentication Handler
  const handleFaceIDAuthentication = async () => {
    if (!biometricAvailable) {
      Alert.alert(
        'Face ID Not Available',
        'Face ID is not available on this device. Please use the sign-in button.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsAuthenticating(true);

    try {
      const biometryDisplayName = biometricService.getBiometryDisplayName(biometryType);
      const result = await biometricService.authenticate(
        `Authenticate with ${biometryDisplayName} to access your account`
      );

      if (result.success) {
        // Authentication successful - proceed with session check
        console.log('Face ID authentication successful');
        await proceedWithAuthentication();
      } else {
        // Authentication failed
        if (result.error) {
          biometricService.handleAuthenticationError(result.error);
        }
      }
    } catch (error) {
      console.error('Face ID authentication error:', error);
      Alert.alert(
        'Authentication Error',
        'An error occurred during authentication. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsAuthenticating(false);
    }
  };

  const proceedWithAuthentication = async () => {
    try {
      const storedToken = await tokenStorage.getToken();

      if (storedToken) {
        const sessionResponse = await onboardingService.checkSession(storedToken);

        if (sessionResponse.authenticated) {
          if (sessionResponse.onbordingCompleted) {
            console.log('User authenticated & onboarding complete - proceeding to main app');
            // Navigate to main app here
            // navigation.navigate('MainApp');
          } else {
            const currentStep = sessionResponse.onboarding?.details?.currentStep;
            console.log('User authenticated but onboarding incomplete:', currentStep);
            // Navigate to appropriate onboarding step
            // navigation.navigate(currentStep);
          }
        } else {
          console.log('Invalid session, showing sign-in options');
          setShowWelcomeModal(true);
        }
      } else {
        console.log('No stored session, showing sign-in options');
        setShowWelcomeModal(true);
      }
    } catch (error) {
      console.log('Session check error:', error);
      await tokenStorage.clearToken();
      Alert.alert(
        'Session Error',
        'There was an issue checking your session. Please sign in again.',
        [{ text: 'OK' }]
      );
    }
  };

  const checkBiometricAvailability = async () => {
    try {
      const availability = await biometricService.checkBiometricAvailability();
      setBiometricAvailable(availability.available);
      setBiometryType(availability.biometryType);

      console.log('Biometric check result:', availability);
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      setBiometricAvailable(false);
      setBiometryType(null);
    }
  };

  const checkUserSession = async () => {
    try {
      const storedToken = await tokenStorage.getToken();
      setHasExistingSession(!!storedToken);

      if (storedToken) {
        const sessionResponse = await onboardingService.checkSession(storedToken);

        if (sessionResponse.authenticated) {
          if (sessionResponse.onbordingCompleted) {
            console.log('User authenticated & onboarding complete');
            // If user has a valid session and biometrics are available, show Face ID prompt automatically
            if (biometricAvailable) {
              // Small delay to ensure UI is ready
              setTimeout(() => {
                handleFaceIDAuthentication();
              }, 1000);
            }
          } else {
            const currentStep = sessionResponse.onboarding?.details?.currentStep;
            // Navigation logic for onboarding steps
          }
        } else {
          console.log('No stored session, showing welcome screen');
          await tokenStorage.clearToken();
          setHasExistingSession(false);
        }
      }
    } catch (error) {
      console.log('Session check error:', error);
      await tokenStorage.clearToken();
      setHasExistingSession(false);
    }
  };

  useEffect(() => {
    // Check biometric availability first, then check user session
    const initializeScreen = async () => {
      await checkBiometricAvailability();
      await checkUserSession();
    };

    initializeScreen();
  }, []);

  // Auto-trigger Face ID if user has existing session and biometrics are available
  useEffect(() => {
    if (biometricAvailable && hasExistingSession && !isAuthenticating) {
      // Auto-trigger after a short delay when both conditions are met
      const timer = setTimeout(() => {
        handleFaceIDAuthentication();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [biometricAvailable, hasExistingSession]);

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      <ImageBackground
        source={require('../../assets/images/main-welcome.jpg')}
        className="flex-1 w-full h-full"
        resizeMode="cover"
      >
        {/* Overlay */}
        <View className="absolute inset-0 bg-black/30" />

        {/* Language Button */}
        <TouchableOpacity
          className="absolute z-10 bg-black/30 border border-white/30 rounded-full flex-row items-center justify-between px-5 py-3"
          style={{
            top: 60,
            left: width * 0.5 - 75,
            width: 120,
            height: 50,
          }}
          onPress={handleLanguagePress}
          activeOpacity={0.8}
        >
          <View className="flex-row items-center gap-3">
            <View className="w-6 h-6 items-center justify-center">
              <Globe size={20} color="#FFFFFF" />
            </View>
            <Text className="text-white text-lg font-PoppinsMedium">
              {displayLanguage}
            </Text>
            <Text className="text-white text-xl font-light">›</Text>
          </View>
        </TouchableOpacity>

        {/* Face ID Button - Show when biometrics are available */}
        {biometricAvailable && (
          <TouchableOpacity
            className="absolute z-10 bg-black/30 border border-white/30 rounded-full items-center justify-center"
            style={{
              top: 60,
              right: 20,
              width: 50,
              height: 50,
            }}
            onPress={handleFaceIDAuthentication}
            disabled={isAuthenticating}
            activeOpacity={0.8}
          >
            {isAuthenticating ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text className="text-white text-lg">
                {biometryType === 'FaceID' ? '🔐' : '👆'}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {/* Main Content */}
        <View
          className="flex-1 justify-between px-6"
          style={{
            paddingTop: height * 0.45,
            paddingBottom: 60,
          }}
        >
          {/* Logo Section */}
          <View className="items-center mb-10">
            <Image
              source={require('../../assets/images/spooned.png')}
              className="mb-4"
              style={{
                width: width * 0.7,
                height: 100,
              }}
              resizeMode="contain"
            />
            <Text className="text-xl font-Poppins text-white text-center tracking-wider">
              {t('welcome.tagline')}
            </Text>

            {/* Biometric Status Indicator */}
            {biometricAvailable && hasExistingSession && (
              <Text className="text-sm text-white/80 text-center mt-2">
                {isAuthenticating
                  ? `Authenticating with ${biometricService.getBiometryDisplayName(biometryType)}...`
                  : `Tap the ${biometryType === 'FaceID' ? 'Face ID' : 'biometric'} icon to authenticate`
                }
              </Text>
            )}
          </View>

          {/* Button Section */}
          <View className="w-full gap-4">
            {/* Face ID Quick Access Button - Show prominently if available and user has session */}
            {biometricAvailable && hasExistingSession && (
              <Button
                title={`Continue with ${biometricService.getBiometryDisplayName(biometryType)}`}
                onPress={handleFaceIDAuthentication}
                variant="primary"
                disabled={isAuthenticating}
                style={{
                  shadowColor: '#3B82F6',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                  opacity: isAuthenticating ? 0.7 : 1,
                }}
              />
            )}

            {/* Sign In Button */}
            <Button
              title={t('welcome.signIn')}
              onPress={handleSignIn}
              variant="primary"
              style={{
                shadowColor: '#B8457B',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            />

            {/* Create Account Button */}
            <Button
              title={t('welcome.createAccount')}
              // onPress={() => navigation.navigate('SignUp')}
              onPress={() => navigation.navigate('WelcomePsychological')}
              variant="secondary"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 8,
              }}
            />

            {/* Terms and Privacy Section */}
            <View className="mt-2 items-center">
              <Text className="text-sm text-white text-center leading-5">
                {t('welcome.terms', { terms: '' })}
                <TouchableOpacity onPress={handleTermsPress} activeOpacity={0.8}>
                  <Text className="font-PoppinsMedium underline text-white text-sm">
                    {t('welcome.termsLink')}
                  </Text>
                </TouchableOpacity>
              </Text>
              <Text className="text-sm text-white text-center leading-5">
                {t('welcome.privacyPolicy', { privacyPolicy: '' })}
                <TouchableOpacity onPress={handlePrivacyPress} activeOpacity={0.8}>
                  <Text className="font-PoppinsMedium underline text-white text-sm">
                    {t('welcome.privacyPolicyLink')}
                  </Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      {/* Welcome Modal */}
      <WelcomeModal
        visible={showWelcomeModal}
        onClose={handleModalClose}
        onContinue={handleModalContinue}
      />
    </View>
  );
}