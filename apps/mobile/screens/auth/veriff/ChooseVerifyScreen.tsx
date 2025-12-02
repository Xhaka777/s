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
import type { AuthStackParamList } from "../../../navigation/AuthNavigator";
import { Button, SecUnion, ThirdUnion } from "../../../components";
import { useLanguage } from "../../../contexts/LanguageContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, CheckSquare, Shield } from "lucide-react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import { useVeriffStatus } from "../../../api/hooks/useOnboarding";
import { WebView } from 'react-native-webview';
import { useQueryClient } from "@tanstack/react-query";

const ChooseVerify = ({ navigation, route }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [veriffSessionId, setVeriffSessionId] = useState(route?.params?.veriffSessionId || null);
    const [veriffUrl, setVeriffUrl] = useState(route?.params?.veriffUrl || null);
    const [showWebView, setShowWebView] = useState(false);
    const queryClient = useQueryClient();

    console.log('📝 Received session ID from route:', veriffSessionId);
    console.log('📝 Received verification URL from route:', veriffUrl);

    const handleBack = () => {
        if (showWebView) {
            setShowWebView(false);
        } else {
            navigation.goBack();
        }
    };

    const startVeriffVerification = async () => {
        if (!veriffSessionId) {
            Alert.alert(
                'No Session Available',
                'Please go back and try again to create a verification session.',
                [
                    {
                        text: 'Go Back',
                        onPress: () => navigation.goBack()
                    }
                ]
            );
            return;
        }

        try {
            console.log('🚀 Starting verification with session:', veriffSessionId);

            // Add a small delay to ensure everything is ready
            setTimeout(() => {
                setShowWebView(true);
            }, 500);

        } catch (error) {
            console.error('Failed to start verification:', error);
            Alert.alert('Error', 'Failed to start verification. Please try again.');
        }
    };

    const handleIDPhoto = () => {
        setSelectedOption('id');
        startVeriffVerification();
    };

    const handleSelfie = () => {
        setSelectedOption('selfie');
        startVeriffVerification();
    };

    const handleWebViewNavigationStateChange = (navState) => {
        console.log('🌐 WebView navigation:', navState.url);

        if (navState.url.includes('success') || navState.url.includes('complete')) {
            console.log('✅ Verification completed');
            setShowWebView(false);

            queryClient.invalidateQueries({ queryKey: ['onboarding-status'] });

            navigation.navigate('VerifiedSuccess');
        }
        else if (navState.url.includes('cancel') || navState.url.includes('error')) {
            console.log('❌ Verification canceled/error');
            setShowWebView(false);
            Alert.alert(
                'Verification Canceled',
                'Verification was canceled or failed. Please try again.',
                [{ text: 'OK' }]
            );
        }
        else if (navState.url.includes('expired') || navState.url.includes('old')) {
            console.log('⏰ Session expired');
            setShowWebView(false);
            Alert.alert(
                'Session Expired',
                'The verification session has expired. This appears to be a configuration issue. Please contact support.',
                [
                    {
                        text: 'Go Back',
                        onPress: () => navigation.goBack()
                    }
                ]
            );
        }
        // Check for immediate failures (loads but shows error page)
        else if (navState.loading === false && navState.url.includes('magic.veriff.me')) {
            // If page finished loading but we're still on the same URL after 3 seconds, it might be showing an error
            setTimeout(() => {
                if (navState.url === `https://magic.veriff.me/v/${veriffSessionId}`) {
                    console.log('⚠️ Veriff page loaded but may be showing error');
                    Alert.alert(
                        'Verification Issue',
                        'There seems to be an issue with the verification service. This may be a backend configuration problem.',
                        [
                            {
                                text: 'Try Again',
                                onPress: () => {
                                    setShowWebView(false);
                                    // Small delay then try again
                                    setTimeout(() => startVeriffVerification(), 1000);
                                }
                            },
                            {
                                text: 'Go Back',
                                style: 'cancel',
                                onPress: () => navigation.goBack()
                            }
                        ]
                    );
                }
            }, 3000);
        }
    };

    const handleWebViewMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log('📱 WebView message:', data);

            if (data.status === 'DONE') {
                setShowWebView(false);

                queryClient.invalidateQueries({ queryKey: ['onboarding-status'] })

                navigation.navigate('VerifiedSuccess');
            } else if (data.status === 'CANCELED') {
                setShowWebView(false);
            }
        } catch (error) {
            console.log('WebView message parse error:', error);
        }
    };

    // WebView Screen
    if (showWebView && veriffSessionId) {
        return (
            <View style={{ flex: 1, backgroundColor: '#000' }}>
                <StatusBar barStyle="light-content" backgroundColor="#000000" />
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
                        <TouchableOpacity onPress={handleBack} style={{ padding: 10 }}>
                            <ArrowLeft size={20} color="#FFFFFF" strokeWidth={1.5} />
                        </TouchableOpacity>
                        <Text style={{ color: 'white', fontSize: 18, marginLeft: 10 }}>
                            Identity Verification
                        </Text>
                    </View>

                    <WebView
                        source={{ uri: veriffUrl || `https://alchemy.veriff.com/v/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjQzNTE0NjEsInNlc3Npb25faWQiOiJiMDUxNjk3Ny01MjQ3LTQ1ODItYjQ0Ny1mMzIwMTc4MDY0NGUiLCJpaWQiOiJhM2ViOTdiNy1mZDViLTRiN2UtODAyNi1iZjI0ZGE2MzcyN2QiLCJ2aWQiOiJiZWIxM2I2ZC04ZWQzLTQ0MmUtODMzMy00NDJlZmUxZTNiNWMiLCJjaWQiOiJzYWFzLTQiLCJleHAiOjE3NjQ5NTYyNjF9.iHYhcOPXzXcI5ov9sVsY9f-WARs-COz9NCdIoto2ysw` }}
                        onNavigationStateChange={handleWebViewNavigationStateChange}
                        onMessage={handleWebViewMessage}
                        style={{ flex: 1 }}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        allowsInlineMediaPlayback={true}
                        mediaPlaybackRequiresUserAction={false}
                        mixedContentMode="compatibility"
                        onError={(syntheticEvent) => {
                            const { nativeEvent } = syntheticEvent;
                            console.warn('⚠️ WebView error: ', nativeEvent);
                            setShowWebView(false);
                            Alert.alert(
                                'Loading Error',
                                'Failed to load verification page. The session might have expired.',
                                [
                                    {
                                        text: 'Go Back',
                                        onPress: () => navigation.goBack()
                                    }
                                ]
                            );
                        }}
                        onLoadStart={() => console.log('🔄 WebView loading started')}
                        onLoadEnd={() => console.log('✅ WebView loading completed')}
                        renderError={(errorName) => (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
                                <Text style={{ color: 'white', fontSize: 16, textAlign: 'center', marginBottom: 20 }}>
                                    Failed to load verification page.{'\n'}The session might have expired.
                                </Text>
                                <TouchableOpacity
                                    style={{ padding: 15, backgroundColor: '#99225E', borderRadius: 8, marginBottom: 10 }}
                                    onPress={() => navigation.goBack()}
                                >
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Go Back</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </SafeAreaView>
            </View>
        );
    }

    // Main UI
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

                                {/* Session Status */}
                                {veriffSessionId ? (
                                    <View className="w-full p-4 bg-green-900/20 rounded-lg border border-green-600">
                                        <Text className="text-green-400 text-center font-PoppinsMedium">
                                            ✅ Ready to verify
                                        </Text>
                                        <Text className="text-gray-400 text-center text-sm mt-1">
                                            Session: {veriffSessionId.slice(0, 8)}...
                                        </Text>
                                    </View>
                                ) : (
                                    <View className="w-full p-4 bg-red-900/20 rounded-lg border border-red-600">
                                        <Text className="text-red-400 text-center font-PoppinsMedium">
                                            ❌ No verification session
                                        </Text>
                                        <Text className="text-gray-400 text-center text-sm mt-1">
                                            Please go back and try again
                                        </Text>
                                    </View>
                                )}

                                {/* Verification Options */}
                                <View className="w-full flex-col justify-start items-start gap-4">
                                    {/* Take a picture of your ID */}
                                    <TouchableOpacity
                                        className={`w-full p-2.5 bg-[#201E23] rounded-lg border flex-row justify-start items-start gap-5 ${selectedOption === 'id' ? 'border-primary' : 'border-gray-700'
                                            }`}
                                        onPress={handleIDPhoto}
                                        activeOpacity={0.7}
                                        disabled={!veriffSessionId}
                                    >
                                        <View className="w-10 h-10 relative overflow-hidden justify-center items-center">
                                            <Image
                                                source={require('../../../assets/icons/pic_id.png')}
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
                                        className={`w-full p-2.5 bg-[#201E23] rounded-lg border flex-row justify-start items-start gap-5 ${selectedOption === 'selfie' ? 'border-primary' : 'border-gray-700'
                                            }`}
                                        onPress={handleSelfie}
                                        activeOpacity={0.7}
                                        disabled={!veriffSessionId}
                                    >
                                        <View className="w-10 h-10 relative overflow-hidden justify-center items-center">
                                            <Image
                                                source={require('../../../assets/icons/face_recognition.png')}
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
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <View className="w-full pb-6 px-5 gap-4">
                    {/* Privacy Notice */}
                    <View className="flex-row justify-start items-start gap-2">
                        <View className="w-6 h-6 relative overflow-hidden justify-center items-center">
                            <Image
                                source={require('../../../assets/icons/shield.png')}
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