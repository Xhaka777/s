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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Shield, ChevronDown } from 'lucide-react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import auth, { FirebaseAuthTypes, getAuth, signInWithPhoneNumber } from '@react-native-firebase/auth';
import Union from '../../components/svg/Union';
import GlowBackground from '../../components/svg/GlowBackground';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';
import { SuccessModal } from '../../components';

// Debug utilities
const debugFirebaseSetup = () => {
  console.log('🔍 === FIREBASE SETUP DEBUG ===');
  try {
    const auth = getAuth();
    console.log('🔐 Auth Instance:', !!auth);
    console.log('👤 Current User:', auth.currentUser?.uid || 'None');
    console.log('📞 Phone Auth Available:', !!auth);
  } catch (error) {
    console.error('❌ Firebase Setup Error:', error);
  }
  console.log('🔍 === END FIREBASE DEBUG ===');
};

const debugPhoneNumber = (countryCode: string, phoneNumber: string) => {
  console.log('📱 === PHONE NUMBER DEBUG ===');
  const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
  const fullNumber = `${countryCode}${cleanPhone}`;
  console.log('🏳️ Country Code:', countryCode);
  console.log('📞 Raw Phone:', phoneNumber);
  console.log('🧹 Cleaned Phone:', cleanPhone);
  console.log('🌍 Full Number:', fullNumber);
  console.log('📏 Total Length:', fullNumber.length);
  console.log('✅ E.164 Valid:', /^\+[1-9]\d{1,14}$/.test(fullNumber));
  console.log('📱 === END PHONE DEBUG ===');
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

      console.log(`🔍 Checking ${country.country} (${country.code}):`, {
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
          console.log(`✅ ${country.country} detected successfully!`);
          return {
            countryCode: country.code,
            remainingNumber: remaining,
            detected: true
          };
        }
      }
    }
  }

  console.log('❌ No priority country detected');
  return { countryCode: '', remainingNumber: cleanNumber, detected: false };
};


export default function SignUpScreen() {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Phone verification states
  const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'info' | 'verification'>('info');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // OTP Input states
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [currentOtpIndex, setCurrentOtpIndex] = useState(0);
  const otpRefs = useRef<(TextInput | null)[]>([]);

  // Debug Firebase setup on component mount
  useEffect(() => {
    debugFirebaseSetup();
    console.log('🚀 SignUpScreen mounted - Ready for real phone verification');
  }, []);

  // Listen for authentication state changes
  useEffect(() => {
    const authInstance = getAuth();
    const subscriber = authInstance.onAuthStateChanged(async (user) => {
      if (user) {
        console.log('🎉 === REAL USER AUTHENTICATION SUCCESS ===');
        console.log('✅ User signed in successfully:', user.uid);
        console.log('📱 Phone number:', user.phoneNumber);
        console.log('📧 Email:', user.email);
        console.log('🕐 Creation time:', user.metadata.creationTime);
        console.log('🔄 Last sign in:', user.metadata.lastSignInTime);

        try {
          // Get the Firebase ID Token for backend authentication
          const idToken = await user.getIdToken();
          const idTokenResult = await user.getIdTokenResult();

          console.log('🔐 === FIREBASE AUTH TOKEN INFO ===');
          console.log('📝 ID Token (send this to backend):', idToken);
          console.log('📊 Token Claims:', idTokenResult.claims);
          console.log('⏰ Token Expiration:', new Date(idTokenResult.expirationTime));
          console.log('🆔 User UID:', user.uid);
          console.log('📞 Verified Phone:', user.phoneNumber);
          console.log('📧 Email:', user.email || 'No email');
          console.log('🔐 === END TOKEN INFO ===');

          // This is what you'll send to your backend
          const authData = {
            idToken: idToken,
            uid: user.uid,
            phoneNumber: user.phoneNumber,
            email: user.email,
            displayName: user.displayName,
            creationTime: user.metadata.creationTime,
            lastSignInTime: user.metadata.lastSignInTime,
          };

          console.log('📤 Auth data to send to backend:', authData);

          // TODO: Send to your backend API
          // await apiService.registerUser(authData);

        } catch (error) {
          console.error('❌ Error getting ID token:', error);
        }

        Alert.alert(
          'Welcome to Spooned!',
          `Your phone number has been verified successfully.\n\nUID: ${user.uid}\nPhone: ${user.phoneNumber}`,
          [
            {
              text: 'Continue',
              onPress: () => {
                // navigation.navigate('Main'); // Uncomment when ready
                console.log('🚀 Ready to navigate to main app');
              }
            }
          ]
        );
      } else {
        console.log('👤 No user signed in');
      }
    });
    return subscriber;
  }, []);

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
    console.log('📱 Phone input changed:', text);

    // Allow + character and digits, remove other characters
    const allowedChars = text.replace(/[^\d+]/g, '');

    // If the text starts with + and has sufficient digits, try priority country detection
    if (allowedChars.startsWith('+') && allowedChars.length >= 9) { // At least +X plus 6 digits
      const detection = detectPriorityCountryCode(allowedChars);

      console.log('🎯 Priority country detection result:', {
        input: allowedChars,
        detected: detection.detected,
        countryCode: detection.countryCode,
        remainingNumber: detection.remainingNumber
      });

      // Only apply auto-detection if we found a priority country
      if (detection.detected && detection.countryCode) {
        console.log(`🎉 Auto-detected priority country: ${detection.countryCode}`);
        setCountryCode(detection.countryCode);
        setPhoneNumber(detection.remainingNumber);
        return; // Exit early, don't set the full text
      }
    }

    // Normal phone number input handling (no auto-detection)
    setPhoneNumber(allowedChars);
    console.log('📝 Phone number set to:', allowedChars);
  };

  // Enhanced country code input handler
  const handleCountryCodeChange = (text: string) => {
    // Ensure it starts with + and only contains digits after that
    let cleanText = text;
    if (!cleanText.startsWith('+')) {
      cleanText = '+' + cleanText.replace(/[^\d]/g, '');
    } else {
      cleanText = '+' + cleanText.substring(1).replace(/[^\d]/g, '');
    }

    // Limit length to reasonable country code length (+1 to +9999)
    if (cleanText.length <= 5) {
      setCountryCode(cleanText);
    }
  };

  const handleSendVerification = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const fullPhoneNumber = debugPhoneNumber(countryCode, phoneNumber);

      console.log('🔍 === PHONE VERIFICATION DEBUG ===');
      console.log('📱 Country Code:', countryCode);
      console.log('📞 Phone Number (input):', phoneNumber);
      console.log('🌍 Full Phone Number:', fullPhoneNumber);
      console.log('✅ E.164 Valid:', validatePhoneNumber(fullPhoneNumber));
      console.log('📏 Length:', fullPhoneNumber.length);
      console.log('🔢 Pattern Check:', /^\+[1-9]\d{1,14}$/.test(fullPhoneNumber));

      if (!validatePhoneNumber(fullPhoneNumber)) {
        throw new Error('Invalid phone number format before sending');
      }

      console.log('📡 Attempting to send SMS to:', fullPhoneNumber);
      console.log('🔥 Firebase Auth Instance:', getAuth().app.name);

      const authInstance = getAuth();
      const confirmation = await signInWithPhoneNumber(authInstance, fullPhoneNumber);

      console.log('✅ === SMS SENT SUCCESSFULLY ===');
      console.log('📨 Confirmation Object:', confirmation);
      console.log('🆔 Verification ID:', confirmation.verificationId);
      console.log('📱 Phone Number in Confirmation:', fullPhoneNumber);
      console.log('⏰ SMS should arrive within 1-2 minutes');
      console.log('📞 Check your phone:', fullPhoneNumber);

      setConfirm(confirmation);
      setStep('verification');

      Alert.alert(
        'Verification Code Sent! 📱',
        `We've sent a verification code to ${fullPhoneNumber}\n\nCheck your SMS messages.\nCode should arrive within 1-2 minutes.`,
        [{ text: 'OK' }]
      );
    } catch (err: any) {
      console.error('❌ === PHONE VERIFICATION ERROR ===');
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      console.error('Full error:', err);

      // More specific error handling
      if (err.code === 'auth/invalid-phone-number') {
        setError(`Invalid phone number format: ${formatPhoneNumber(countryCode, phoneNumber)}`);
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many requests. Please wait before trying again.');
      } else if (err.code === 'auth/quota-exceeded') {
        setError('SMS quota exceeded. Please try again tomorrow.');
      } else if (err.code === 'auth/app-not-authorized') {
        setError('App not authorized. Check Firebase configuration.');
      } else if (err.code === 'auth/missing-app-credential') {
        setError('Missing app credentials. Check Firebase setup.');
      } else if (err.code === 'auth/captcha-check-failed') {
        setError('Captcha verification failed. Please try again.');
      } else if (err.code === 'auth/web-storage-unsupported') {
        setError('Web storage not supported. Please enable cookies.');
      } else {
        setError(`SMS failed: ${err.code || err.message}. Check console for details.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    if (!confirm) {
      setError('No verification session found. Please try again');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔐 === CODE VERIFICATION DEBUG ===');
      console.log('📝 Entered Code:', verificationCode);
      console.log('📏 Code Length:', verificationCode.length);
      console.log('🆔 Verification ID:', confirm.verificationId);
      console.log('⏱️ Attempting verification...');

      const result = await confirm.confirm(verificationCode);

      console.log('✅ === CODE VERIFICATION SUCCESS ===');
      console.log('🎉 Verification Result:', result);
      console.log('👤 User Object:', result.user);
      console.log('📱 Verified Phone:', result.user.phoneNumber);
      console.log('🆔 User UID:', result.user.uid);

    } catch (err: any) {
      console.error('❌ === CODE VERIFICATION ERROR ===');
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      console.error('Full error:', err);
      console.log('🔄 Verification ID used:', confirm.verificationId);
      console.log('📝 Code entered:', verificationCode);

      if (err.code === 'auth/invalid-verification-code') {
        setError(`Invalid verification code: "${verificationCode}". Please check and try again.`);
      } else if (err.code === 'auth/code-expired') {
        setError('Verification code expired. Please request a new one.');
        setStep('info');
        setConfirm(null);
        setVerificationCode('');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many verification attempts. Please try again later.');
      } else {
        setError(`Verification failed: ${err.code || err.message}`);
      }
    } finally {
      setLoading(false);
    }

    setOtpValues(['', '', '', '', '', '']); // Reset OTP values
    setCurrentOtpIndex(0); // Reset current index
  };

  const handleResendCode = async () => {
    setStep('info');
    setConfirm(null);
    setVerificationCode('');
    setError('');
    setOtpValues(['', '', '', '', '', '']);
    setCurrentOtpIndex(0);
    await handleSendVerification();
  };

  const selectCountryCode = (code: string) => {
    setCountryCode(code);
    setShowCountryPicker(false);
    setError('');
  };

  // OTP Input handlers
  const handleOtpChange = (value: string, index: number) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Move to next input if value is entered and not the last input
    if (value && index < otpValues.length - 1) {
      const nextInput = otpRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }

    // Check if OTP is complete and equals "222222"
    const completeOtp = newOtpValues.join('');
    if (completeOtp.length === 6) {
      if (completeOtp === '222222') {
        // Show success modal for test OTP
        setShowSuccessModal(true);
      } else {
        // For real implementation, you would verify with Firebase here
        // For now, we'll just show an error
        setError('Invalid verification code. Use 222222 for testing.');
      }
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

  const renderCountryPicker = () => (
    <Modal
      visible={showCountryPicker}
      transparent
      animationType="slide"
      onRequestClose={() => setShowCountryPicker(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Country Code</Text>
            <TouchableOpacity
              onPress={() => setShowCountryPicker(false)}
              style={styles.modalClose}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={COUNTRY_CODES}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.countryItem}
                onPress={() => selectCountryCode(item.code)}
              >
                <Text style={styles.countryFlag}>{item.flag}</Text>
                <Text style={styles.countryCode}>{item.code}</Text>
                <Text style={styles.countryName}>{item.country}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  const renderInfoStep = () => (
    <>
      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Can we get your information please?</Text>
          <Text style={styles.subtitle}>
            We only use your information to make sure everyone in Spooned is real.
          </Text>
        </View>

        <View style={styles.formSection}>
          {/* Email input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email address*</Text>
            <View style={[styles.inputWrapper, email.length > 0 && styles.inputWrapperActive]}>
              <TextInput
                style={styles.textInput}
                placeholder="your@email.com"
                placeholderTextColor="#666666"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError('');
                }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                editable={!loading}
              />
            </View>
          </View>

          {/* Phone number input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number *</Text>
            <View style={styles.phoneInputContainer}>
              {/* Country code picker */}
              <View style={styles.countryCodeWrapper}>
                <TextInput
                  style={styles.countryCodeText}
                  value={countryCode}
                  onChangeText={handleCountryCodeChange}
                  placeholder="+1"
                  placeholderTextColor="#666666"
                  keyboardType="phone-pad"
                  maxLength={5}
                  editable={!loading}
                />
              </View>

              {/* Phone number input */}
              <View style={styles.phoneNumberWrapper}>
                <TextInput
                  style={styles.phoneNumberInput}
                  placeholder="Your phone number"
                  placeholderTextColor="#666666"
                  value={phoneNumber}
                  onChangeText={handlePhoneNumberChange}
                  keyboardType="phone-pad"
                  editable={!loading}
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.bottomSection}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.continueButton, loading && styles.continueButtonDisabled]}
          onPress={handleSendVerification}
          disabled={loading || !email || !phoneNumber}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            {loading ? 'Sending code...' : 'Send Verification Code'}
          </Text>
        </TouchableOpacity>

        <View style={styles.privacyNotice}>
          <Shield size={24} color="#FFFFFF" />
          <Text style={styles.privacyText}>
            We never share this with anyone and it won't be on your profile!
          </Text>
        </View>
      </View>
    </>
  );

  const renderOtpInputs = () => {
    return (
      <View style={styles.otpContainer}>
        {otpValues.map((value, index) => (
          <View key={index} style={styles.otpInputWrapper}>
            <TextInput
              ref={(ref) => {
                otpRefs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                currentOtpIndex === index && styles.otpInputActive,
                value && styles.otpInputFilled
              ]}
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
              <View style={styles.cursor} />
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderVerificationStep = () => (
    <View style={styles.content}>
      <View style={styles.titleSection}>
        <Text style={styles.title}>Verification Number</Text>
        <Text style={styles.subtitle}>
          One Time Password (OTP) has been sent via Email to{' '}
          <Text style={styles.emailHighlight}>{email}</Text>
        </Text>
        <Text style={styles.subtitleGray}>
          Enter the OTP below to verify it.
        </Text>
      </View>

      <View style={styles.formSection}>
        {renderOtpInputs()}
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.resendSection}>
          <Text style={styles.resendText}>
            Didn't Get OTP?{' '}
            <Text style={styles.resendLink} onPress={handleResendCode}>
              Resend in 0:23
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <Svg height="50%" width="100%" style={styles.gradient}>
        <Defs>
          <RadialGradient
            id="pinkGlow"
            cx="0%" cy="10%" r="90%"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#ff3c8c" stopOpacity="0.5" />
            <Stop offset="100%" stopColor="#000" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#pinkGlow)" />
      </Svg>

      <View style={styles.unionContainer}>
        <Union />
      </View>

      <View style={styles.glowContainer}>
        <GlowBackground width={242} height={218} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              if (step === 'verification') {
                setStep('info');
                setConfirm(null);
                setVerificationCode('');
                setError('');
              } else {
                navigation.goBack();
              }
            }}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color="#FFFFFF" strokeWidth={1.5} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {step === 'info' ? renderInfoStep() : renderVerificationStep()}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {renderCountryPicker()}

      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onContinue={() => {
          setShowSuccessModal(false);
          navigation.navigate('ProfileSetupScreen');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  unionContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
  },
  glowContainer: {
    position: 'absolute',
    top: -66,
    left: -93,
    width: 242,
    height: 218,
    zIndex: 3,
  },
  safeArea: {
    flex: 1,
    zIndex: 4,
  },
  header: {
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: Platform.OS === 'ios' ? 0 : 20,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    paddingTop: 40,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  subtitle: {
    fontSize: 16,
    color: '#999999',
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  formSection: {
    gap: 16,
  },
  inputContainer: {
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  inputWrapper: {
    height: 48,
    backgroundColor: '#000000',
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: '#FFFFFF',
    borderBottomWidth: 3,
    paddingHorizontal: 16,
    justifyContent: 'center',
    position: 'relative',
  },
  inputWrapperActive: {
    borderBottomColor: '#FFFFFF',
  },
  textInput: {
    fontSize: 14,
    color: '#FFFFFF',
    height: '100%',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  countryCodeWrapper: {
    width: 80,
    height: 48,
    backgroundColor: 'transparent',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    opacity: 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  countryCodeText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  phoneNumberWrapper: {
    flex: 1,
    height: 48,
    backgroundColor: 'transparent',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    opacity: 0.7,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  phoneNumberInput: {
    fontSize: 14,
    color: '#FFFFFF',
    height: '100%',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  bottomSection: {
    paddingTop: 40,
    paddingBottom: 64,
    gap: 16,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 99, 99, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  continueButton: {
    height: 56,
    backgroundColor: '#B8457B',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  continueButtonDisabled: {
    opacity: 0.4,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  resendButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendButtonText: {
    fontSize: 14,
    color: '#B8457B',
    textDecorationLine: 'underline',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingTop: 8,
  },
  privacyText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 18,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalClose: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 12,
  },
  countryCode: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    width: 60,
  },
  countryName: {
    fontSize: 14,
    color: '#999',
    flex: 1,
  },
  // Add these to your StyleSheet.create():
  subtitleGray: {
    fontSize: 16,
    color: '#999999',
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  emailHighlight: {
    color: '#FFFFFF',
  },
  // OTP Input Styles
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 0,
  },
  otpInputWrapper: {
    position: 'relative',
    width: 48,
    height: 48,
  },
  otpInput: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: '#FFFFFF',
    borderBottomWidth: 3,
    backgroundColor: '#000000',
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    textAlign: 'center',
    paddingTop: 0,
    paddingBottom: 0,
  },
  otpInputActive: {
    borderBottomColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  otpInputFilled: {
    borderBottomColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  cursor: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 1,
    height: 16,
    backgroundColor: '#FFFFFF',
    marginLeft: -0.5,
    marginTop: -8,
  },
  resendSection: {
    alignItems: 'center',
    marginTop: 8,
  },
  resendText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  resendLink: {
    color: '#B8457B',
    fontWeight: '600',
  },
});