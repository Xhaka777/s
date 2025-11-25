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
import Svg, { Circle, Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { ThirdUnion } from '../../../components';
import { ArrowLeft, ChevronRight, X } from 'lucide-react-native';

const EditProfileScreen = () => {
    return (
        <SafeAreaView className="flex-1 bg-black">
            <StatusBar barStyle="light-content" backgroundColor="#000" />

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
                        left: -26,           // X position from Figma
                        top: -54,            // Y position from Figma  
                        width: 524,          // Width from Figma
                        height: 237,         // Height from Figma
                        transform: [{ rotate: '20deg' }], // No rotation
                        zIndex: 1,           // Adjust as needed for layering
                    }}
                >
                    <ThirdUnion />
                </View>
            </View>
            <ScrollView className="flex-1 z-10" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="flex-row items-center justify-between px-5 pt-2.5 pb-5 mb-5 ios:pt-2.5 android:pt-5">
                    <TouchableOpacity className="w-10 h-10 items-center justify-center">
                        <ArrowLeft color="#FFFFFF" size={24} />
                    </TouchableOpacity>
                    <Text className="text-xl font-semibold text-white">Edit Profile</Text>
                    <View className="w-10" />
                </View>

                {/* Profile Picture Section */}
                <View className="px-5 mb-10">
                    <Text className="text-xl font-semibold text-white mb-5">Profile Picture</Text>
                    <View className="relative w-28 h-28">
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face' }}
                            className="w-28 h-28 rounded-xl border-2 border-pink-500"
                        />
                        <TouchableOpacity className="absolute top-3 right-3 w-6 h-6 bg-pink-500 rounded-xl items-center justify-center shadow-md">
                            <X color="#FFFFFF" size={16} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Personal Information Section */}
                <View className="px-5">
                    <Text className="text-xl font-semibold text-white mb-8">Personal Information</Text>

                    {/* Location Field */}
                    <TouchableOpacity className="border-b border-pink-500 pb-5 mb-9">
                        <View className="mb-4">
                            <Text className="text-base font-medium text-white">Location*</Text>
                        </View>
                        <View className="flex-row items-center justify-between">
                            <Text className="text-sm text-white flex-1">Zurich, Switzerland</Text>
                            <ChevronRight color="#E91E63" size={20} />
                        </View>
                    </TouchableOpacity>

                    {/* Date of Birth Field */}
                    <TouchableOpacity className="border-b border-gray-600 pb-5 mb-9">
                        <View className="mb-4">
                            <Text className="text-base font-medium text-gray-400">Date of Birth*</Text>
                        </View>
                        <View className="flex-row items-center justify-between">
                            <Text className="text-sm text-gray-400 flex-1">November 11, 1986</Text>
                            <ChevronRight color="#666666" size={20} />
                        </View>
                    </TouchableOpacity>

                    {/* Gender Field */}
                    <TouchableOpacity className="border-b border-gray-600 pb-5 mb-9">
                        <View className="mb-4">
                            <Text className="text-base font-medium text-white">Gender</Text>
                        </View>
                        <View className="flex-row items-center justify-between">
                            <Text className="text-sm text-white flex-1">Female</Text>
                            <ChevronRight color="#FFFFFF" size={20} />
                        </View>
                    </TouchableOpacity>

                    {/* Your Preferences Field */}
                    <TouchableOpacity className="border-b border-gray-600 pb-5 mb-12">
                        <View className="mb-4">
                            <Text className="text-base font-medium text-white">Your Preferences</Text>
                        </View>
                        <View className="flex-row items-center justify-between">
                            <Text className="text-sm text-white flex-1">Tag1 , Tag 2</Text>
                            <ChevronRight color="#FFFFFF" size={20} />
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default EditProfileScreen;