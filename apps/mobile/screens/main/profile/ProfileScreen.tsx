import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import { ArrowLeft, User, Settings } from 'lucide-react-native';
import Svg, { Circle, Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { ThirdUnion } from '../../../components';
import MenuItem from '../../../components/MenuItem';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../../navigation/ProfileNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProfileNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'ProfileMain'>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileNavigationProp>();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const PROFILE_IMAGE_KEY = '@spooned:profile_image';

  // Load profile image when screen focuses
  useFocusEffect(
    React.useCallback(() => {
      loadProfileImage();
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

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  // Default image fallback
  const defaultImage = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face';

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

      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center pt-4 pb-8 px-5">
          <TouchableOpacity
            onPress={() => { }}
            className="w-6 h-6 justify-center items-center mr-4"
            activeOpacity={0.7}
          >
            {/* <ArrowLeft size={20} color="#FFFFFF" strokeWidth={1.5} /> */}
          </TouchableOpacity>
          <View className="flex-1 items-center mr-6">
            <Text className="text-xl font-medium text-white font-Poppins">
              Profile
            </Text>
          </View>
        </View>

        {/* Profile Content */}
        <View className="flex-1">
          {/* Profile Picture Container */}
          <View className="items-center mb-8">
            {/* Background circle with gradient */}
            <View className="relative">
              <View
                className="rounded-full bg-gray-800/30"
                style={{
                  width: 160,
                  height: 160,
                  position: 'relative',
                }}
              >
                {/* Progress circle background */}
                <Svg
                  width={160}
                  height={160}
                  className="absolute inset-0"
                  style={{ transform: [{ rotate: '-90deg' }] }}
                >
                  <Circle
                    cx={80}
                    cy={80}
                    r={75}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={4}
                    fill="none"
                  />
                  <Circle
                    cx={80}
                    cy={80}
                    r={75}
                    stroke="#ec4899"
                    strokeWidth={4}
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 75 * 0.4} ${2 * Math.PI * 75}`} // 0.4 for 40%
                    strokeLinecap="round"
                  />
                </Svg>

                {/* Profile Image */}
                <View className="absolute inset-4 rounded-full overflow-hidden">
                  <Image
                    source={{
                      uri: profileImage || defaultImage
                    }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
              </View>

              {/* Progress indicator */}
              <View
                className="absolute"
                style={{
                  // Calculate position based on the progress percentage (40% = 0.4)
                  // The circle starts at top (-90deg) and goes clockwise
                  // 40% of 360deg = 144deg, but since we start at -90deg, it's 144-90 = 54deg
                  top: 100 - 15 * Math.cos((0.4 * 2 * Math.PI - Math.PI / 2)) + 50, // -20 to center the badge
                  left: 10 + 15 * Math.sin((0.4 * 2 * Math.PI - Math.PI / 2))  + 35, // -20 to center the badge
                }}
              >
                <View className="bg-white rounded-full px-3 py-2 border border-gray-300 shadow-md">
                  <Text className="text-black text-sm font-medium font-Poppins">
                    40%
                  </Text>
                </View>
              </View>

            </View>
          </View>

          {/* Name */}
          <View className="items-center mb-12">
            <Text className="text-white text-3xl font-medium font-Poppins">
              Sofia Meier
            </Text>
          </View>

          {/* Menu Items */}
          <View>
            <MenuItem
              icon={
                <Image
                  source={require('../../../assets/icons/edit_profile.png')}
                  style={{ width: 24, height: 24, tintColor: '#FFFFFF' }}
                  resizeMode="contain"
                />
              }
              title="Edit your profile"
              onPress={() => handleEditProfile()}
            />
            <MenuItem
              icon={
                <Image
                  source={require('../../../assets/icons/setting.png')}
                  style={{ width: 24, height: 24, tintColor: '#FFFFFF' }}
                  resizeMode="contain"
                />
              }
              title="Settings"
              onPress={() => { }}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ProfileScreen;