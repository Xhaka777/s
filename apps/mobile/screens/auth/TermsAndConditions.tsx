import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Check } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/AuthNavigator';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import Union from '../../components/svg/Union';
import { Button, GlowBackground, SecUnion, ThirdUnion } from '../../components';

type TermsAndConditionsScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'TermsAndConditions'
>;

interface TermsAndConditionsProps {
  onAccept?: () => void;
  onDecline?: () => void;
}

export default function TermsAndConditions({
  onAccept,
  onDecline,
}: TermsAndConditionsProps) {
  const navigation = useNavigation<TermsAndConditionsScreenNavigationProp>();
  const [isAccepted, setIsAccepted] = useState(false);

  const handleAccept = () => {
    if (isAccepted) {
      onAccept?.();
      navigation.goBack();
    }
  };

  const handleDecline = () => {
    onDecline?.();
    navigation.goBack();
  };

  const toggleAcceptance = () => {
    setIsAccepted(!isAccepted);
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Background Layer - Absolute positioned to not affect content flow */}
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

      <SafeAreaView className="flex-1 px-5">
        {/* Header */}
        <View className="flex-row items-center pt-5 pb-5 gap-4 px-3">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-6 h-6 justify-center items-center"
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#FFFFFF" strokeWidth={1.5} />
          </TouchableOpacity>
          <Text className="text-xl font-PoppinsBold text-white">
            Terms & Conditions
          </Text>
        </View>

        {/* Content */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Introduction */}
          <View className="mb-6 px-3">
            <Text className="text-white text-lg font-Poppins" style={{
              lineHeight: 24,
            }}>
              Please read and accept to continue with Spooned.
            </Text>
          </View>

          {/* Terms sections */}
          <View className="gap-6 px-3">
            <View className="gap-2">
              <Text className="text-lg font-Poppins text-white leading-6">
                Account Usage
              </Text>
              <Text className="text-sm text-gray-400 leading-5 font-Poppins">
                Use Spooned responsibly, respect all users, and avoid harmful actions.
              </Text>
            </View>

            <View className="gap-2">
              <Text className="text-lg font-PoppinsMedium text-white leading-6">
                Content Ownership
              </Text>
              <Text className="text-sm text-gray-400 leading-5 font-Poppins">
                Your content is yours. Uploading grants us rights to display it.
              </Text>
            </View>

            <View className="gap-2">
              <Text className="text-lg font-PoppinsMedium text-white leading-6">
                User Conduct
              </Text>
              <Text className="text-sm text-gray-400 leading-5 font-Poppins">
                Engage responsibly. Abuse and unauthorized content are not allowed.
              </Text>
            </View>

            <View className="gap-2">
              <Text className="text-lg font-PoppinsMedium text-white leading-6">
                Termination
              </Text>
              <Text className="text-sm text-gray-400 leading-5 font-Poppins">
                Violations may lead to account suspension, including abuse or unauthorized use.
              </Text>
            </View>

            <View className="gap-2">
              <Text className="text-lg font-PoppinsMedium text-white leading-6">
                Changes to Terms
              </Text>
              <Text className="text-sm text-gray-400 leading-5 font-Poppins">
                Terms may be updated. We'll notify you of changes for your review.
              </Text>
            </View>
          </View>
        </ScrollView>
            
        {/* Bottom section with checkbox and buttons */}
        <View className={`pt-6 gap-4 px-3 ${Platform.OS === 'ios' ? 'pb-0' : 'pb-4'}`}>
          {/* Checkbox */}
          <TouchableOpacity
            className="flex-row items-center gap-2"
            onPress={toggleAcceptance}
            activeOpacity={0.7}
          >
            <View className={`w-5 h-5 rounded border-2 border-white bg-transparent justify-center items-center ${isAccepted ? 'bg-[#B8457B] border-[#B8457B]' : ''
              }`}>
              {isAccepted && (
                <Check size={12} color="#FFFFFF" strokeWidth={2.5} />
              )}
            </View>
            <Text className="flex-1 text-base text-white leading-5 font-Poppins">
              I have agree to the Terms & Conditions
            </Text>
          </TouchableOpacity>

          <Button
            title='Accept & Continue'
            onPress={handleAccept}
            variant='primary'
            disabled={!isAccepted}
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
            onPress={handleDecline}
            activeOpacity={0.8}
          >
            <Text className="text-base font-PoppinsMedium text-[#B8457B]">
              Decline
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}