import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    ScrollView,
} from "react-native";
import { Button, ThirdUnion } from "../../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, ChevronDown, ChevronUp, Check } from "lucide-react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import LinearGradient from 'react-native-linear-gradient';

const Booklet = ({ navigation, route }) => {
    const [expandedSections, setExpandedSections] = useState({
        earlyInfluences: true,  // First section expanded by default
        relationshipExperiences: false,
        trapsPreparation: false,
    });

    const handleBack = () => {
        navigation.goBack();
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const ChecklistItem = ({ text }) => (
        <View className="flex-row items-start gap-3">
            <View className="w-6 h-6 rounded-full bg-white items-center justify-center mt-0.5">
                <Check size={14} color="#000000" strokeWidth={2.5} />
            </View>
            <Text className="flex-1 text-white text-sm font-Poppins leading-5">
                {text}
            </Text>
        </View>
    );

    return (
        <View className="flex-1 bg-black">
            <StatusBar barStyle='light-content' backgroundColor='#000000' />

            {/* Background Elements */}
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

                {/* Glow background effect */}
                <View
                    className="absolute"
                    style={{
                        left: -104,
                        top: 504,
                        width: 524,
                        height: 237,
                        zIndex: 1,
                    }}
                >
                    <ThirdUnion />
                </View>
            </View>

            <SafeAreaView className="flex-1 relative z-10">
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-5 pt-5 pb-6">
                        <TouchableOpacity
                            className="w-8 h-8 justify-center items-center"
                            onPress={handleBack}
                        >
                            <ArrowLeft size={20} color='#FFFFFF' strokeWidth={1.5} />
                        </TouchableOpacity>
                        <Text className="text-white text-base font-PoppinsSemiBold">
                            Your Booklet
                        </Text>
                        <View className="w-8 h-8" />
                    </View>

                    <View className="px-5 pb-32">
                        {/* Page Title */}
                        <Text className="text-white text-base font-Poppins leading-6 mb-6">
                            Your Relationship Report
                        </Text>

                        {/* Expandable Sections */}
                        <View className="gap-4">
                            {/* Early Influences Section */}
                            <View className="bg-[#101010] rounded-xl border border-[#2A2A2A] overflow-hidden">
                                <TouchableOpacity
                                    className="flex-row items-center justify-between p-4 border-b border-[#2A2A2A]"
                                    onPress={() => toggleSection('earlyInfluences')}
                                    activeOpacity={0.7}
                                >
                                    <Text className="text-white text-base font-PoppinsSemiBold">
                                        Early Influences
                                    </Text>
                                    {expandedSections.earlyInfluences ? (
                                        <ChevronUp size={20} color="#FFFFFF" strokeWidth={1.5} />
                                    ) : (
                                        <ChevronDown size={20} color="#FFFFFF" strokeWidth={1.5} />
                                    )}
                                </TouchableOpacity>

                                {expandedSections.earlyInfluences && (
                                    <View className="p-4 gap-4">
                                        <Text className="text-[#EC4899] text-sm font-PoppinsMedium leading-4">
                                            In your family of origin there was…
                                        </Text>

                                        <ChecklistItem text="a sense of safety and reliability" />
                                        <ChecklistItem text="a strong emphasis on independence / early self-reliance was expected" />
                                        <ChecklistItem text="frequent conflicts and emotional insecurity" />
                                        <ChecklistItem text="a lot of observation or control over one's behavior" />

                                        <Text className="text-[#EC4899] text-sm font-PoppinsMedium leading-4 mt-2">
                                            When you think about your childhood: Which experience shaped your view of relationships the most? Which feeling accompanied you at that time?
                                        </Text>

                                        <Text className="text-white text-sm font-Poppins leading-5">
                                            Swipe through profiles effortlessly: swipe right to match, left to skip. Matches unlock chat options for meaningful connections and conversations.
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* Relationship Experiences Section */}
                            <View className="bg-[#101010] rounded-xl border border-[#2A2A2A] overflow-hidden">
                                <TouchableOpacity
                                    className="flex-row items-center justify-between p-4"
                                    onPress={() => toggleSection('relationshipExperiences')}
                                    activeOpacity={0.7}
                                >
                                    <Text className="text-white text-base font-PoppinsMedium flex-1">
                                        Relationship Experiences
                                    </Text>
                                    {expandedSections.relationshipExperiences ? (
                                        <ChevronUp size={20} color="#FFFFFF" strokeWidth={1.5} />
                                    ) : (
                                        <ChevronDown size={20} color="#FFFFFF" strokeWidth={1.5} />
                                    )}
                                </TouchableOpacity>

                                {expandedSections.relationshipExperiences && (
                                    <View className="p-4 pt-0 gap-4">
                                        <Text className="text-white text-sm font-Poppins leading-5">
                                            ...
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* Traps & Preparation Section */}
                            <View className="bg-[#101010] rounded-xl border border-[#2A2A2A] overflow-hidden">
                                <TouchableOpacity
                                    className="flex-row items-center justify-between p-4"
                                    onPress={() => toggleSection('trapsPreparation')}
                                    activeOpacity={0.7}
                                >
                                    <Text className="text-white text-base font-PoppinsSemiBold flex-1">
                                        Traps & Preparation
                                    </Text>
                                    {expandedSections.trapsPreparation ? (
                                        <ChevronUp size={20} color="#FFFFFF" strokeWidth={1.5} />
                                    ) : (
                                        <ChevronDown size={20} color="#FFFFFF" strokeWidth={1.5} />
                                    )}
                                </TouchableOpacity>

                                {expandedSections.trapsPreparation && (
                                    <View className="p-4 pt-0 gap-4">
                                        <Text className="text-white text-sm font-Poppins leading-5">
                                            ...
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Bottom Gradient Overlay */}
                <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.9)', 'rgba(0,0,0,1)']}
                    className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none"
                />
            </SafeAreaView>
        </View>
    );
};

export default Booklet;