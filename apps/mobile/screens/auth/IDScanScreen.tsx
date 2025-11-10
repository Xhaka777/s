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
import { Button, SecUnion, ThirdUnion } from "../../components";
import { useLanguage } from "../../contexts/LanguageContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, CheckSquare, Shield } from "lucide-react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import { useCompleteStageThree } from "../../api/hooks/useOnboarding";

const IDScanScreen = ({ navigation, route }) => {


    const handleBack = () => {
        navigation.goBack();
    }

    // const veriffWebhook = useVeriffWebhook({
    //     onSuccess: (response) => {
    //         console.log('Webhook processed:', response);
    //         // Handle verification status update
    //     },
    //     onError: (error) => {
    //         console.error('Webhook error:', error);
    //     },
    // });

    // Usage:
    // await veriffWebhook.mutateAsync({
    //   sessionId: 'veriff-session-id',
    //   status: 'approved', // or 'declined', 'pending', etc.
    //   person: { firstName: 'John', lastName: 'Doe' },
    //   document: { type: 'PASSPORT', number: '123456789' }
    // });

    return (
        <View className="flex-1 bg-black">
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
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
                    <View className="flex-1 justify-center items-center gap-6 mb-10">
                        <View className="w-full flex-col justify-start items-start gap-6">
                            <View className="w-full flex-col justify-center items-center gap-16">
                                {/* Title and Description */}
                                <View className="w-full flex-col justify-center items-center gap-6">
                                    {/* Title */}
                                    <Text className="text-white text-2xl font-PoppinsSemiBold leading-8 text-center">
                                        Take a photo of your ID
                                    </Text>

                                    {/* Description */}
                                    <Text className="text-center text-gray-400 text-base font-PoppinsMedium leading-5">
                                        Accepted Documents:
                                        <Text className="text-white font-PoppinsMedium">
                                            {" "}ID Card, Passport, Residence Permit, Driver’s License
                                        </Text>
                                    </Text>
                                </View>

                                {/* ID Scanning Frame */}
                                <View className="w-full flex-col justify-center items-center mt-8">
                                    <View
                                        className="relative"
                                        style={{
                                            width: 350,
                                            height: 250,
                                        }}
                                    >
                                        {/* Corner brackets */}
                                        {/* Top Left */}
                                        <View
                                            className="absolute border-primary"
                                            style={{
                                                top: 0,
                                                left: 0,
                                                width: 80,
                                                height: 80,
                                                borderTopWidth: 1.5,
                                                borderLeftWidth: 1.5,
                                                borderTopLeftRadius: 20,
                                            }}
                                        />

                                        {/* Top Right */}
                                        <View
                                            className="absolute border-primary"
                                            style={{
                                                top: 0,
                                                right: 0,
                                                width: 80,
                                                height: 80,
                                                borderTopWidth: 1.5,
                                                borderRightWidth: 1.5,
                                                borderTopRightRadius: 20,
                                            }}
                                        />

                                        {/* Bottom Left */}
                                        <View
                                            className="absolute border-primary"
                                            style={{
                                                bottom: 0,
                                                left: 0,
                                                width: 80,
                                                height: 80,
                                                borderBottomWidth: 1.5,
                                                borderLeftWidth: 1.5,
                                                borderBottomLeftRadius: 20,
                                            }}
                                        />

                                        {/* Bottom Right */}
                                        <View
                                            className="absolute border-primary"
                                            style={{
                                                bottom: 0,
                                                right: 0,
                                                width: 80,
                                                height: 80,
                                                borderBottomWidth: 1.5,
                                                borderRightWidth: 1.5,
                                                borderBottomRightRadius: 20,
                                            }}
                                        />

                                        {/* Center content area (transparent) */}
                                        <View
                                            className="flex-1 justify-center items-center"
                                            style={{
                                                backgroundColor: 'rgba(0,0,0,0.1)',
                                            }}
                                        >

                                        </View>
                                    </View>
                                </View>

                            </View>
                        </View>
                    </View>
                    <Button
                        title='Accept & Continue'
                        onPress={() => navigation.navigate('DocumentationVerification')}
                        variant='primary'
                    // disabled={!isAccepted}
                    />

                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default IDScanScreen;