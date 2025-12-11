import React, { useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
    ScrollView,
} from 'react-native';
import { ArrowLeft, MapPin, Clock, Users } from 'lucide-react-native';
import Svg, { Rect, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Button, ThirdUnion } from '../../../components';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../../navigation/MainNavigator';
import SuccessMessage from '../../../components/SuccessMessage';
import BookingStatusCard from '../../../components/BookingStatusCard';

type SuccessfullyCheckedNavigationProp = StackNavigationProp<MainStackParamList, 'SuccessfullyChecked'>;

const SuccessfullyChecked: React.FC = () => {
    const navigation = useNavigation<SuccessfullyCheckedNavigationProp>();

    return (
        <View className='flex-1 bg-black'>
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

            <SafeAreaView className='flex-1'>
                {/* Header */}
                <View className='flex-row items-center pt-4 pb-6 px-5'>
                    <TouchableOpacity
                        className='w-10 h-10 justify-center items-center mr-3'
                        activeOpacity={0.7}
                        onPress={() => navigation.goBack()}
                    >
                        <ArrowLeft size={24} color={'#ffffff'} />
                    </TouchableOpacity>
                    <View className='flex-1 items-center mr-10'>
                        <Text className='text-xl font-PoppinsSemiBold text-white'>
                            Successfully Checked In
                        </Text>
                    </View>
                </View>

                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    <BookingStatusCard status='success' />

                    {/* Main Success Content */}
                    <View className="px-5 mt-8">
                        {/* You're All Set Card */}
                        <View
                            className="rounded-3xl p-8 bg-gray-900/50 backdrop-blur-sm mb-6 border-t border-primary"
                            style={{
                                // borderColor: 'rgba(16, 185, 129, 0.3)',
                                backgroundColor: 'rgba(17, 17, 17, 0.8)',
                            }}
                        >
                            {/* Celebration Icon */}
                            <View className="items-center mb-6">
                                <View
                                    className="w-16 h-16 rounded-full items-center justify-center mb-4"
                                    style={{
                                        backgroundColor: 'rgba(0, 201, 80,0.1)',
                                    }}
                                >
                                    {/* Simple animated checkmark/celebration icon */}
                                    <View className="relative">
                                        <Text className="text-3xl" style={{ color: '#05DF72' }}>✓</Text>
                                        {/* You can replace this with your animation component */}
                                    </View>
                                </View>
                            </View>

                            {/* Main Title */}
                            <Text className="text-3xl font-PoppinsBold text-white text-center mb-4">
                                You're All Set!
                            </Text>

                            {/* Check-in Time */}
                            <Text className="text-lg font-PoppinsRegular text-gray-400 text-center mb-8">
                                Checked in at 11:33 PM
                            </Text>

                            {/* Active Attendee Button */}
                            <View className="items-center">
                                <View
                                    className="px-9 py-2 rounded-full border"
                                    style={{
                                        backgroundColor: 'rgba(0, 201, 80,0.1)',
                                        borderColor: 'rgba(0, 201, 80, 0.1)',

                                    }}
                                >
                                    <TouchableOpacity 
                                        className="flex-row items-center"
                                        onPress={() => navigation.navigate('MarkedNoShow')}
                                        >
                                        <View
                                            className="w-3 h-3 rounded-full mr-3"
                                            style={{ backgroundColor: '#05DF72' }}
                                        />
                                        <Text
                                            className="text-base font-PoppinsMedium"
                                            style={{ color: '#05DF72' }}
                                        >
                                            Active Attendee
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Event Information Card */}
                        <View
                            className="rounded-3xl p-6 border"
                            style={{
                                borderColor: 'rgba(75, 85, 99, 0.3)',
                                backgroundColor: 'rgba(17, 17, 17, 0.8)',
                            }}
                        >
                            <Text className="text-xl font-PoppinsSemiBold text-white mb-6">
                                Event Information
                            </Text>

                            {/* Location */}
                            <View className="flex-row items-center mb-4">
                                <MapPin size={20} color="#9CA3AF" style={{ marginRight: 16 }} />
                                <Text className="text-base font-PoppinsRegular text-white flex-1">
                                    Baur au Lac, Basel
                                </Text>
                            </View>

                            {/* Event End Time */}
                            <View className="flex-row items-center mb-4">
                                <Clock size={20} color="#9CA3AF" style={{ marginRight: 16 }} />
                                <Text className="text-base font-PoppinsRegular text-white flex-1">
                                    Event ends at 23:00
                                </Text>
                            </View>

                            {/* Attendees */}
                            <View className="flex-row items-center">
                                <Users size={20} color="#9CA3AF" style={{ marginRight: 16 }} />
                                <Text className="text-base font-PoppinsRegular text-white flex-1">
                                    17 attendees checked in
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default SuccessfullyChecked;