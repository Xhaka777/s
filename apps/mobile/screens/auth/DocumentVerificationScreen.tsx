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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../navigation/AuthNavigator";
import { Button, RadialGradientContent, SecUnion, ThirdUnion } from "../../components";
import { useLanguage } from "../../contexts/LanguageContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, CheckSquare, Shield } from "lucide-react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

const DocumentVerification = ({ navigation, route }) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('VerifiedSuccess'); // Make sure this matches your route name
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigation]);

    const handleBack = () => {
        navigation.goBack();
    }

    return (
        <View className="flex-1 bg-black">
            <StatusBar barStyle="light-content" backgroundColor='#000000' />
            <View className="absolute inset-0 z-0">
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
                    contentContainerStyle={{ flexGrow: 1 }}
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

                    {/* Main Content - Centered */}
                    <View className="flex-1 justify-center items-center">
                        <View className="w-full flex-col justify-center items-center gap-8">
                            {/* RadialGradientContent */}
                            <RadialGradientContent
                                imageSource={require('../../assets/icons/facial-recognition.png')}
                                imageStyle={{ width: 40, height: 40 }}
                            />

                            {/* Title and Description */}
                            <View className="w-full flex-col justify-center items-center gap-6">
                                {/* Title */}
                                <Text className="text-white text-2xl font-PoppinsSemiBold leading-8 text-center">
                                    Verifying your identity
                                </Text>

                                {/* Description */}
                                <Text className="text-center text-white text-base font-PoppinsMedium leading-5">
                                    Please be patient, we are verifying your documents
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default DocumentVerification;