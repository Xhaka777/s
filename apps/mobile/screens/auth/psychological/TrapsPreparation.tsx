import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    ImageBackground,
    Dimensions,
    SafeAreaView,
    Image,
    Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ThirdUnion } from '../../../components';
import { ArrowLeft, Mic } from 'lucide-react-native';
import ProcessingModal from '../../../components/ProcessingModal';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Recording Waves Component
const RecordingWaves = () => {
    const wave1 = useRef(new Animated.Value(0.3)).current;
    const wave2 = useRef(new Animated.Value(0.5)).current;
    const wave3 = useRef(new Animated.Value(0.8)).current;
    const wave4 = useRef(new Animated.Value(0.4)).current;
    const wave5 = useRef(new Animated.Value(0.9)).current;
    const wave6 = useRef(new Animated.Value(0.2)).current;

    useEffect(() => {
        const animateWaves = () => {
            const duration = 400 + Math.random() * 300;

            Animated.parallel([
                Animated.sequence([
                    Animated.timing(wave1, {
                        toValue: Math.random() * 0.8 + 0.2,
                        duration,
                        useNativeDriver: false,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(wave2, {
                        toValue: Math.random() * 0.9 + 0.1,
                        duration: duration + 100,
                        useNativeDriver: false,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(wave3, {
                        toValue: Math.random() * 1.0 + 0.3,
                        duration: duration - 50,
                        useNativeDriver: false,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(wave4, {
                        toValue: Math.random() * 0.7 + 0.2,
                        duration: duration + 150,
                        useNativeDriver: false,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(wave5, {
                        toValue: Math.random() * 1.0 + 0.4,
                        duration: duration - 100,
                        useNativeDriver: false,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(wave6, {
                        toValue: Math.random() * 0.6 + 0.1,
                        duration: duration + 50,
                        useNativeDriver: false,
                    }),
                ]),
            ]).start(animateWaves);
        };

        animateWaves();
    }, []);

    const WaveBar = ({ animatedValue, color = '#FF6B9D' }) => (
        <Animated.View
            style={{
                width: 3,
                backgroundColor: color,
                borderRadius: 1.5,
                marginHorizontal: 4,
                height: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [4, 24],
                }),
            }}
        />
    );

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 24 }}>
            <WaveBar animatedValue={wave1} />
            <WaveBar animatedValue={wave2} />
            <WaveBar animatedValue={wave3} />
            <WaveBar animatedValue={wave4} />
            <WaveBar animatedValue={wave5} />
            <WaveBar animatedValue={wave6} />
            <WaveBar animatedValue={wave1} />
            <WaveBar animatedValue={wave3} />
            <WaveBar animatedValue={wave2} />
            <WaveBar animatedValue={wave4} />
            <WaveBar animatedValue={wave6} />
            <WaveBar animatedValue={wave5} />
            <WaveBar animatedValue={wave2} />
            <WaveBar animatedValue={wave1} />
            <WaveBar animatedValue={wave4} />
            <WaveBar animatedValue={wave3} />
            <WaveBar animatedValue={wave5} />
            <WaveBar animatedValue={wave6} />
        </View>
    );
};

const TrapsPreparation = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const [isRecording, setIsRecording] = useState(false);
    const [recordingComplete, setRecordingComplete] = useState(false);
    const [showProcessing, setShowProcessing] = useState(false);
    const [processingProgress, setProcessingProgress] = useState(0);

    const nextScreen = route?.params?.nextScreen || 'RelationshipExperience'; // default fallback

    const isFinalStep = route?.params?.isFinalStep || false;

    const handleRecordingToggle = () => {
        if (isRecording) {
            // Stop recording
            setIsRecording(false);
            setRecordingComplete(true);
        } else {
            // Start recording
            setIsRecording(true);
            setRecordingComplete(false);
        }
    };

    const handleDiscard = () => {
        setRecordingComplete(false);
        setIsRecording(false);
    };

    const handleSaveAnswer = () => {
        if (isFinalStep) {
            // Show processing modal
            setShowProcessing(true);
            setProcessingProgress(0);
    
            // Simulate progress
            const progressInterval = setInterval(() => {
                setProcessingProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(progressInterval);
                        return 100; // Stop at 100 and keep modal visible
                    }
                    return prev + 10;
                });
            }, 200);
        } else {
            // Normal navigation for non-final steps
            navigation.navigate(nextScreen);
        }
    };

    const handleProcessingContinue = () => {
        setShowProcessing(false);
        setProcessingProgress(0); // Reset progress
        navigation.navigate('Conclusion');
    };
    return (
        <View className="flex-1 bg-black">
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Background Image */}
            <ImageBackground
                source={require('../../../assets/images/psychological.png')}
                className="flex-1"
                style={{ width: screenWidth, height: screenHeight }}
                resizeMode="cover"
            >
                {/* Overlay */}
                <View className="absolute inset-0 z-0">
                    {/* Pink glow */}
                    <View
                        className="absolute"
                        style={{
                            left: -264,
                            top: 599,
                            width: 524,
                            height: 237,
                            transform: [{ rotate: '19.68deg' }],
                            zIndex: 1,
                        }}
                    >
                        <ThirdUnion />
                    </View>

                    {/* Bottom fade */}
                    <View className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
                </View>

                {/* Main Content */}
                <SafeAreaView className="flex-1 justify-between">
                    {/* Header */}
                    <View className="px-5" style={{ marginTop: insets.top }}>
                        <View className="flex-row justify-between items-center">
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                className="w-6 h-6 justify-center items-center"
                                activeOpacity={0.7}
                            >
                                <ArrowLeft size={20} color="#FFFFFF" strokeWidth={1.5} />
                            </TouchableOpacity>

                            <View className="flex-1 items-center">
                                <Text className="text-white text-base font-PoppinsBold text-center">
                                    Traps & Preparation
                                </Text>
                            </View>

                            <View className="flex-row items-center">
                                <Text className="text-white text-base font-PoppinsBold">03 </Text>
                                <Text className="text-gray-400 text-base font-PoppinsBold">/03</Text>
                            </View>
                        </View>
                    </View>

                    {/* Middle Content */}
                    <View className="flex-1 justify-end items-center px-5 pb-32">
                        <View
                            className="bg-black/25 rounded-xl border border-black/20 p-3 mx-4"
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                                borderColor: 'rgba(0, 0, 0, 0.2)',
                                borderWidth: 1,
                                minHeight: 80,
                            }}
                        >
                            {!isRecording && !recordingComplete ? (
                                // BEFORE recording content
                                <View className="items-center justify-center" style={{ minHeight: 56 }}>
                                    <Text className="text-white text-sm font-Poppins text-center leading-6">
                                        Allow yourself enough calm to reflect on each question and sense what feels true for you before
                                    </Text>
                                </View>
                            ) : (
                                // DURING recording content (stays visible even after stopping)
                                <View className="items-center justify-center">
                                    <View className="flex-row items-center gap-3 mt-3">
                                        <Image
                                            source={require('../../../assets/icons/image.png')}
                                            className="w-10 h-10"
                                            resizeMode="cover"
                                        />
                                        <View className="flex-row items-center gap-3">
                                            <View>
                                                <Text className="text-white font-PoppinsMedium">Sofia</Text>
                                                <Text className="text-gray-300 text-xs">Recording</Text>
                                            </View>
                                            <RecordingWaves />
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Footer Buttons */}
                    <View className="px-5 pb-5">
                        {/* Recording Timer */}
                        <View className='items-center' style={{ height: 40 }}>
                            {isRecording || recordingComplete ? (
                                <Text className="text-white text-xl font-Poppins mt-2 mb-2">
                                    01:52:28
                                </Text>
                            ) : (
                                <Text></Text>
                            )}
                        </View>

                        {/* Conditional Button Rendering */}
                        {recordingComplete ? (
                            // Show Discard and Save Answer buttons after recording
                            <View className="flex-row justify-center items-center gap-3 mb-5">
                                {/* <TouchableOpacity
                                    onPress={handleDiscard}
                                    className="rounded-full px-6 py-3.5 flex-row items-center gap-2 bg-transparent border-2 border-white flex-1"
                                    style={{
                                        maxWidth: '48%',
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <Text className="text-white text-base font-PoppinsMedium">✕</Text>
                                    <Text className="text-white text-base font-PoppinsMedium">
                                        Discard
                                    </Text>
                                </TouchableOpacity> */}

                                <Button
                                    title="x Discard"
                                    onPress={handleDiscard}
                                    variant="outlined"
                                />


                                {/* <TouchableOpacity
                                    onPress={handleSaveAnswer}
                                    className="rounded-full px-6 py-3.5 flex-row items-center justify-center gap-2 flex-1"
                                    style={{
                                        backgroundColor: '#C2185B',
                                        maxWidth: '48%',
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <Text className="text-white text-base font-PoppinsMedium">
                                        Save answer
                                    </Text>
                                </TouchableOpacity> */}
                                <Button
                                    title='Save answer'
                                    onPress={handleSaveAnswer}
                                    variant="primary"
                                    style={{
                                        shadowColor: '#B8457B',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 8,
                                        elevation: 8,
                                    }}
                                />
                            </View>
                        ) : (
                            // Show original recording buttons
                            <View className="flex-row justify-center items-center gap-3 mb-5">
                                <TouchableOpacity
                                    onPress={handleRecordingToggle}
                                    className={`rounded-full px-6 py-3.5 flex-row items-center gap-2 ${isRecording
                                        ? 'bg-transparent border-2 border-white'
                                        : 'bg-white'
                                        }`}
                                    style={{
                                        shadowColor: '#0D0D12',
                                        shadowOffset: { width: 0, height: 1 },
                                        shadowOpacity: 0.06,
                                        shadowRadius: 2,
                                        elevation: 2,
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <Mic size={20} color={isRecording ? "#FFFFFF" : "#000000"} />
                                    <Text className={`text-base font-PoppinsMedium ${isRecording ? 'text-white' : 'text-black'
                                        }`}>
                                        {isRecording ? 'Stop Recording' : 'Answer by voice'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="w-11 h-11 rounded-full justify-center items-center"
                                    style={{ backgroundColor: '#99225E' }}
                                    activeOpacity={0.8}
                                >
                                    <Image
                                        source={require('../../../assets/icons/message.png')}
                                        style={{ width: 20, height: 20 }}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </SafeAreaView>
            </ImageBackground>
            <ProcessingModal
                visible={showProcessing}
                progress={processingProgress}
                onContinue={handleProcessingContinue}
            />
        </View>
    );
};

export default TrapsPreparation;