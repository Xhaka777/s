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
import { useCompleteStageThree } from "../../api/hooks/useOnboarding";
import AsyncStorage from '@react-native-async-storage/async-storage';

const VerifyIndentity = ({ navigation, route }) => {
    const [isReady, setIsReady] = useState(false);
    const [loading, setLoading] = useState(false);

    const completeStageThree = useCompleteStageThree({
        onSuccess: (response) => {
            console.log('Identity verification initiated:', response);
            console.log('Veriff session ID:', response.session_id);
            // Navigate to next screen with session_id
            navigation.navigate('ChooseVerify', {
                veriffSessionId: response.session_id
            });
        },
        onError: (error) => {
            console.error('Stage three error:', error);
            Alert.alert('Error', error.message || 'Failed to start identity verification');
            setLoading(false);
        },
    });

    const handleBack = () => {
        navigation.goBack();
    };

    const handleNext = async () => {
        setLoading(true);
        
        try {
            // Get user ID from AsyncStorage (stored during registration)
            const userId = await AsyncStorage.getItem('@spooned_user_id');
            
            if (userId) {
                // This will trigger the onSuccess callback above
                await completeStageThree.mutateAsync({ 
                    user_id: userId 
                });
            } else {
                Alert.alert('Error', 'User not found. Please sign in again.');
                setLoading(false);
            }
        } catch (error) {
            console.error('Failed to start verification:', error);
            setLoading(false);
        }
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
                        left: -20,           // X position from Figma
                        top: 322,            // Y position from Figma  
                        width: 524,          // Width from Figma
                        height: 237,         // Height from Figma
                        // transform: [{ rotate: '9.68deg' }], // Rotation from Figma
                        zIndex: 1,           // Above blur but below content
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
                    
                    {/* Main Content */}
                    <View className="flex-1 justify-center items-center gap-6">
                        <View className="w-full flex-col justify-start items-start gap-6">
                            <View className="w-full flex-col justify-center items-center gap-16">
                                {/* Title and Description */}
                                <View className="w-full flex-col justify-start items-start gap-6">
                                    <View className="w-full flex-col justify-start items-start gap-2.5">
                                        <View className="w-full justify-start items-center gap-2.5">
                                            <Text className="w-full text-white text-2xl font-PoppinsSemiBold leading-8">
                                                Can we please{'\n'}verify your Identity
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="w-full justify-start">
                                        <Text className="text-sm leading-4">
                                            <Text className="text-gray-400 font-Poppins">Can we ask for your ID and a Selfie ?{'\n'}It's takes </Text>
                                            <Text className="text-white font-PoppinsMedium">2 minutes</Text>
                                            <Text className="text-gray-400 font-Poppins"> . We need to identify only real profiles in our application.</Text>
                                        </Text>
                                    </View>
                                </View>

                                {/* Verification Icon */}
                                <View className="w-64 h-64 bg-pink-200 rounded-full border border-pink-800 flex-col justify-center items-center gap-2">
                                    <View className="w-16 h-16 relative overflow-hidden justify-center items-center">
                                        <Image
                                            source={require('../../assets/icons/camera.png')}
                                            className="w-16 h-16"
                                            resizeMode="contain"
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Bottom Section */}
                <View className="w-full pb-6 px-5 gap-4">
                    <Button
                        title="I'm ready to answer"
                        onPress={handleNext}
                        variant="primary"
                        disabled={loading}
                    />

                    {/* Privacy Notice */}
                    <View className="flex-row justify-start items-start gap-2">
                        <View className="w-6 h-6 relative overflow-hidden justify-center items-center">
                            <CheckSquare size={16} color="#FFFFFF" strokeWidth={1.5} />
                        </View>
                        <Text className="flex-1 text-white text-base font-Poppins leading-4">
                            We never share this with anyone and it won't be on your profile!
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

export default VerifyIndentity;