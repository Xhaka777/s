import React, { useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
    ScrollView,
} from 'react-native';
import { ArrowLeft, XCircle, Info } from 'lucide-react-native';
import Svg, { Rect, Defs, RadialGradient, Stop } from 'react-native-svg';
import { ThirdUnion } from '../../../components';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../../navigation/MainNavigator';

type CancellationSuccessNavigationProp = StackNavigationProp<MainStackParamList, 'CancellationSuccess'>;

const CancellationSuccess: React.FC = () => {
    const navigation = useNavigation<CancellationSuccessNavigationProp>();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('EventCancelled');
        }, 5000); // 5 seconds

        // Cleanup timer if component unmounts
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View className="flex-1 bg-black">
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Background Effects */}
            <View className="absolute inset-0 z-0">
                {/* Background gradient */}
                <Svg height="50%" width="100%" className="absolute top-0 left-0">
                    <Defs>
                        <RadialGradient
                            id="pinkGlow"
                            cx="0%"
                            cy="10%"
                            r="90%"
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
                        left: 1,
                        top: -104,
                        width: 524,
                        height: 237,
                        transform: [{ rotate: '20deg' }],
                        zIndex: 1,
                    }}
                >
                    <ThirdUnion />
                </View>
            </View>

            <SafeAreaView className="flex-1">
                {/* Header */}
                <View className="flex-row items-center pt-4 pb-6 px-5">
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Home')} // Navigate to home or events
                        className="w-10 h-10 justify-center items-center mr-3"
                        activeOpacity={0.7}
                    >
                        <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2} />
                    </TouchableOpacity>
                    <View className="flex-1 items-center mr-10">
                        <Text className="text-xl font-PoppinsSemiBold text-white">
                            Cancel Booking
                        </Text>
                    </View>
                </View>

                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    {/* Booking Cancelled Alert Card */}
                    <View
                        className="mx-5 rounded-2xl p-5 mb-6"
                        style={{
                            backgroundColor: 'rgba(251, 44, 54, 0.1)',
                            borderWidth: 1,
                            borderColor: 'rgba(251, 44, 54, 0.3)',
                        }}
                    >
                        <View className="flex-row items-start">
                            {/* Icon */}
                            <View
                                className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                                style={{
                                    backgroundColor: 'rgba(251, 44, 54, 0.1)',
                                }}
                            >
                                <XCircle size={24} color="#FB2C36" strokeWidth={2} />
                            </View>

                            {/* Text Content */}
                            <View className="flex-1">
                                <Text className="text-[#FB2C36] text-lg font-PoppinsSemiBold mb-2">
                                    Booking Cancelled
                                </Text>
                                <Text className="text-gray-300 text-sm font-PoppinsRegular leading-5">
                                    Your booking has been cancelled. Refund is being processed.
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Refund Details Card */}
                    <View
                        className="mx-5 rounded-2xl p-6 mb-6"
                        style={{
                            backgroundColor: 'rgba(225, 225, 225, 0.05)',
                            borderWidth: 1,
                            borderColor: 'rgba(225, 225, 225, 0.1)',
                        }}
                    >
                        <Text className="text-white text-lg font-PoppinsSemiBold mb-5">
                            Refund Details - Completed as Store Credits
                        </Text>

                        <View className="h-px bg-[#2A2A2A] mb-5" />

                        {/* Cancelled on */}
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-gray-400 text-base font-PoppinsRegular">
                                Cancelled on
                            </Text>
                            <Text className="text-white text-base font-PoppinsSemiBold">
                                Dec 6, 2025
                            </Text>
                        </View>

                        {/* Refund method */}
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-gray-400 text-base font-PoppinsRegular">
                                Refund method
                            </Text>
                            <Text className="text-white text-base font-PoppinsSemiBold">
                                Added as Store Credits
                            </Text>
                        </View>

                        {/* Processing time */}
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-gray-400 text-base font-PoppinsRegular">
                                Processing time
                            </Text>
                            <Text className="text-white text-base font-PoppinsSemiBold">
                                Immediately
                            </Text>
                        </View>

                        {/* Refund amount */}
                        <View className="flex-row justify-between items-center">
                            <Text className="text-gray-400 text-base font-PoppinsRegular">
                                Refund amount
                            </Text>
                            <Text className="text-[#34C759] text-xl font-PoppinsBold">
                                CHF 472.50
                            </Text>
                        </View>
                    </View>

                    {/* Info Card */}
                    <View
                        className="mx-5 rounded-2xl p-4"
                        style={{
                            backgroundColor: 'rgba(74, 144, 226, 0.1)',
                            borderWidth: 1,
                            borderColor: 'rgba(74, 144, 226, 0.3)',
                        }}
                    >
                        <View className="flex-row items-start">
                            <View className="w-5 h-5 rounded-full bg-[#1E3A5F] items-center justify-center mr-3 mt-0.5">
                                <Info size={14} color="#4A90E2" strokeWidth={2.5} />
                            </View>
                            <Text className="flex-1 text-gray-300 text-sm font-PoppinsRegular leading-5">
                                The refund should appear as store credits on your Events Tab within the day it was processed. If any implications occurr or if account refund is preferred please contact support.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default CancellationSuccess;