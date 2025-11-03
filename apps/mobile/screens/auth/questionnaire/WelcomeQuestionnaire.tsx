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
// import HeartIcon from '../../../assets/icons/heart.png';

const WelcomeQuestionnaire = ({ navigation, route }) => {
    const borderWidth = 1.5;
    const borderRadius = 8;

    const handleNext = () => {
        // 
        navigation.navigate('SpoonedQuestionnaire');
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
                                    <View className="w-full flex-col justify-start items-start gap-2.5">
                                        <View className="w-full justify-start items-center gap-2.5 flex-row">
                                            <Text className="text-white text-2xl font-PoppinsSemiBold leading-8">
                                                Welcome Sofia
                                            </Text>
                                            <Image
                                                source={require('../../../assets/icons/heart.png')}
                                                style={{
                                                    width: 26,
                                                    height: 26,
                                                    marginLeft: 4,
                                                }}
                                                resizeMode="contain"
                                            />
                                        </View>
                                    </View>
                                    <View className="w-full justify-start">
                                        <Text className="text-white text-lg font-PoppinsMedium mb-5">
                                            Glad to have you here!
                                        </Text>
                                        <Text className="leading-5">
                                            <Text className="text-white font-Poppins">Before you meet real people at Spooned, we want to accompany you for a while – with genuine interest in what truly matters to you. We have prepared a questinoary for you..</Text>
                                        </Text>
                                    </View>
                                </View>

                                {/* Questionnaire Info Card */}
                                <View className="w-full flex-col justify-start items-start gap-6">
                                    <View className="w-full">
                                        {/* Gradient Border Container */}
                                        <LinearGradient
                                            colors={['#99225E', '#691740', '#330B1F']}
                                            locations={[0, 0.5, 1]}
                                            style={[
                                                styles.borderContainer,
                                                {
                                                    borderRadius: borderRadius,
                                                }
                                            ]}
                                        >
                                            {/* Content Container */}
                                            <View style={[
                                                styles.cardContainer,
                                                {
                                                    borderRadius: borderRadius - borderWidth,
                                                    margin: borderWidth,
                                                }
                                            ]}>
                                                <View className="w-full flex-col justify-start items-start gap-4">
                                                    <Text className="w-full text-white text-xl font-PoppinsMedium leading-6">
                                                        Spooned questionnaire
                                                    </Text>
                                                    <Text className="w-full text-[#A7A7A7] text-base font-Poppins leading-5">
                                                        This questionnaire focuses on your no-gos – the things you simply can't compromise on in a relationship
                                                    </Text>
                                                    <Text className="w-full text-base font-Poppins leading-5">
                                                        <Text className="text-[#A7A7A7]">The information you provide allows us to</Text>
                                                        <Text className="text-white"> personalize your experience on our platform </Text>
                                                        <Text className="text-[#A7A7A7]">– from the invitations you receive to the way we guide you through your journey. </Text>
                                                        <Text className="text-white">The more accurately and honestly you answer, the more meaningful and efficient your dating experience will be.</Text>
                                                    </Text>
                                                    <Text className="w-full text-base font-Poppins leading-5">
                                                        <Text className="text-[#A7A7A7]">Because we don't believe in algorithms or the "perfect match" – </Text>
                                                        <Text className="text-white">we believe in real chemistry that can only unfold through genuine encounters</Text>
                                                    </Text>
                                                </View>
                                            </View>
                                        </LinearGradient>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View className="w-full pb-6 px-5 gap-4">
                    <Button
                        title="I'm ready to answer"
                        onPress={handleNext}
                        variant="primary"
                    />
                </View>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    borderContainer: {
        // This creates the gradient border
    },
    cardContainer: {
        backgroundColor: '#101010',
        padding: 20,
        width: '99%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 8,
    },
});

export default WelcomeQuestionnaire;