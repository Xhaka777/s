import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Alert,
  Modal,
  FlatList,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Shield, ChevronDown } from 'lucide-react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import Union from '../../components/svg/Union';
import GlowBackground from '../../components/svg/GlowBackground';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';
import { Input, SecUnion, SuccessModal, ThirdUnion } from '../../components';
// import { useCompleteStageOne } from '../../api/hooks/useOnboarding';
import { tokenStorage } from '../../api/services/tokenStorage';
import { LogBox } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { useQueryClient } from '@tanstack/react-query';

//RTK
import { useCompleteOnboardingStageOneMutation } from '../../store';
import { useDispatch } from 'react-redux';


LogBox.ignoreLogs([
  'This method is deprecated (as well as all React Native Firebase namespaced API)',
  'onAuthStateChanged'
]);

// Debug utilities
// const debugFirebaseSetup = () => {
//   try {
//     const auth = getAuth();
//   } catch (error) {
//     //
//   }
// };

const debugPhoneNumber = (countryCode: string, phoneNumber: string) => {
  const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
  const fullNumber = `${countryCode}${cleanPhone}`;
  return fullNumber;
};

type SignUpScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

const SMART_DETECTION_COUNTRIES = [
  { code: '+41', country: 'Switzerland', flag: '🇨🇭', minLength: 9, maxLength: 9 },   // Swiss: +41 XX XXX XX XX
  { code: '+49', country: 'Germany', flag: '🇩🇪', minLength: 10, maxLength: 12 },       // German: +49 XXX XXXXXXX
  { code: '+383', country: 'Kosovo', flag: '🇽🇰', minLength: 8, maxLength: 9 },        // Kosovo: +383 XX XXX XXX
  { code: '+355', country: 'Albania', flag: '🇦🇱', minLength: 8, maxLength: 9 },       // Albania: +355 XX XXX XXX
  { code: '+44', country: 'England/UK', flag: '🇬🇧', minLength: 10, maxLength: 10 },   // UK: +44 XXXX XXXXXX
];

// COUNTRY CODE PICKER - All countries (keep your existing array)
const COUNTRY_CODES = [
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+41', country: 'CH', flag: '🇨🇭' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
  { code: '+31', country: 'NL', flag: '🇳🇱' },
  { code: '+43', country: 'AT', flag: '🇦🇹' },
  { code: '+32', country: 'BE', flag: '🇧🇪' },
  { code: '+383', country: 'XK', flag: '🇽🇰' },
  { code: '+381', country: 'RS', flag: '🇷🇸' },
  { code: '+385', country: 'HR', flag: '🇭🇷' },
  { code: '+355', country: 'AL', flag: '🇦🇱' }, // Albania
  { code: '+386', country: 'SI', flag: '🇸🇮' },
  { code: '+387', country: 'BA', flag: '🇧🇦' },
  { code: '+389', country: 'MK', flag: '🇲🇰' },
  { code: '+382', country: 'ME', flag: '🇲🇪' },
  { code: '+90', country: 'TR', flag: '🇹🇷' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+82', country: 'KR', flag: '🇰🇷' },
  // Add any other countries you want in the picker...
];

// Helper function to detect country code from a phone number
const detectPriorityCountryCode = (phoneNumber: string): { countryCode: string; remainingNumber: string; detected: boolean } => {
  // Remove spaces, dashes, parentheses but keep + and digits
  let cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');

  // If it doesn't start with +, treat as regular phone number
  if (!cleanNumber.startsWith('+')) {
    return { countryCode: '', remainingNumber: cleanNumber, detected: false };
  }

  // Sort by length (longest first) to avoid conflicts (+383 before +38)
  const sortedCodes = [...SMART_DETECTION_COUNTRIES].sort((a, b) => b.code.length - a.code.length);

  for (const country of sortedCodes) {
    if (cleanNumber.startsWith(country.code)) {
      const remaining = cleanNumber.substring(country.code.length);

      console.log(`Checking ${country.country} (${country.code}):`, {
        input: cleanNumber,
        remaining: remaining,
        remainingLength: remaining.length,
        minLength: country.minLength,
        maxLength: country.maxLength
      });

      // Only auto-detect if we have enough digits for validation
      if (remaining.length >= 6) { // At least 6 digits to attempt detection
        // Check if remaining number length makes sense for this country
        if (remaining.length >= country.minLength && remaining.length <= country.maxLength) {
          console.log(`${country.country} detected successfully!`);
          return {
            countryCode: country.code,
            remainingNumber: remaining,
            detected: true
          };
        }
      }
    }
  }

  console.log('No priority country detected');
  return { countryCode: '', remainingNumber: cleanNumber, detected: false };
};


export default function SignUpScreen() {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const queryClient = useQueryClient();
  //
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [apiCallMade, setApiCallMade] = useState(false);

  // Phone verification states
  const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'info' | 'verification'>('info');

  // OTP Input states
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [currentOtpIndex, setCurrentOtpIndex] = useState(0);
  const otpRefs = useRef<(TextInput | null)[]>([]);

  //useCompleteStageOne RTK Query mutation
  const [completeStageOne, { isLoading: isCompletingStageOne }] = useCompleteOnboardingStageOneMutation();

  // Add this after your existing useState declarations
  // const completeStageOne = useCompleteStageOne({
  //   onSuccess: async (response) => {
  //     console.log('Onboarding success:', response);
  //     if (response.success && response.token) {
  //       // Save token securely
  //       await tokenStorage.saveToken(response.token);
  //       console.log('reponse.token', response.token)

  //       //Invalidate the onboarding status query to trigger a refetch
  //       queryClient.invalidateQueries({ queryKey: ['onboarding-status'] });
  //       //
  //       setShowSuccessModal(true);
  //     }
  //   },
  //   onError: (error) => {
  //     console.error('Onboarding error:', error);
  //   },
  // });

  // Debug Firebase setup on component mount
  useEffect(() => {
    // debugFirebaseSetup();
    console.log('SignUpScreen mounted - Ready for real phone verification');
  }, []);

  messaging().requestPermission();

  // Register background handler
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });


  // Listen for authentication state changes
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async (user) => {
      if (user && step === 'verification' && !apiCallMade) {
        try {
          setApiCallMade(true);
          const idToken = await user.getIdToken();
          const verifiedPhone = user.phoneNumber || formatPhoneNumber(countryCode, phoneNumber);

          // ✅ Use RTK Query mutation
          const result = await completeStageOne({
            email: email,
            phone_e164: verifiedPhone,
            preferred_language: 'en',
            firebase_id_token: idToken,
          }).unwrap();

          console.log('Onboarding success:', result);

          if (result.session_token) {
            await tokenStorage.saveToken(result.session_token);
            setShowSuccessModal(true);
          }
        } catch (error) {
          console.error('Error during onboarding:', error);
          setError('Failed to complete registration. Please try again.');
        }
      }
    });
    return subscriber;
  }, [email, phoneNumber, countryCode, step, apiCallMade, completeStageOne]);

  const formatPhoneNumber = (countryCode: string, phoneNumber: string) => {
    const cleanPhoneNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
    const cleanCountryCode = countryCode.startsWith('+') ? countryCode : `+${countryCode}`;
    return `${cleanCountryCode}${cleanPhoneNumber}`;
  };

  const validatePhoneNumber = (fullPhoneNumber: string) => {
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return e164Regex.test(fullPhoneNumber);
  };

  const validateForm = () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return false;
    }

    if (phoneNumber.length < 8) {
      setError('Please enter a valid phone number');
      return false;
    }

    const fullPhoneNumber = formatPhoneNumber(countryCode, phoneNumber);
    if (!validatePhoneNumber(fullPhoneNumber)) {
      setError('Phone number must be in valid international format');
      return false;
    }

    return true;
  };

  const handlePhoneNumberChange = (text: string) => {
    // Allow + character and digits, remove other characters
    const allowedChars = text.replace(/[^\d+]/g, '');

    // If the text starts with + and has sufficient digits, try priority country detection
    if (allowedChars.startsWith('+') && allowedChars.length >= 8) {
      const { countryCode: detectedCode, remainingNumber, detected } = detectPriorityCountryCode(allowedChars);

      if (detected) {
        setCountryCode(detectedCode);
        setPhoneNumber(remainingNumber);
        return;
      }
    }

    // If no + or doesn't start with +, treat as phone number input
    if (!allowedChars.startsWith('+')) {
      setPhoneNumber(allowedChars);
    } else {
      // If starts with + but no country detected, keep as is in phone field
      setPhoneNumber(allowedChars);
    }
  };

  const handleSendVerificationCode = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      const fullPhoneNumber = formatPhoneNumber(countryCode, phoneNumber);

      // ADD DETAILED DEBUGGING
      console.log('=== PHONE VERIFICATION DEBUG ===');
      console.log('Input country code:', countryCode);
      console.log('Input phone number:', phoneNumber);
      console.log('Formatted full number:', fullPhoneNumber);
      console.log('Length check:', fullPhoneNumber.length);
      console.log('Regex test:', /^\+[1-9]\d{1,14}$/.test(fullPhoneNumber));
      console.log('================================');

      // Use the updated Firebase API
      const confirmation = await auth().signInWithPhoneNumber(fullPhoneNumber);

      console.log('Firebase confirmation object:', confirmation);
      console.log('Verification ID:', confirmation.verificationId);

      setConfirm(confirmation);
      setStep('verification');
      setOtpValues(['', '', '', '', '', '']);
      setCurrentOtpIndex(0);

    } catch (error: any) {
      console.error('=== FIREBASE ERROR ===');
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      console.error('====================');

      let errorMessage = 'Failed to send verification code. Please try again.';

      switch (error.code) {
        case 'auth/invalid-phone-number':
          errorMessage = 'Invalid phone number format. Please check your number.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later.';
          break;
        case 'auth/quota-exceeded':
          errorMessage = 'SMS quota exceeded. Please try again later.';
          break;
        case 'auth/missing-phone-number':
          errorMessage = 'Phone number is required.';
          break;
        case 'auth/captcha-check-failed':
          errorMessage = 'reCAPTCHA verification failed. Please try again.';
          break;
        case 'auth/invalid-app-credential':
          errorMessage = 'Invalid app configuration. Please check Firebase setup.';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // OTP Input handlers
  const handleOtpChange = (value: string, index: number) => {
    // Only allow single digit
    if (value.length > 1) {
      value = value.slice(-1);
    }

    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Auto focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
      setCurrentOtpIndex(index + 1);
    }

    // Update verification code
    const otpString = newOtpValues.join('');
    setVerificationCode(otpString);

    // Auto verify if all 6 digits are entered
    if (otpString.length === 6) {
      handleVerifyCode(otpString);
    }
  };

  const handleOtpKeyPress = (key: string, index: number) => {
    if (key === 'Backspace') {
      if (!otpValues[index] && index > 0) {
        // If current input is empty and backspace is pressed, focus previous input
        otpRefs.current[index - 1]?.focus();
        setCurrentOtpIndex(index - 1);

        // Clear the previous input
        const newOtpValues = [...otpValues];
        newOtpValues[index - 1] = '';
        setOtpValues(newOtpValues);
        setVerificationCode(newOtpValues.join(''));
      }
    }
  };

  const handleOtpFocus = (index: number) => {
    setCurrentOtpIndex(index);
  };

  const handleVerifyCode = async (code?: string) => {
    const codeToVerify = code || verificationCode;

    if (!codeToVerify || codeToVerify.length !== 6) {
      setError('Please enter the complete 6-digit verification code');
      return;
    }

    if (!confirm) {
      setError('No verification session found. Please request a new code.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const credential = await confirm.confirm(codeToVerify);

      const user = credential?.user;

      // The onAuthStateChanged listener will handle the rest
      const verifiedPhone = user?.phoneNumber || formatPhoneNumber(countryCode, phoneNumber);
      const idToken = await user?.getIdToken();


      // await completeStageOne.mutateAsync({
      //   email: email,
      //   phone_e164: verifiedPhone,
      //   preferred_language: 'en',
      //   firebase_id_token: idToken,
      // });

      const result = await completeStageOne({
        email: email,
        phone_e164: verifiedPhone,
        preferred_language: 'en',
        firebase_id_token: idToken,
      }).unwrap();

      if (result.session_token) {
        await tokenStorage.saveToken(result.session_token);
        setShowSuccessModal(true);
      }

    } catch (error: any) {
      let errorMessage = 'Invalid verification code. Please try again.';

      switch (error.code) {
        case 'auth/invalid-verification-code':
          errorMessage = 'Invalid verification code. Please check and try again.';
          break;
        case 'auth/code-expired':
          errorMessage = 'Verification code has expired. Please request a new one.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        default:
          if (error.message) {
            errorMessage = error.message;
          }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // const handleVerifyCode = async (code?: string) => {
  //   const codeToVerify = code || verificationCode;

  //   if (!codeToVerify || codeToVerify.length !== 6) {
  //     setError('Please enter the complete 6-digit verification code');
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     setError('');

  //     // Demo: Check if code is "222222"
  //     if (codeToVerify === '222222') {
  //       // Simulate API delay
  //       setTimeout(() => {
  //         setLoading(false);
  //         setShowSuccessModal(true);
  //       }, 1000);
  //     } else {
  //       setLoading(false);
  //       setError('Invalid verification code. Use 222222 for demo.');
  //     }

  //   } catch (error) {
  //     setLoading(false);
  //     setError('Something went wrong. Please try again.');
  //   }
  // };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // navigation.navigate('ProfileSetup'); //now is handled by AuthNavigator
  };

  const handleResendCode = async () => {
    // Reset to info step and resend
    setStep('info');
    setConfirm(null);
    setVerificationCode('');
    setOtpValues(['', '', '', '', '', '']);
    setCurrentOtpIndex(0);
    await handleSendVerificationCode();
  };

  const renderOtpInputs = () => {
    return (
      <View className="flex-row justify-between items-center my-5 px-0">
        {otpValues.map((value, index) => (
          <View key={index} className="relative w-12 h-12">
            <TextInput
              ref={(ref) => {
                otpRefs.current[index] = ref;
              }}
              className="w-12 h-12 p-1 rounded-[100px] border-[#fff] border-l-[0.50px] border-r-[0.50px] border-t-[0.50px] border-b-[3px] bg-transparent text-white text-lg text-center"
              style={{
                borderWidth: 1,
                borderColor: '#FFFFFF',
                backgroundColor: 'transparent',
              }}
              value={value}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, index)}
              onFocus={() => handleOtpFocus(index)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              selectTextOnFocus
              autoFocus={index === 0}
            />
            {currentOtpIndex === index && !value && (
              <View className="absolute left-1/2 top-1/2 w-0.5 h-4 bg-white -ml-0.5 -mt-2" />
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderInfoStep = () => (
    <View className="flex-1">
      <View className="mb-6">
        <Text className="text-xl font-PoppinsBold text-white mb-2.5">Create Account</Text>
        <Text className="text-base text-gray-400 leading-5 font-Poppins">
          Enter your email and phone number to get started with Spooned
        </Text>
      </View>

      <View className="gap-4">
        <View className="gap-4">
          {/* <Text className="text-base font-medium text-white" style={{ fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto' }}>Email Address</Text> */}
          <View className="">
            <Input
              label="Enter your email"
              required
              value={email}
              onChangeText={setEmail}
              error={''}
              autoCapitalize="words"
              autoCorrect={false}
              editable={!loading}
            />
          </View>
        </View>

        <View className="gap-4">
          <Text className="text-base font-PoppinsMedium text-white">Phone Number*</Text>
          <View className="flex-row gap-2.5">
            <TouchableOpacity
              className="w-20 h-12 bg-transparent rounded-full border border-white opacity-70 flex-row items-center px-4 justify-between"
              onPress={() => setShowCountryPicker(true)}
            >
              <Text className="text-sm text-white font-Poppins">{countryCode}</Text>
              <ChevronDown size={16} color="#FFFFFF" />
            </TouchableOpacity>
            <View className="flex-1 h-12 bg-transparent rounded-full border border-white opacity-70 px-4 justify-center">
              <TextInput
                className="text-sm text-white h-full font-Poppins"
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                placeholder="Phone number"
                placeholderTextColor="#666666"
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>
      </View>

      <View className="pt-10 pb-16 gap-4">
        {error ? (
          <View className="bg-red-500/10 p-3 rounded-2 mb-2">
            <Text className="text-red-300 text-sm text-center font-Poppins">{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          className={`h-14 bg-[#B8457B] rounded-full justify-center items-center ${(loading || !email.trim() || !phoneNumber.trim()) ? 'opacity-40' : ''
            }`}
          style={{
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 2,
            elevation: 2,
          }}
          onPress={handleSendVerificationCode}
          disabled={loading || !email.trim() || !phoneNumber.trim()}
        >
          <Text className="text-base font-PoppinsMedium text-white" style={{ fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto' }}>
            {loading ? 'Sending Code...' : 'Send Verification Code'}
          </Text>
        </TouchableOpacity>

        <View className="flex-row items-start gap-2 pt-2">
          <Image
            source={require('../../assets/icons/shield.png')}
            className="w-[20px] h-[20px]"
            resizeMode="contain"
          />
          <Text className="flex-1 text-sm text-white leading-4 font-Poppins">
            We'll send you a verification code to confirm your phone number.
            Standard messaging rates may apply.
          </Text>
        </View>
      </View>
    </View>
  );

  const renderVerificationStep = () => (
    <View className="flex-1">
      <View className="mb-6">
        <Text className="text-xl font-PoppinsMedium text-white mb-2.5">Verification Number</Text>
        <Text className="text-base text-gray-400 leading-5 mb-2 font-Poppins">
          One Time Password (OTP) has been sent via Email to{' '}
          <Text className="text-white font-Poppins">{email}</Text>
        </Text>
        <Text className="text-base text-gray-400 leading-5 font-Poppins">
          Enter the OTP below to verify it.
        </Text>
        <Text className="text-base text-gray-400 leading-5 font-Poppins mt-5">
          Press: 2 2 2 2 2 2
        </Text>
      </View>

      <View className="gap-4">
        {renderOtpInputs()}
      </View>

      <View className="pt-10 pb-16 gap-4">
        {error ? (
          <View className="bg-red-500/10 p-3 rounded-2 mb-2">
            <Text className="text-red-300 text-sm text-center font-Poppins">{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          className={`h-14 bg-[#B8457B] rounded-full justify-center items-center ${(loading || verificationCode.length !== 6) ? 'opacity-40' : ''
            }`}
          style={{
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 2,
            elevation: 2,
          }}
          onPress={() => handleVerifyCode()}
          disabled={loading || verificationCode.length !== 6}
        >
          <Text className="text-base font-PoppinsMedium text-white">
            {loading ? 'Verifying...' : 'Verify Code'}
          </Text>
        </TouchableOpacity>

        <View className="items-center mt-2">
          <Text className="text-sm text-white font-Poppins">
            Didn't Get OTP?{' '}
            <Text className="text-[#B8457B] font-semibold" onPress={handleResendCode}>
              Resend in 0:23
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );

  const renderCountryPicker = () => (
    <Modal
      visible={showCountryPicker}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowCountryPicker(false)}
    >
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-[#1a1a1a] rounded-t-5 max-h-[70%]">
          <View className="flex-row justify-between items-center p-5 border-b border-gray-700">
            <Text className="text-lg font-PoppinsBold text-white">Select Country</Text>
            <TouchableOpacity
              className="w-7.5 h-7.5 justify-center items-center"
              onPress={() => setShowCountryPicker(false)}
            >
              <Text className="text-lg text-white font-Poppins">✕</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={COUNTRY_CODES}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex-row items-center p-4 border-b-0.5 border-gray-700"
                onPress={() => {
                  setCountryCode(item.code);
                  setShowCountryPicker(false);
                }}
              >
                <Text className="text-xl mr-3">{item.flag}</Text>
                <Text className="text-base text-white font-medium w-15">{item.code}</Text>
                <Text className="text-sm text-gray-400 flex-1">{item.country}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <View className='flex-1 bg-black'>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Background Elements */}
      <View className="absolute inset-0 z-0">
        {/* Background gradient */}
        <Svg height="50%" width="100%" className="absolute top-0 left-0">
          <Defs>
            <RadialGradient
              id="pinkGlow"
              cx="0%" cy="10%" r="90%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#99225E" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#000" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#pinkGlow)" />
        </Svg>

        {/* Glow background effect */}
        <View
          className="absolute"
          style={{
            left: -26,           // X position from Figma
            top: -54,            // Y position from Figma  
            width: 524,          // Width from Figma
            height: 237,         // Height from Figma
            transform: [{ rotate: '20deg' }], // No rotation
            zIndex: 1,           // Adjust as needed for layering
          }}
        >
          <ThirdUnion />
        </View>
      </View>

      <SafeAreaView className="flex-1 z-[4]">
        <View className={`h-11 justify-center px-5 ${Platform.OS === 'android' ? 'mt-5' : ''}`}>
          <TouchableOpacity
            className="w-8 h-8 justify-center items-center"
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 pt-10">
              {step === 'info' ? renderInfoStep() : renderVerificationStep()}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {renderCountryPicker()}
      <SuccessModal
        visible={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Thank you"
        message="Code successfully verified!"
        buttonText="Let's Setup your profile"
      />
    </View>
  );
}