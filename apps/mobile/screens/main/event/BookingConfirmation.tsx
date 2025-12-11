import React from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Image,
    StatusBar,
    ScrollView,
} from 'react-native';
import { ArrowLeft, MapPin, Clock } from 'lucide-react-native';
import Svg, { Rect, Defs, RadialGradient, Stop } from 'react-native-svg';
import { ThirdUnion, Button } from '../../../components';
import BookingStatusCard from '../../../components/BookingStatusCard';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../../navigation/MainNavigator';

type BookingConfirmationNavigationProp = StackNavigationProp<MainStackParamList>;

const BookingConfirmation: React.FC = () => {
    const navigation = useNavigation<BookingConfirmationNavigationProp>();

    const handleViewTicket = () => {
        console.log('View ticket pressed');
        // Navigate to waitlist screen
        // In a real app, you'd check the booking status and navigate accordingly
        navigation.navigate('Waitlist', {
            eventId: 'event-123',
            waitlistId: 'waitlist-456'
        });
    };

    const handleCancelBooking = () => {
        console.log('Cancel booking pressed');
        // Show confirmation dialog
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
                    {/* Status Card */}
                    <BookingStatusCard status="confirmed" />

                    {/* Event Details Card */}
                    <View className="mx-5 rounded-2xl p-5 mb-6 border"
                        style={{
                            backgroundColor: 'rgba(225, 225, 225, 0.05)',
                            borderColor: 'rgba(225, 225, 225, 0.1)',
                        }}
                    >
                        <View className="flex-row">
                            {/* Event Image */}
                            <Image
                                source={require('../../../assets/icons/wine-dine-event.png')}
                                className="w-24 h-24 rounded-xl mr-4"
                                resizeMode="cover"
                            />

                            {/* Event Info */}
                            <View className="flex-1">
                                <Text className="text-white text-lg font-PoppinsBold mb-3">
                                    Wine & Dine Under the Stars
                                </Text>

                                {/* Location */}
                                <View className="flex-row items-center mb-2">
                                    <MapPin size={16} color="#999999" />
                                    <Text className="text-gray-400 text-sm font-PoppinsRegular ml-2">
                                        Baur au Lac, Basel
                                    </Text>
                                </View>

                                {/* Date & Time */}
                                <View className="flex-row items-center">
                                    <Clock size={16} color="#999999" />
                                    <Text className="text-gray-400 text-sm font-PoppinsRegular ml-2">
                                        Dec 1 • 19:00
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Divider */}
                        <View className="h-px bg-[#2A2A2A] my-5" />

                        {/* Booking Details */}
                        <View className="space-y-3">
                            {/* Booking ID */}
                            <View className="flex-row justify-between items-center">
                                <Text className="text-gray-400 text-base font-PoppinsRegular">
                                    Booking ID
                                </Text>
                                <Text className="text-white text-base font-PoppinsSemiBold">
                                    #SP-64603
                                </Text>
                            </View>

                            {/* Total Paid */}
                            <View className="flex-row justify-between items-center">
                                <Text className="text-gray-400 text-base font-PoppinsRegular">
                                    Total Paid
                                </Text>
                                <Text className="text-white text-lg font-PoppinsBold">
                                    CHF 472.50
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="mx-5 space-y-3">
                        {/* View Ticket Button */}
                        <Button
                            title="View Ticket"
                            onPress={handleViewTicket}
                            variant="primary"
                            style={{
                                shadowColor: '#B8457B',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 8,
                            }}
                        />

                        {/* Cancel Booking Button */}
                        <TouchableOpacity
                            onPress={handleCancelBooking}
                            className="bg-[#101010] rounded-full py-4 items-center border mt-6"
                            style={{
                                borderColor: 'rgba(225, 225, 225, 0.2 )'
                            }}
                            activeOpacity={0.8}
                        >
                            <Text className="text-white text-base font-PoppinsSemiBold">
                                Cancel Booking
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Cancellation Policy */}
                    <View className="mx-5 mt-6 rounded-2xl p-4 border"
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
                                Cancelations are free up to a certain date before the Scheduled Event Start.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default BookingConfirmation;