import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../navigation/AuthNavigator";
import { Button, SecUnion, ThirdUnion } from "../../components";
import { useLanguage } from "../../contexts/LanguageContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, CheckSquare, Shield } from "lucide-react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import { useVeriffStatus } from "../../api/hooks/useOnboarding";
import { Veriff } from '@veriff/react-native-sdk';

const ChooseVerify = ({ navigation, route }) => {
    const [isReady, setIsReady] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [veriffSessionId, setVeriffSessionId] = useState(route?.params?.veriffSessionId || null);

    // Poll Veriff status
    const { data: veriffStatus, isLoading: isPolling } = useVeriffStatus(
        veriffSessionId,
        {
            enabled: !!veriffSessionId,
            onSuccess: (data) => {
                if (data.status === 'approved') {
                    Alert.alert(
                        'Verification Successful',
                        'Your identity has been verified successfully!',
                        [
                            {
                                text: 'Continue',
                                onPress: () => navigation.navigate('NextScreen') // Navigate to your next screen
                            }
                        ]
                    );
                } else if (data.status === 'declined') {
                    Alert.alert(
                        'Verification Failed',
                        'Your identity verification was unsuccessful. Please try again or contact support.',
                        [
                            {
                                text: 'Try Again',
                                onPress: () => setVeriffSessionId(null)
                            }
                        ]
                    );
                }
            }
        }
    );

    useEffect(() => {
        if (route?.params?.veriffSessionId) {
            setVeriffSessionId(route.params.veriffSessionId);
        }
    }, [route?.params?.veriffSessionId]);

    const handleBack = () => {
        navigation.goBack();
    };

    const startVeriffVerification = async () => {
        if (!veriffSessionId) {
            Alert.alert('Error', 'No verification session available. Please try again.');
            return;
        }

        try {
            const veriffConfiguration = {
                sessionId: veriffSessionId,
                // Optional configuration
                locale: 'en', // or get from your language context
                theme: 'dark', // to match your app theme
            };

            // Start Veriff verification
            const result = await Veriff.start(veriffConfiguration);
            
            console.log('Veriff verification result:', result);

            // Handle the result
            if (result.status === 'DONE') {
                // Verification completed - poll for final status
                console.log('Verification completed, waiting for final result...');
            } else if (result.status === 'CANCELED') {
                console.log('Verification was canceled by user');
                Alert.alert(
                    'Verification Canceled',
                    'You canceled the verification process. You can try again anytime.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.goBack()
                        }
                    ]
                );
            } else if (result.status === 'ERROR') {
                console.error('Verification error:', result.error);
                Alert.alert(
                    'Verification Error',
                    'There was an error during verification. Please try again.',
                    [
                        {
                            text: 'Try Again',
                            onPress: () => startVeriffVerification()
                        }
                    ]
                );
            }

        } catch (error) {
            console.error('Failed to start Veriff verification:', error);
            Alert.alert(
                'Error',
                'Failed to start verification. Please check your connection and try again.'
            );
        }
    };

    const handleIDPhoto = () => {
        setSelectedOption('id');
        // Start Veriff verification flow
        startVeriffVerification();
    };

    const handleSelfie = () => {
        setSelectedOption('selfie');
        // Start Veriff verification flow (Veriff handles both ID and selfie)
        startVeriffVerification();
    };

    return (
        <View className="flex-1 bg-black">
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
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
                        left: -20,
                        top: 322,
                        width: 524,
                        height: 237,
                        zIndex: 1,
                    }}
                >
                    <ThirdUnion />
                </View>
            </View>
            <SafeAreaView className="flex-1 relative z-10">
                <ScrollView
                    className="flex-1 px-5"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View className="flex-row items-center justify-between pt-5 pb-2.5">
                        <TouchableOpacity
                            className="w-8 h-8 justify-center items-center"
                            onPress={handleBack}
                        >
                            <ArrowLeft size={20} color="#FFFFFF" strokeWidth={1.5} />
                        </TouchableOpacity>
                    </View>
                    
                    <View className="flex-1 justify-center items-center gap-6">
                        <View className="w-full flex-col justify-start items-start gap-6">
                            <View className="w-full flex-col justify-center items-center gap-16">
                                {/* Title and Description */}
                                <View className="w-full flex-col justify-start items-start gap-6">
                                    <View className="w-full flex-col justify-start items-start gap-2.5">
                                        <View className="w-full justify-start items-center gap-2.5">
                                            <Text className="w-full text-white text-2xl font-PoppinsSemiBold leading-8">
                                                Let's verify your identity
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="w-full justify-start">
                                        <Text className="text-sm leading-4">
                                            <Text className="text-gray-400 text-base font-PoppinsMedium">Please submit the following documents to </Text>
                                            <Text className="text-white text-base font-PoppinsMedium">verify your profile</Text>
                                        </Text>
                                    </View>
                                </View>

                                {/* Show verification status if polling */}
                                {isPolling && veriffSessionId && (
                                    <View className="w-full p-4 bg-yellow-900/20 rounded-lg border border-yellow-600">
                                        <Text className="text-yellow-400 text-center font-PoppinsMedium">
                                            Verification in progress...
                                        </Text>
                                        <Text className="text-gray-400 text-center text-sm mt-1">
                                            Status: {veriffStatus?.status || 'Processing'}
                                        </Text>
                                    </View>
                                )}

                                {/* Verification Options */}
                                <View className="w-full flex-col justify-start items-start gap-4">
                                    {/* Take a picture of your ID */}
                                    <TouchableOpacity
                                        className={`w-full p-2.5 bg-[#201E23] rounded-lg border flex-row justify-start items-start gap-5 ${
                                            selectedOption === 'id' ? 'border-primary' : 'border-gray-700'
                                        }`}
                                        onPress={handleIDPhoto}
                                        activeOpacity={0.7}
                                        disabled={!veriffSessionId}
                                    >
                                        <View className="w-10 h-10 relative overflow-hidden justify-center items-center">
                                            <Image
                                                source={require('../../assets/icons/pic_id.png')}
                                                className="w-[32px] h-[32px]"
                                                resizeMode="contain"
                                            />
                                        </View>
                                        <View className="flex-1 flex-col justify-start items-start gap-1">
                                            <Text className="text-white text-lg font-Poppins leading-6">
                                                Take a picture of your ID
                                            </Text>
                                            <Text className="text-gray-400 text-sm font-Poppins leading-4">
                                                To check your personal information
                                            </Text>
                                        </View>
                                    </TouchableOpacity>

                                    {/* Take a selfie of yourself */}
                                    <TouchableOpacity
                                        className={`w-full p-2.5 bg-[#201E23] rounded-lg border flex-row justify-start items-start gap-5 ${
                                            selectedOption === 'selfie' ? 'border-primary' : 'border-gray-700'
                                        }`}
                                        onPress={handleSelfie}
                                        activeOpacity={0.7}
                                        disabled={!veriffSessionId}
                                    >
                                        <View className="w-10 h-10 relative overflow-hidden justify-center items-center">
                                            <Image
                                                source={require('../../assets/icons/face_recognition.png')}
                                                className="w-[32px] h-[32px]"
                                                resizeMode="contain"
                                            />
                                        </View>
                                        <View className="flex-1 flex-col justify-start items-start gap-1">
                                            <Text className="text-white text-lg font-Poppins leading-6">
                                                Take a selfie of yourself
                                            </Text>
                                            <Text className="text-gray-400 text-sm font-Poppins leading-4">
                                                To match your face to your ID photo
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                {/* No session ID warning */}
                                {!veriffSessionId && (
                                    <View className="w-full p-4 bg-red-900/20 rounded-lg border border-red-600">
                                        <Text className="text-red-400 text-center font-PoppinsMedium">
                                            Verification session not available
                                        </Text>
                                        <Text className="text-gray-400 text-center text-sm mt-1">
                                            Please go back and try again
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </ScrollView>
                
                <View className="w-full pb-6 px-5 gap-4">
                    {/* Privacy Notice */}
                    <View className="flex-row justify-start items-start gap-2">
                        <View className="w-6 h-6 relative overflow-hidden justify-center items-center">
                            <Image
                                source={require('../../assets/icons/shield.png')}
                                className="w-[20px] h-[20px]"
                                resizeMode="contain"
                            />
                        </View>
                        <Text className="flex-1 text-white text-base font-Poppins leading-4">
                            We never share this with anyone and it won't be on your profile!
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default ChooseVerify;