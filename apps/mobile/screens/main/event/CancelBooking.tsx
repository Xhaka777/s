import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
    ScrollView,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import Svg, { Rect, Defs, RadialGradient, Stop } from 'react-native-svg';
import { ThirdUnion, Button } from '../../../components';
import AnswerOption from '../../../components/AnswerOption';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../../navigation/MainNavigator';

type CancelBookingNavigationProp = StackNavigationProp<MainStackParamList, 'CancelBooking'>;

const CancelBooking: React.FC = () => {
    const navigation = useNavigation<CancelBookingNavigationProp>();
    const [selectedReasons, setSelectedReasons] = useState<number[]>([]);

    const cancellationReasons = [
        "Schedule Conflict",
        "Found Alternative Event",
        "Personal Reasons",
        "Financial Constraints",
        "Event Details Changed",
        "Other"
    ];

    const handleReasonSelect = (index: number) => {
        if (selectedReasons.includes(index)) {
            setSelectedReasons(selectedReasons.filter(i => i !== index));
        } else {
            setSelectedReasons([...selectedReasons, index]);
        }
    };

    const handleConfirmCancellation = () => {
        // Handle the cancellation logic here
        console.log('Selected reasons:', selectedReasons.map(i => cancellationReasons[i]));
        
        // Navigate to success screen
        navigation.navigate('CancellationSuccess');
    };

    const handleKeepBooking = () => {
        // Go back to the previous screen
        navigation.goBack();
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
                            Cancel Booking
                        </Text>
                    </View>
                </View>

                {/* Main Content */}
                <View className="flex-1">
                    <ScrollView
                        className="flex-1"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    >
                        <View className="px-5">
                            {/* Description */}
                            <Text className="text-white text-base font-PoppinsRegular leading-6 mb-6">
                                We'd like to understand why you're cancelling. This helps us improve our service.
                            </Text>

                            {/* Cancellation Reasons */}
                            <View className="flex-col gap-3 mb-6">
                                {cancellationReasons.map((reason, index) => (
                                    <AnswerOption
                                        key={index}
                                        text={reason}
                                        isSelected={selectedReasons.includes(index)}
                                        onPress={() => handleReasonSelect(index)}
                                    />
                                ))}
                            </View>
                        </View>
                    </ScrollView>
                </View>

                {/* Fixed Bottom Buttons */}
                <View className="px-5 pb-5 bg-black">
                    {/* Confirm Cancellation Button */}
                    <Button
                        title="Confirm Cancelation"
                        variant="primary"
                        onPress={handleConfirmCancellation}
                        disabled={selectedReasons.length === 0}
                        style={{ marginBottom: 12 }}
                    />

                    {/* Keep Booking Button */}
                    <Button
                        title="Keep Booking"
                        variant="secondary"
                        onPress={handleKeepBooking}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
};

export default CancelBooking;