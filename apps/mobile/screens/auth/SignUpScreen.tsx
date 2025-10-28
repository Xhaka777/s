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
  if (allowedChars.startsWith('+') && allowedChars.length >= 8) {
    const { countryCode: detectedCode, remainingNumber, detected } = detectPriorityCountryCode(allowedChars);
    
    if (detected) {
      console.log('🎯 Auto-setting country code and phone number');
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
      console.log('📞 === ATTEMPTING PHONE VERIFICATION ===');
      console.log('🌍 Full phone number:', fullPhoneNumber);
      
      // Debug the formatted phone number
      debugPhoneNumber(countryCode, phoneNumber);

      // Create confirmation result
      const confirmation = await signInWithPhoneNumber(getAuth(), fullPhoneNumber);
      
      console.log('✅ === SMS SENT SUCCESSFULLY ===');
      console.log('📱 Confirmation result:', !!confirmation);
      console.log('🔗 Verification ID:', confirmation.verificationId);

      setConfirm(confirmation);
      setStep('verification');
      setOtpValues(['', '', '', '', '', '']); // Reset OTP values
      setCurrentOtpIndex(0); // Reset current index

    } catch (error: any) {
      console.error('❌ === PHONE VERIFICATION ERROR ===');
      console.error('Error details:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);

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
        case 'auth/user-disabled':
          errorMessage = 'This phone number has been disabled.';
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

      console.log('🔐 === VERIFYING CODE ===');
      console.log('📟 Code to verify:', codeToVerify);
      console.log('🔗 Confirmation object:', !!confirm);

      const credential = await confirm.confirm(codeToVerify);
      
      console.log('🎉 === VERIFICATION SUCCESS ===');
      console.log('✅ User credential:', !!credential);
      console.log('👤 User:', credential.user?.uid);
      console.log('📱 Phone number verified:', credential.user?.phoneNumber);

      // The onAuthStateChanged listener will handle the rest

    } catch (error: any) {
      console.error('❌ === CODE VERIFICATION ERROR ===');
      console.error('Error details:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);

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

  const renderInfoStep = () => (
    <View style={styles.content}>
      <View style={styles.titleSection}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Enter your email and phone number to get started with Spooned
        </Text>
      </View>

      <View style={styles.formSection}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#666666"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.phoneInputContainer}>
            <TouchableOpacity
              style={styles.countryCodeWrapper}
              onPress={() => setShowCountryPicker(true)}
            >
              <Text style={styles.countryCodeText}>{countryCode}</Text>
              <ChevronDown size={16} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.phoneNumberWrapper}>
              <TextInput
                style={styles.phoneNumberInput}
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

      <View style={styles.bottomSection}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[
            styles.continueButton,
            (loading || !email.trim() || !phoneNumber.trim()) && styles.continueButtonDisabled
          ]}
          onPress={handleSendVerificationCode}
          disabled={loading || !email.trim() || !phoneNumber.trim()}
        >
          <Text style={styles.continueButtonText}>
            {loading ? 'Sending Code...' : 'Send Verification Code'}
          </Text>
        </TouchableOpacity>

        <View style={styles.privacyNotice}>
          <Shield size={16} color="#FFFFFF" />
          <Text style={styles.privacyText}>
            We'll send you a verification code to confirm your phone number. 
            Standard messaging rates may apply.
          </Text>
        </View>
      </View>
    </View>
  );

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
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[
            styles.continueButton,
            (loading || verificationCode.length !== 6) && styles.continueButtonDisabled
          ]}
          onPress={() => handleVerifyCode()}
          disabled={loading || verificationCode.length !== 6}
        >
          <Text style={styles.continueButtonText}>
            {loading ? 'Verifying...' : 'Verify Code'}
          </Text>
        </TouchableOpacity>

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

  const renderCountryPicker = () => (
    <Modal
      visible={showCountryPicker}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowCountryPicker(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Country</Text>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowCountryPicker(false)}
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
                onPress={() => {
                  setCountryCode(item.code);
                  setShowCountryPicker(false);
                }}
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Background Elements */}
      <Svg style={styles.gradient} width="100%" height="100%">
        <Defs>
          <RadialGradient id="grad" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#000000" stopOpacity="1" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="1" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grad)" />
      </Svg>

      <View style={styles.unionContainer}>
        <Union />
      </View>

      <View style={styles.glowContainer}>
        <GlowBackground />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView 
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {step === 'info' ? renderInfoStep() : renderVerificationStep()}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {renderCountryPicker()}
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
    marginBottom: 8,
  },
  subtitleGray: {
    fontSize: 16,
    color: '#999999',
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  emailHighlight: {
    color: '#FFFFFF',
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
});