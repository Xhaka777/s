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
    StyleSheet,
} from "react-native";
import { Button, SecUnion, ThirdUnion } from "../../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, CheckSquare, Shield } from "lucide-react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import LinearGradient from 'react-native-linear-gradient';

const Conclustion = ({ navigation, route }) => {

    const borderWidth = 1.5;
    const borderRadius = 8;

    const handleNext = () => {
        // 
        navigation.navigate('Booklet');
    }

    const handleBack = () => {
        navigation.goBack();
    }

    return (
        <View className="flex-1 bg-black">
            <StatusBar barStyle='light-content' backgroundColor='#000000' />
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
                        left: -104,          // X position
                        top: 504,            // Y position  
                        width: 524,          // Width
                        height: 237,         // Height
                        // transform: [{ rotate: '1.68deg' }], // Rotation
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
                    <View className="flex-row items-center jutify-between pt-5 pb-2.5">
                        <TouchableOpacity
                            className="w-8 h-8 justify-center items-center"
                            onPress={handleBack}
                        >
                            <ArrowLeft size={20} color='#FFFFFF' strokeWidth={1.5} />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-1 justify-center items-center gap-6">
                        <View className="w-full flex-col justify-start items-start gap-6">
                            <View className="w-full flex-col justify-center items-center gap-16">
                                <View className="w-full flex-col justify-start items-start gap-6">
                                    {/* Title Section */}
                                    <View className="w-full flex-col justify-start items-start gap-2.5">
                                        <View className="w-full justify-start items-center gap-2.5 flex-row">
                                            <Text className="text-white text-2xl font-PoppinsSemiBold leading-8">
                                                Conclusion
                                            </Text>
                                        </View>
                                        <Text className="text-gray-400 text-base font-Poppins leading-5">
                                            You've reached the end of the interview.
                                        </Text>
                                    </View>

                                    {/* Content Section */}
                                    <View className="w-full justify-start gap-6">
                                        <Text className="text-white text-base font-Poppins leading-4">
                                            While answering the questions, you may have noticed that certain things started to move – new thoughts, insights, or the wish to understand something more deeply.
                                        </Text>

                                        <Text className="text-white text-base font-Poppins leading-4">
                                            That's completely natural. This interview is a first step toward becoming more aware of yourself and your relationship patterns.
                                            Sometimes it brings up themes that are worth exploring further.
                                        </Text>

                                        <Text className="text-white text-base font-Poppins leading-5">
                                            If you feel there's something you'd like to clarify or understand better, you're welcome to book an individual session to go deeper. For now, you'll receive your{' '}
                                            <Text className="text-pink-500">Booklet</Text>
                                            {' '}together with your{' '}
                                            <Text className="text-pink-500">Relationship Report</Text>
                                            {' '}– both are designed to help you reflect and make sense of what you've discovered in this process.
                                        </Text>

                                        <Text className="text-white text-base font-Poppins leading-4">
                                            Thank you for your time and your honest words.
                                        </Text>

                                        <Text className="text-pink-500 text-base font-Poppins leading-5">
                                            Your Spooned Team
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Bottom Gradient Overlay */}
                <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
                    className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none"
                />

                {/* Bottom Buttons */}
                <View className="w-full pb-6 px-5 gap-4">
                    <Button
                        title="View your Booklet"
                        onPress={handleNext}
                        variant="primary"
                    />
                    <Button
                        title="Book a session"
                        onPress={handleNext}
                        variant="secondary"
                    />
                </View>
            </SafeAreaView>
        </View>
    )
}

export default Conclustion;