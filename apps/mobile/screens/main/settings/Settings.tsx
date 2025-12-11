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
import SubscriptionActionItem from "../../../components/SubscriptionActionItem";
import { useNavigation } from "@react-navigation/native";

export default function Settings() {
    const navigation = useNavigation();


    const handleChangePlan = () => {
        console.log('Change Plan pressed');
        navigation.navigate('SubscriptionPlans' as never);
        // Navigate to plan selection screen

    };

    const handleUpdatePaymentMethod = () => {
        console.log('Update Payment Method pressed');
        // Navigate to payment method screen
    };

    const handleBillingHistory = () => {
        console.log('Billing History pressed');
        // Navigate to billing history screen
    };

    const handleCancelSubscription = () => {
        console.log('Cancel Subscription pressed');
        // Navigate to cancellation screen
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
                    className="flex-1 px-5"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-row items-center justify-between pt-5 pb-6">
                        <Image
                            source={require('../../../assets/images/spooned.png')}
                            className="w-[140px] h-[50px]"
                            resizeMode="contain"
                        />
                        <View className="flex-row items-center gap-4">
                            <TouchableOpacity >
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
                    <View className="mb-6">
                        <Text className="text-white text-3xl font-PoppinsBold mb-2">
                            Subscription & Billing
                        </Text>
                        <Text className="text-gray-400 text-lg">
                            Manage your subscription and payment
                        </Text>
                    </View>
                    <View className="px-4 pt-5 pb-4 mb-6 rounded-2xl border-[0.8px] shadow-2xl"
                        style={{
                            backgroundColor: 'rgba(157, 23, 77, 0.2)',
                            borderColor: 'rgba(157, 23, 77, 0.4)',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.25,
                            shadowRadius: 25,
                            elevation: 25,
                        }}
                    >
                        {/* Plan Header */}
                        <View className="flex-row justify-between items-center mb-6">
                            <View className="flex-row items-center gap-3 flex-1">
                                <View className="w-12 h-12 bg-[#99225E] rounded-full justify-center items-center">
                                    <Image
                                        source={require('../../../assets/icons/crown.png')}
                                        className="w-6 h-6"
                                        resizeMode="contain"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white text-lg font-semibold mb-1">
                                        Premium Plan
                                    </Text>
                                    <Text className="text-white/60 text-sm">
                                        CHF 199/month
                                    </Text>
                                </View>
                            </View>
                            <View className="w-6 h-6 ml-3">
                                <Image
                                    source={require('../../../assets/icons/green_checked.png')}
                                    className="w-6 h-6"
                                    resizeMode="contain"
                                />
                            </View>
                        </View>

                        {/* Plan Details */}
                        <View className="mb-6">
                            {/* Status */}
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-white/80 text-base">Status</Text>
                                <Text className="text-white text-base font-medium">Active</Text>
                            </View>

                            {/* Next billing */}
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-white/80 text-base">Next billing</Text>
                                <Text className="text-white text-base font-medium">Dec 31, 2026</Text>
                            </View>

                            {/* Payment method */}
                            <View className="flex-row justify-between items-center mb-6">
                                <Text className="text-white/80 text-base">Payment method</Text>
                                <Text className="text-white text-base font-medium">•••• 4242</Text>
                            </View>
                        </View>

                        <Button
                            title={'Change Plan'}
                            onPress={handleChangePlan}
                            variant="primary"
                            style={{
                                shadowColor: '#B8457B',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 8,
                                marginBottom: 4,
                            }}
                        />
                    </View>
                    <View className="gap-4">
                        <SubscriptionActionItem
                            icon={require('../../../assets/icons/payment.png')}
                            title="Update Payment Method"
                            onPress={handleUpdatePaymentMethod}
                            iconColor="#B8457B"
                            iconBackgroundColor="rgba(184, 69, 123, 0.2)"
                        />

                        <SubscriptionActionItem
                            icon={require('../../../assets/icons/calendar.png')}
                            title="Billing History"
                            onPress={handleBillingHistory}
                            iconColor="#B8457B"
                            iconBackgroundColor="rgba(184, 69, 123, 0.2)"
                        />

                        <SubscriptionActionItem
                            icon={require('../../../assets/icons/cancel.png')}
                            title="Cancel Subscription"
                            onPress={handleCancelSubscription}
                            iconColor="#B8457B"
                            iconBackgroundColor="rgba(184, 69, 123, 0.2)"
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}