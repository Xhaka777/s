import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import { Button, ThirdUnion } from "../../components";

const IDScanScreen = ({ navigation, route }) => {
    const handleBack = () => {
        navigation.goBack();
    };

    const handleContinue = () => {
        // Since Veriff handles both ID and selfie verification,
        // we can navigate to the next step or back to choose verification
        Alert.alert(
            'Verification Complete',
            'Your documents have been submitted for verification. You will be notified of the results.',
            [
                {
                    text: 'Continue',
                    onPress: () => {
                        // Navigate to next screen in your onboarding flow
                        // This could be a waiting screen, dashboard, or next onboarding step
                        navigation.navigate('DocumentationVerification');
                    }
                }
            ]
        );
    };

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
                    
                    <View className="flex-1 justify-center items-center gap-6 mb-10">
                        <View className="w-full flex-col justify-start items-start gap-6">
                            <View className="w-full flex-col justify-center items-center gap-16">
                                {/* Title and Description */}
                                <View className="w-full flex-col justify-center items-center gap-6">
                                    {/* Title */}
                                    <Text className="text-white text-2xl font-PoppinsSemiBold leading-8 text-center">
                                        Verification Submitted
                                    </Text>

                                    {/* Description */}
                                    <Text className="text-center text-gray-400 text-base font-PoppinsMedium leading-5">
                                        Your identity verification has been submitted successfully.
                                        <Text className="text-white font-PoppinsMedium">
                                            {" "}We'll review your documents and notify you of the results.
                                        </Text>
                                    </Text>
                                </View>

                                {/* Success Icon */}
                                <View className="w-64 h-64 bg-green-200/20 rounded-full border border-green-600 flex-col justify-center items-center gap-2">
                                    <View className="w-16 h-16 relative overflow-hidden justify-center items-center">
                                        {/* You can replace this with a checkmark icon */}
                                        <Text className="text-green-400 text-4xl">✓</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    
                    <Button
                        title='Accept & Continue'
                        onPress={handleContinue}
                        variant='primary'
                    />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default IDScanScreen;