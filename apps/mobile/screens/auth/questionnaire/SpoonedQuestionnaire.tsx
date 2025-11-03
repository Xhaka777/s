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
    StyleSheet,
} from "react-native";
import { Button, SecUnion, ThirdUnion } from "../../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, CheckSquare, Shield } from "lucide-react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import LinearGradient from 'react-native-linear-gradient';

const SpoonedQuestionnaire = ({ navigation, route }) => {

    return (
        <View className="flex-1 bg-black">
            <StatusBar barStyle='light-content' backgroundColor='#000000' />
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
            </View>
            <SafeAreaView className="flex-1 relative z-10">
                <ScrollView
                    className="flex-1 px-5"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header with logo and icons */}
                    <View className="flex-row items-center justify-between pt-5 pb-8">
                        {/* Spooned Logo */}
                        <Image
                            source={require('../../../assets/images/spooned.png')}
                            style={{
                                width: 120,
                                height: 40,
                            }}
                            resizeMode="contain"
                        />

                        {/* Right side icons */}
                        <View className="flex-row items-center gap-4">
                            <TouchableOpacity>
                                <Image
                                    source={require('../../../assets/icons/notification.png')}
                                    style={{
                                        width: 38,
                                        height: 38,
                                    }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image
                                    source={require('../../../assets/icons/filter.png')}
                                    style={{
                                        width: 38,
                                        height: 38,
                                    }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="flex-1 justify-center items-center gap-6">
                        <View className="w-full flex-col justify-start items-start gap-6">
                            <View className="w-full flex-col justify-center items-center gap-16">
                                <View className="w-full flex-col justify-start items-start gap-6">
                                    <View className="w-full flex-col justify-start items-start gap-2.5">
                                        <View className="w-full justify-start items-center gap-2.5">
                                            <Text className="w-full text-white text-2xl font-PoppinsSemiBold leading-8">
                                                Spooned questionnaire
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="w-full justify-start">
                                        <Text className="leading-5">
                                            <Text className="text-white font-Poppins">
                                                Your honest answers help us invite you to an event where you can feel at ease – relaxed, authentic, and without pressure.
                                            </Text>
                                        </Text>
                                    </View>
                                </View>

                                <View className="w-full flex-col justify-start items-start gap-6">

                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default SpoonedQuestionnaire;