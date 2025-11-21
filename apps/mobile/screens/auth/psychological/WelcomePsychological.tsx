import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    ImageBackground,
    Dimensions,
    SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ThirdUnion } from '../../../components';
import { ArrowLeft } from 'lucide-react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const WelcomePsychological = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();

    const handleNext = () => {
        navigation.navigate('EarlyInfluences');
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
                {/* Overlay gradient and effects above ImageBackground */}
                <View className="absolute inset-0 z-0">
                    {/* Background gradient */}
                    {/* <Svg height="50%" width="100%" className="absolute top-0 left-0">
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
                    </Svg> */}

                    {/* Glow background effect */}
                    <View
                        className="absolute"
                        style={{
                            left: -264,           // X position from Figma
                            top: 599,            // Y position from Figma  
                            width: 524,          // Width from Figma
                            height: 237,         // Height from Figma
                            transform: [{ rotate: '19,68deg' }], // No rotation
                            zIndex: 1,           // Adjust as needed for layering
                        }}
                    >
                        <ThirdUnion />
                    </View>
                </View>

                {/* Status Bar and Header */}
                <SafeAreaView className="flex-1 justify-between">
                    <View className="px-5" style={{ marginTop: insets.top }}>
                        {/* Navigation Header */}
                        <View className="flex-row justify-between items-center">
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                className="w-6 h-6 justify-center items-center"
                                activeOpacity={0.7}
                            >
                                <ArrowLeft size={20} color="#FFFFFF" strokeWidth={1.5} />
                            </TouchableOpacity>

                            <View className="flex-1 items-center">
                                <Text className="text-white text-base font-Poppins text-center">
                                    Psychological Interview
                                </Text>
                            </View>

                            <View className="flex-row items-center">
                                <Text className="text-white text-base font-Poppins">01 </Text>
                                <Text className="text-gray-400 text-base font-Poppins">/03</Text>
                            </View>
                        </View>
                    </View>

                    {/* Bottom Section */}
                    <View className="px-5 pb-5">
                        {/* Action Buttons */}
                        <Button
                            title="Let's talk together"
                            onPress={handleNext}
                            variant='primary'
                        //    disabled={!isAccepted}
                        />

                        {/* Decline button */}
                        <TouchableOpacity
                            className="h-14 bg-transparent rounded-full justify-center items-center"
                            style={{
                                shadowColor: '#000000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.06,
                                shadowRadius: 2,
                                elevation: 2,
                            }}
                            onPress={handleNext}
                            activeOpacity={0.8}
                        >
                            <Text className="text-base font-PoppinsMedium text-[#fff]">
                                Not ready
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
};

export default WelcomePsychological;