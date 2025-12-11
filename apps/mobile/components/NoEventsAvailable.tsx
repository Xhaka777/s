import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface NoEventsAvailableProps {
  title?: string;
  description?: string;
  buttonText?: string;
  iconSource?: any;
  onNotifyPress?: () => void;
  iconSize?: number;
  containerStyle?: string;
}

export default function NoEventsAvailable({
  title = "No Events Available",
  description = "We're currently planning new exclusive experiences. Check back soon!",
  buttonText = "Notify me",
  iconSource = require('../assets/icons/events.png'),
  onNotifyPress = () => console.log('Notify button pressed'),
  iconSize = 50,
  containerStyle = "flex-1 items-center justify-center px-6 py-16"
}: NoEventsAvailableProps) {
  return (
    <View className={containerStyle}>
      <Image
        source={iconSource}
        className={`w-[${iconSize}px] h-[${iconSize}px] mb-8`}
        resizeMode="contain"
      />
      
      <View className="items-center mb-8">
        <Text className="text-white text-xl font-PoppinsBold mb-3 text-center">
          {title}
        </Text>
        <Text className="text-gray-400 text-base text-center leading-6 max-w-[280px]">
          {description}
        </Text>
      </View>
      
      <TouchableOpacity 
        className="bg-[#99225E] rounded-full px-8 py-4 min-w-[140px]"
        activeOpacity={0.8}
        onPress={onNotifyPress}
      >
        <Text className="text-white text-base font-PoppinsSemiBold text-center">
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}