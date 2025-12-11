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
import { Button, SecUnion, ThirdUnion } from "../../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import SubscriptionCard from "../../../components/SubscriptionCard"; // Adjust path as needed

// Icon components for the subscription cards
const EssentialIcon = () => (
    <View className="w-5 h-5">
        <View 
            className="w-4 h-3 border-2 border-white rounded-sm"
            style={{
                position: 'absolute',
                left: 1.67,
                top: 2.51,
            }}
        />
        <View 
            className="w-3 border-b-2 border-white"
            style={{
                position: 'absolute',
                left: 4.17,
                top: 17.5,
            }}
        />
    </View>
);

const EliteIcon = () => (
    <View className="w-5 h-5 bg-pink-500 rounded-full items-center justify-center">
        <Text className="text-white text-xs font-bold">★</Text>
    </View>
);

export default function SubscriptionPlans() {
    const essentialFeatures = [
        "Access to 2 events per month",
        "Basic profile verification", 
        "Chat with matches",
        "Email support"
    ];

    const eliteFeatures = [
        "Unlimited event access",
        "Priority event booking",
        "Enhanced profile visibility",
        "Premium concierge support",
        "Exclusive members-only events",
        "Advanced matching algorithm"
    ];

    const handleEssentialSelect = () => {
        console.log("Essential plan selected");
        // Add your navigation or selection logic here
    };

    const handleEliteSelect = () => {
        console.log("Elite plan selected");
        // Add your navigation or selection logic here
    };

    return (
        <View className="flex-1 bg-black">
            <StatusBar barStyle={'light-content'} backgroundColor={'#000000'} />
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
                    className="absolute z-[1]"
                    style={{
                        left: 6,
                        top: -104,
                        width: 524,
                        height: 237,
                        transform: [{ rotate: '20deg' }],
                    }}
                >
                    <ThirdUnion />
                </View>
            </View>
            <SafeAreaView className="flex-1 relative z-10">
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View className="flex-row items-center justify-between pt-5 pb-6 px-5">
                        <Image
                            source={require('../../../assets/images/spooned.png')}
                            className="w-[140px] h-[50px]"
                            resizeMode="contain"
                        />
                        <View className="flex-row items-center gap-4">
                            <TouchableOpacity>
                                <Image
                                    source={require('../../../assets/icons/notification.png')}
                                    className="w-[38px] h-[38px]"
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image
                                    source={require('../../../assets/icons/filter.png')}
                                    className="w-[38px] h-[38px]"
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Title Section */}
                    <View className="mb-6 px-5">
                        <Text className="text-white text-3xl font-PoppinsBold mb-2">
                            Renew Subscription
                        </Text>
                        <Text className="text-gray-400 text-lg">
                            Select a plan to continue your access
                        </Text>
                    </View>

                    {/* Subscription Cards */}
                    <View className="pb-6">
                        {/* Essential Plan */}
                        <SubscriptionCard
                            title="Essential"
                            subtitle="Perfect for trying out"
                            price="99"
                            currency="CHF"
                            period="/month"
                            features={essentialFeatures}
                            onPress={handleEssentialSelect}
                            iconComponent={<EssentialIcon />}
                        />

                        {/* Elite Plan */}
                        <SubscriptionCard
                            title="Elite"
                            subtitle="Our most popular plan"
                            price="199"
                            currency="CHF"
                            period="/month"
                            features={eliteFeatures}
                            onPress={handleEliteSelect}
                            isPopular={true}
                            iconComponent={<EliteIcon />}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}