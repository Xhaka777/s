import React, { useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
    ScrollView,
} from 'react-native';
import { ArrowLeft, XCircle, Info, CheckCircle, CircleAlert } from 'lucide-react-native';
import Svg, { Rect, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Button, ThirdUnion } from '../../../components';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../../navigation/MainNavigator';

type MarkedNoShowNavigationProp = StackNavigationProp<MainStackParamList, 'MarkedNoShow'>;

const MarkedNoShow: React.FC = () => {
    const navigation = useNavigation<MarkedNoShowNavigationProp>();

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
                <View className="flex-row items-center pt-4 pb-6 px-5">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()} // Navigate to home or events
                        className="w-10 h-10 justify-center items-center mr-3"
                        activeOpacity={0.7}
                    >
                        <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2} />
                    </TouchableOpacity>
                    <View className="flex-1 items-center mr-10">
                        <Text className="text-xl font-PoppinsSemiBold text-white">
                            Marked as No-Show
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
                                    Marked as No-Show
                                </Text>
                                <Text className="text-gray-300 text-sm font-PoppinsRegular leading-5">
                                    You did not attend this event. Contact us if this is incorrect.
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
                            Event Details
                        </Text>

                        <View className="h-px bg-[#2A2A2A] mb-5" />

                        {/* Cancelled on */}
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-gray-400 text-base font-PoppinsRegular">
                                Event
                            </Text>
                            <Text className="text-white text-sm font-Poppins">
                                Wine & Dine Under the Stars
                            </Text>
                        </View>

                        {/* Refund method */}
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-gray-400 text-sm font-Poppins">
                                Your booking
                            </Text>
                            <Text className="text-white text-sm font-Poppins">
                                Added as Store Credits
                            </Text>
                        </View>


                        {/* Refund amount */}
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-gray-400 text-base font-PoppinsRegular">
                                Status
                            </Text>
                            <Text className="text-[#EF4444] text-sm font-Poppins">
                                No-show
                            </Text>
                        </View>

                        <View className="flex-row justify-between items-center">
                            <Text className="text-gray-400 text-sm font-Poppins">
                                Refund
                            </Text>
                            <Text className="text-white text-sm font-Poppins">
                                Not applicable
                            </Text>
                        </View>

                    </View>

                    {/* Cancellation Policy */}
                    <View className="mx-5 rounded-2xl p-4 border mb-5"
                        style={{
                            backgroundColor: 'rgba(255, 105, 0, 0.1)',
                            borderColor: 'rgba(255, 105, 0, 0.3)',
                        }}
                    >
                        <View className="flex-row items-start">
                            <View className="w-5 h-5 rounded-full items-center justify-center mr-3 mt-0.5">
                                <CircleAlert size={16} color="#FF8904" />
                            </View>
                            <View>
                                <Text className='text-[#FF8904] text-sm font-PoppinsMedium'>No-Show Policy</Text>
                                <Text className="flex-1 text-white text-sm font-PoppinsRegular leading-5">
                                    Cancelations are free up to a certain date before the Scheduled Event Start.
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className="mx-5 space-y-3">
                        {/* View Ticket Button */}
                        <Button
                            title="Browse Events"
                            onPress={() => navigation.navigate('SuccessfullyChecked')}
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
                            onPress={() => { }}
                            className="bg-[#101010] rounded-full py-4 items-center border mt-6"
                            style={{
                                borderColor: 'rgba(225, 225, 225, 0.2 )'
                            }}
                            activeOpacity={0.8}
                        >
                            <Text className="text-white text-base font-PoppinsSemiBold">
                                Contact Support
                            </Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </SafeAreaView>

        </View>
    )
}

export default MarkedNoShow;