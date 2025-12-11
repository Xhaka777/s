import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
    ScrollView,
} from 'react-native';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';
import Svg, { Rect, Defs, RadialGradient, Stop } from 'react-native-svg';
import { ThirdUnion } from '../../../components';
import BookingStatusCard from '../../../components/BookingStatusCard';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../../navigation/MainNavigator';
import CancelBookingModal from '../../../components/CancelBookingModal';

type WaitlistNavigationProp = StackNavigationProp<MainStackParamList, 'Waitlist'>;

const Waitlist: React.FC = () => {
    const navigation = useNavigation<WaitlistNavigationProp>();
    const [showCancelModal, setShowCancelModal] = useState(false);

    const handleCancelBooking = () => {
        setShowCancelModal(true);
    };

    const handleConfirmCancellation = () => {
        setShowCancelModal(false);
        // Navigate to the cancellation reasons screen
        navigation.navigate('CancelBooking');
    };

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
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 justify-center items-center mr-3"
                        activeOpacity={0.7}
                    >
                        <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2} />
                    </TouchableOpacity>
                    <View className="flex-1 items-center mr-10">
                        <Text className="text-xl font-PoppinsSemiBold text-white">
                            Booking Confirmation
                        </Text>
                    </View>
                </View>

                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    {/* Waitlist Status Card */}
                    <BookingStatusCard status="waitlist" />

                    {/* Waitlist Details Card */}
                    <View className="mx-5 rounded-2xl p-6 mb-6 border"
                        style={{
                            backgroundColor: 'rgba(225, 225, 225, 0.05)',
                            borderColor: 'rgba(225, 225, 225, 0.1)',
                        }}
                    >
                        <Text className="text-white text-base font-PoppinsMedium">
                            Waitlist Details
                        </Text>

                        <View className="h-px bg-[#2A2A2A] my-5" />

                        {/* Added on */}
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-gray-400 text-base font-PoppinsRegular">
                                Added on
                            </Text>
                            <Text className="text-white text-base font-PoppinsSemiBold">
                                Dec 6, 2025
                            </Text>
                        </View>

                        {/* Notification */}
                        <View className="flex-row justify-between items-center">
                            <Text className="text-gray-400 text-base font-PoppinsRegular">
                                Notification
                            </Text>
                            <View className="flex-row items-center">
                                <CheckCircle size={18} color="#34C759" strokeWidth={2} />
                                <Text className="text-[#34C759] text-base font-PoppinsSemiBold ml-2">
                                    Enabled
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Info Card */}
                    <View className="mx-5  rounded-2xl p-4 mb-6 border"
                        style={{
                            backgroundColor: 'rgba(74, 144, 226, 0.1)',
                            borderColor: 'rgba(74, 144, 226, 0.3)',
                        }}
                    >
                        <View className="flex-row items-start">
                            <View className="w-5 h-5 rounded-full bg-[#1E3A5F] items-center justify-center mr-3 mt-0.5">
                                <Text className="text-[#4A90E2] text-xs font-PoppinsBold">
                                    i
                                </Text>
                            </View>
                            <Text className="flex-1 text-gray-400 text-sm font-PoppinsRegular leading-5">
                                You'll receive an email and push notification when a spot opens up, otherwise you will be refunded in store credits.
                            </Text>
                        </View>
                    </View>

                    {/* Cancel Booking Button */}
                    <View className="mx-5">
                        <TouchableOpacity
                            onPress={handleCancelBooking}
                            className="bg-[#101010] rounded-full py-4 items-center border border-[#2A2A2A]"
                            activeOpacity={0.8}
                            style={{
                                borderColor: 'rgba(225, 225, 225, 0.2 )'
                            }}
                        >
                            <Text className="text-white text-base font-PoppinsSemiBold">
                                Cancel Booking
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>

            {/* Confirmation Modal */}
            <CancelBookingModal
                visible={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleConfirmCancellation}
                title="Cancel Booking"
                description="Canceling a waitlist booking will result in a full refund in store credits."
                confirmButtonText="Continue with cancelation"
            />
        </View>
    );
};

export default Waitlist;