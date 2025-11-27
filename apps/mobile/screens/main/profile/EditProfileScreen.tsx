import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Image,
    StatusBar,
    ScrollView,
    Alert,
} from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { ThirdUnion } from '../../../components';
import { ArrowLeft, ChevronRight, X, Plus } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';

const EditProfileScreen = () => {
    const navigation = useNavigation();
    const [profileImage, setProfileImage] = useState(null);
    
    // Location state
    const [location, setLocation] = useState({
        city: 'Zurich',
        country: 'Switzerland'
    });

    const PROFILE_IMAGE_KEY = '@spooned:profile_image';
    const LOCATION_KEY = '@spooned:user_location';

    // Load profile data when screen focuses
    useFocusEffect(
        React.useCallback(() => {
            loadProfileImage();
            loadLocation();
        }, [])
    );

    const loadProfileImage = async () => {
        try {
            const savedImage = await AsyncStorage.getItem(PROFILE_IMAGE_KEY);
            setProfileImage(savedImage);
        } catch (error) {
            console.error('Error loading profile image:', error);
        }
    };

    const loadLocation = async () => {
        try {
            const savedLocation = await AsyncStorage.getItem(LOCATION_KEY);
            if (savedLocation) {
                setLocation(JSON.parse(savedLocation));
            }
        } catch (error) {
            console.error('Error loading location:', error);
        }
    };

    const saveLocation = async (newLocation) => {
        try {
            await AsyncStorage.setItem(LOCATION_KEY, JSON.stringify(newLocation));
            setLocation(newLocation);
        } catch (error) {
            console.error('Error saving location:', error);
        }
    };

    const pickImage = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 300,
                height: 300,
                cropping: true,
                cropperCircleOverlay: true,
                sortOrder: 'none',
                compressImageMaxWidth: 1000,
                compressImageMaxHeight: 1000,
                compressImageQuality: 1,
                compressVideoPreset: 'MediumQuality',
                includeExif: true,
                cropperStatusBarColor: 'white',
                cropperToolbarColor: 'white',
                cropperActiveWidgetColor: '#99225E',
                cropperToolbarWidgetColor: '#3498DB',
            });

            console.log('Selected image:', image);
            // Save the new image
            await AsyncStorage.setItem(PROFILE_IMAGE_KEY, image.path);
            setProfileImage(image.path);
        } catch (error) {
            console.log('ImagePicker Error: ', error);

            if (error.code === 'E_PERMISSION_MISSING') {
                Alert.alert(
                    'Permission Required',
                    'Please allow access to your photo library to upload a profile picture.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => ImagePicker.openSettings() }
                    ]
                );
            } else if (error.code === 'E_PICKER_CANCELLED') {
                console.log('User cancelled image selection');
            } else {
                Alert.alert(
                    'Error',
                    'Something went wrong while selecting the image. Please try again.',
                    [{ text: 'OK' }]
                );
            }
        }
    };

    const removeProfileImage = async () => {
        Alert.alert(
            'Remove Profile Picture',
            'Are you sure you want to remove your profile picture?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem(PROFILE_IMAGE_KEY);
                            setProfileImage(null);
                        } catch (error) {
                            console.error('Error removing profile image:', error);
                        }
                    }
                }
            ]
        );
    };

    // Navigate to Change Location screen
    const handleLocationPress = () => {
        navigation.navigate('ChangeLocation', {
            // currentCity: location.city,
            // currentCountry: location.country,
            // onLocationChange: saveLocation,
        });
    };

    // Default image fallback
    const defaultImage = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face';

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
                    </Defs>``
                    <Rect width="100%" height="100%" fill="url(#pinkGlow)" />
                </Svg>

                {/* Glow background effect */}
                <View
                    className="absolute"
                    style={{
                        left: -26,
                        top: -54,
                        width: 524,
                        height: 237,
                        transform: [{ rotate: '20deg' }],
                        zIndex: 1,
                    }}
                >
                    <ThirdUnion />
                </View>
            </View>
            <ScrollView className="flex-1 z-10" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="flex-row items-center justify-between px-5 pt-2.5 pb-5 mb-5 ios:pt-2.5 android:pt-5">
                    <TouchableOpacity
                        className="w-10 h-10 items-center justify-center"
                        onPress={() => navigation.goBack()}
                    >
                        <ArrowLeft color="#FFFFFF" size={24} />
                    </TouchableOpacity>
                    <Text className="text-xl font-semibold text-white">Edit Profile</Text>
                    <View className="w-10" />
                </View>

                {/* Profile Picture Section */}
                <View className="px-5 mb-10">
                    <Text className="text-xl font-semibold text-white mb-5">Profile Picture</Text>

                    {profileImage ? (
                        <View className="relative w-28 h-28">
                            <TouchableOpacity onPress={pickImage}>
                                <Image
                                    source={{ uri: profileImage }}
                                    className="w-28 h-28 rounded-xl border-2 border-pink-500"
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="absolute top-3 right-3 w-6 h-6 bg-pink-500 rounded-xl items-center justify-center shadow-md"
                                onPress={removeProfileImage}
                            >
                                <X color="#FFFFFF" size={16} />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            className="w-28 h-28 border-2 border-dashed border-pink-500 rounded-xl items-center justify-center"
                            onPress={pickImage}
                        >
                            <Plus size={24} color="#99225E" strokeWidth={2} />
                            <Text className="text-pink-500 text-xs mt-2 font-medium">
                                Add Photo
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Personal Information Section */}
                <View className="px-5">
                    <Text className="text-xl font-semibold text-white mb-8">Personal Information</Text>

                    {/* Location Field */}
                    <TouchableOpacity 
                        className="border-b border-pink-500 pb-5 mb-9"
                        onPress={handleLocationPress}
                    >
                        <View className="mb-4">
                            <Text className="text-base font-medium text-white">Location*</Text>
                        </View>
                        <View className="flex-row items-center justify-between">
                            <Text className="text-sm text-white flex-1">
                                {location.city}, {location.country}
                            </Text>
                            <ChevronRight color="#99225E" size={20} />
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