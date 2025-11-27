import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    Modal,
    Animated,
    Easing,
    TouchableOpacity,
    Image,
} from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface ProcessingModalProps {
    visible: boolean;
    progress: number; // 0 to 100
    onContinue?: () => void; // Callback when user presses Continue
}

const ProcessingModal: React.FC<ProcessingModalProps> = ({
    visible,
    progress,
    onContinue
}) => {
    const spinValue = useRef(new Animated.Value(0)).current;
    const isComplete = progress >= 100;

    useEffect(() => {
        if (visible && !isComplete) {
            Animated.loop(
                Animated.timing(spinValue, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();
        }
    }, [visible, isComplete]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const AnimatedCircle = Animated.createAnimatedComponent(Circle);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View className="flex-1 justify-center items-center bg-black/50 px-5">
                <View
                    className="w-full max-w-sm rounded-3xl overflow-hidden"
                    style={{
                        backgroundColor: '#101010',
                        borderTopWidth: 1.5,
                        borderTopColor: '#99225E',
                    }}
                >
                    {!isComplete ? (
                        // Processing State
                        <View className="p-7 flex-col justify-start items-center gap-4">
                            {/* Circular Progress Loader */}
                            <View className="w-20 h-20 justify-center items-center">
                                <Animated.View
                                    style={{
                                        transform: [{ rotate: spin }],
                                    }}
                                >
                                    <Svg width="80" height="80" viewBox="0 0 80 80">
                                        <Defs>
                                            <LinearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <Stop offset="0%" stopColor="#4ADE80" stopOpacity="1" />
                                                <Stop offset="100%" stopColor="#4ADE80" stopOpacity="0" />
                                            </LinearGradient>
                                        </Defs>

                                        {/* Background Circle */}
                                        <Circle
                                            cx="40"
                                            cy="40"
                                            r="32"
                                            stroke="rgba(74, 222, 128, 0.2)"
                                            strokeWidth="6"
                                            fill="none"
                                        />

                                        {/* Progress Circle */}
                                        <Circle
                                            cx="40"
                                            cy="40"
                                            r="32"
                                            stroke="url(#greenGradient)"
                                            strokeWidth="6"
                                            fill="none"
                                            strokeDasharray={`${(progress / 100) * 201} 201`}
                                            strokeLinecap="round"
                                            transform="rotate(-90 40 40)"
                                        />

                                        {/* Spinning arc */}
                                        <Circle
                                            cx="40"
                                            cy="40"
                                            r="32"
                                            stroke="#4ADE80"
                                            strokeWidth="6"
                                            fill="none"
                                            strokeDasharray="50 151"
                                            strokeLinecap="round"
                                        />
                                    </Svg>
                                </Animated.View>
                            </View>

                            {/* Text Content */}
                            <View className="flex-col justify-start items-center gap-2.5">
                                <Text className="text-center text-white text-2xl font-PoppinsMedium leading-8">
                                    Processing... ({progress}%)
                                </Text>
                                <Text className="text-center text-white text-base font-Poppins leading-6 px-2">
                                    Please wait, we are analyzing and processing your answer. This may take a moment.
                                </Text>
                            </View>
                        </View>
                    ) : (
                        // Completed State
                        <View className="p-7 flex-col justify-start items-center gap-6">
                            {/* Success Icon */}
                            <View className="w-16 h-16 bg-white rounded-full justify-center items-center">
                                <View className="w-10 h-10 rounded-full justify-center items-center">
                                    <Image
                                        source={require('../assets/icons/Subtract.png')}
                                        style={{ width: 28, height: 28 }}
                                        resizeMode="contain"
                                    />
                                </View>
                            </View>

                            {/* Text Content */}
                            <View className="flex-col justify-start items-center gap-2.5">
                                <Text className="text-center text-white text-2xl font-PoppinsMedium leading-8">
                                    Processing Completed!
                                </Text>
                                <Text className="text-center text-white text-base font-Poppins leading-6 px-2">
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                </Text>
                            </View>

                            {/* Continue Button */}
                            <TouchableOpacity
                                onPress={onContinue}
                                className="w-full rounded-full justify-center items-center"
                                style={{
                                    backgroundColor: '#99225E',
                                    paddingHorizontal: 24,
                                    paddingVertical: 14,
                                    shadowColor: '#000000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.06,
                                    shadowRadius: 2,
                                    elevation: 2,
                                }}
                                activeOpacity={0.8}
                            >
                                <Text className="text-white text-base font-PoppinsMedium">
                                    Continue
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default ProcessingModal;