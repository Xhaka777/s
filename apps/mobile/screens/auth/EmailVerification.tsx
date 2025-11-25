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
import { tokenStorage } from '../../api/services/tokenStorage';
import { LogBox } from 'react-native';

type EmailVerificationNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'EmailVerification'>;

const EmailVerification = () => {
    const navigation = useNavigation<EmailVerificationNavigationProp>();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState<'email' | 'verification' | 'password'>('email');

    // Password states
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // OTP states
    const [otpValues, setOtpValues] = useState(['', '', '', '']);
    const [currentOtpIndex, setCurrentOtpIndex] = useState(0);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const otpRefs = useRef<(TextInput | null)[]>([]);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string) => {
        return password.length >= 8;
    };

    const handleVerifyEmail = () => {
        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        setError('');

        // Simulate sending email verification
        setTimeout(() => {
            setLoading(false);
            setStep('verification');
            setOtpValues(['', '', '', '']);
            setCurrentOtpIndex(0);
        }, 2000);
    };

    const handleContinueToPassword = () => {
        if (!password.trim()) {
            setError('Please enter a password');
            return;
        }

        if (!validatePassword(password)) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError('');
        setLoading(true);

        // Simulate account creation
        setTimeout(() => {
            setLoading(false);
            // Navigate to next screen (e.g., ProfileSetup)
            navigation.navigate('UploadPhoto');
        }, 1500);
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
        if (value && index < 3) {
            otpRefs.current[index + 1]?.focus();
            setCurrentOtpIndex(index + 1);
        }

        // Check if code is 1234 for demo
        const otpString = newOtpValues.join('');
        if (otpString === '1234') {
            setIsVerified(true);
            setTimeout(() => {
                setShowSuccessModal(true);
            }, 500);
        } else if (otpString.length === 4) {
            setError('Invalid verification code. Use 1234 for demo.');
            setIsVerified(false);
        } else {
            setError('');
            setIsVerified(false);
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
            }
        }
    };

    const handleOtpFocus = (index: number) => {
        setCurrentOtpIndex(index);
    };

    const handleResendCode = () => {
        setOtpValues(['', '', '', '']);
        setCurrentOtpIndex(0);
        setError('');
        setIsVerified(false);
        // Add resend logic here
        console.log('Resending OTP to:', email);
    };

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        // Move to password step instead of navigating away
        setStep('password');
    };

    const renderOtpInputs = () => {
        return (
            <View className="flex-row items-center my-5" style={{ gap: 16 }}>
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

    const renderEmailStep = () => (
        <View className="flex-1 pt-10">
            {/* Title and Description */}
            <View className="mb-6">
                <Text className="text-xl font-PoppinsBold text-white mb-2.5">
                    Let's verify your email
                </Text>
                <Text className="text-base text-gray-400 leading-5 font-Poppins">
                    We'll send you a verification code to confirm your email address.
                </Text>
            </View>

            {/* Email Input */}
            <View className="gap-4 mb-10">
                <Text className="text-base font-PoppinsMedium text-white">Email address*</Text>
                <View className="h-12 bg-transparent rounded-full border border-white opacity-70 px-4 justify-center">
                    <TextInput
                        className="text-sm text-white h-full font-Poppins"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="sofia.meier@domain.com"
                        placeholderTextColor="#666666"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!loading}
                    />
                </View>
            </View>

            {/* Spacer to push content to bottom */}
            <View className="flex-1" />

            {/* Bottom Section */}
            <View className="pb-16 gap-4">
                {error ? (
                    <View className="bg-red-500/10 p-3 rounded-2 mb-2">
                        <Text className="text-red-300 text-sm text-center font-Poppins">{error}</Text>
                    </View>
                ) : null}

                {/* Verify Email Button */}
                <TouchableOpacity
                    className={`h-14 bg-[#B8457B] rounded-full justify-center items-center ${(loading || !email.trim()) ? 'opacity-40' : ''}`}
                    style={{
                        shadowColor: '#000000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.06,
                        shadowRadius: 2,
                        elevation: 2,
                    }}
                    onPress={handleVerifyEmail}
                    disabled={loading || !email.trim()}
                >
                    <Text className="text-base font-PoppinsMedium text-white">
                        {loading ? 'Sending...' : 'Verify Email'}
                    </Text>
                </TouchableOpacity>

                {/* Privacy Notice */}
                <View className="flex-row items-start gap-2 pt-2">
                    <Image
                        source={require('../../assets/icons/shield.png')}
                        className="w-[20px] h-[20px]"
                        resizeMode="contain"
                    />
                    <Text className="flex-1 text-sm text-white leading-4 font-Poppins">
                        We never share this anyone and it won't be on your profile!
                    </Text>
                </View>
            </View>
        </View>
    );

    const renderVerificationStep = () => (
        <View className="flex-1 pt-10">
            {/* Title and Description */}
            <View className="mb-6">
                <Text className="text-xl font-PoppinsBold text-white mb-2.5">
                    Verification Number
                </Text>
                <Text className="text-base text-gray-400 leading-5 mb-2 font-Poppins">
                    One Time Password (OTP) has been sent via Email to{' '}
                    <Text className="text-white font-Poppins">{email}</Text>
                </Text>
                <Text className="text-base text-gray-400 leading-5 font-Poppins mb-5">
                    Enter the OTP below to verify it.
                </Text>
            </View>

            {/* OTP Input */}
            <View className="gap-2">
                {renderOtpInputs()}
            </View>

            {/* Spacer to push content to bottom */}
            <View className="flex-1" />

            {/* Bottom Section */}
            <View className="pb-16 gap-4">
                {error ? (
                    <View className="bg-red-500/10 p-3 rounded-2 mb-2">
                        <Text className="text-red-300 text-sm text-center font-Poppins">{error}</Text>
                    </View>
                ) : null}

                {/* Resend Code */}
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

    const renderPasswordStep = () => (
        <View className="flex-1 pt-10">
            {/* Title and Description */}
            <View className="mb-6">
                <Text className="text-xl font-PoppinsBold text-white mb-2.5">
                    Let's verify your email
                </Text>
                <Text className="text-base text-gray-400 leading-5 font-Poppins">
                    We'll send you a verification code to confirm your email address.
                </Text>
            </View>

            {/* Password Fields */}
            <View className="gap-6 mb-10">
                {/* Password Input */}
                <View className="gap-4">
                    <Text className="text-base font-PoppinsMedium text-white">Password*</Text>
                    <View className="h-12 bg-transparent rounded-full border border-white opacity-70 px-4 justify-center">
                        <TextInput
                            className="text-sm text-white h-full font-Poppins"
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Min. 8 characters"
                            placeholderTextColor="#666666"
                            secureTextEntry={true}
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!loading}
                        />
                    </View>
                </View>

                {/* Confirm Password Input */}
                <View className="gap-4">
                    <Text className="text-base font-PoppinsMedium text-white">Confirm Password*</Text>
                    <View className="h-12 bg-transparent rounded-full border border-white opacity-70 px-4 justify-center">
                        <TextInput
                            className="text-sm text-white h-full font-Poppins"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Re-enter password"
                            placeholderTextColor="#666666"
                            secureTextEntry={true}
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!loading}
                        />
                    </View>
                </View>
            </View>

            {/* Spacer to push content to bottom */}
            <View className="flex-1" />

            {/* Bottom Section */}
            <View className="pb-16 gap-4">
                {error ? (
                    <View className="bg-red-500/10 p-3 rounded-2 mb-2">
                        <Text className="text-red-300 text-sm text-center font-Poppins">{error}</Text>
                    </View>
                ) : null}

                {/* Continue Button */}
                <TouchableOpacity
                    className={`h-14 bg-[#B8457B] rounded-full justify-center items-center ${(loading || !password.trim() || !confirmPassword.trim()) ? 'opacity-40' : ''}`}
                    style={{
                        shadowColor: '#000000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.06,
                        shadowRadius: 2,
                        elevation: 2,
                    }}
                    onPress={handleContinueToPassword}
                    disabled={loading || !password.trim() || !confirmPassword.trim()}
                >
                    <Text className="text-base font-PoppinsMedium text-white">
                        {loading ? 'Creating Account...' : 'Continue'}
                    </Text>
                </TouchableOpacity>

                {/* Privacy Notice */}
                <View className="flex-row items-start gap-2 pt-2">
                    <Image
                        source={require('../../assets/icons/shield.png')}
                        className="w-[20px] h-[20px]"
                        resizeMode="contain"
                    />
                    <Text className="flex-1 text-sm text-white leading-4 font-Poppins">
                        We never share this anyone and it won't be on your profile!
                    </Text>
                </View>
            </View>
        </View>
    );

    const getCurrentStepContent = () => {
        switch (step) {
            case 'email':
                return renderEmailStep();
            case 'verification':
                return renderVerificationStep();
            case 'password':
                return renderPasswordStep();
            default:
                return renderEmailStep();
        }
    };

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
                {/* Header with back button */}
                <View className={`h-11 justify-center px-5 ${Platform.OS === 'android' ? 'mt-5' : ''}`}>
                    <TouchableOpacity
                        className="w-8 h-8 justify-center items-center"
                        onPress={() => {
                            if (step === 'password') {
                                setStep('verification');
                            } else if (step === 'verification') {
                                setStep('email');
                            } else {
                                navigation.goBack();
                            }
                        }}
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
                        {getCurrentStepContent()}
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>

            <SuccessModal
                visible={showSuccessModal}
                onClose={handleSuccessModalClose}
                title="Thank you"
                message="Code successfully verified!"
                buttonText="Continue"
            />
        </View>
    );
};

export default EmailVerification;