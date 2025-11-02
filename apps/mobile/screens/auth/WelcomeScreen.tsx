import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';
import WelcomeModal from '../../components/WelcomeModal';
import { Button } from '../../components';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

type WelcomeScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

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
            {/* Globe Icon */}
            <View className="w-6 h-6 items-center justify-center">
              <Globe size={20} color="#FFFFFF" />
            </View>
            <Text className="text-white text-lg font-PoppinsMedium">
              {displayLanguage}
            </Text>
            <Text className="text-white text-xl font-light">›</Text>
            {/* Chevron Right */}
          </View>
          {/* <View className="w-6 h-6 items-center justify-center"> */}
          {/* </View> */}
        </TouchableOpacity>

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
          </View>

          {/* Button Section */}
          <View className="w-full gap-4">
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
              onPress={() => navigation.navigate('ProfileSetup')}
              // onPress={() => navigation.navigate('SignUp')}
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