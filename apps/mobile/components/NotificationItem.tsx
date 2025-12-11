import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

interface NotificationItemProps {
  icon: any; // The icon/image source
  title: string;
  description: string;
  timeAgo: string;
  hasUnreadIndicator?: boolean;
  onPress?: () => void;
}

export default function NotificationItem({
  icon,
  title,
  description,
  timeAgo,
  hasUnreadIndicator = false,
  onPress,
}: NotificationItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="h-24 p-4 bg-white/5 rounded-2xl mb-3"
      style={{
        borderWidth: 0.8,
        borderColor: 'rgba(255, 255, 255, 0.1)',
      }}
      activeOpacity={0.7}
    >
      <View className="w-full h-16 flex-row justify-start items-start gap-3">
        {/* Icon Container */}
        <View className="w-10 h-10 bg-pink-800/20 rounded-2xl flex justify-center items-center">
          <View className="w-5 h-5 relative overflow-hidden">
            <Image
              source={icon}
              className="w-5 h-5"
              resizeMode="contain"
              style={{ tintColor: '#EC4899' }} // Pink tint for the icon
            />
          </View>
        </View>

        {/* Content */}
        <View className="flex-1 h-16 flex-col justify-start items-start gap-1">
          {/* Title Row with Unread Indicator */}
          <View className="self-stretch h-6 relative">
            <View className="absolute left-0 top-0">
              <Text className="text-white text-base font-semibold font-Poppins leading-5">
                {title}
              </Text>
            </View>
            {hasUnreadIndicator && (
              <View 
                className="w-2 h-2 bg-pink-500 rounded-full absolute"
                style={{
                  right: 0,
                  top: 6,
                }}
              />
            )}
          </View>
          
          {/* Description */}
          <View className="self-stretch h-5 relative">
            <Text className="absolute left-0 text-white/70 text-xs font-normal font-Poppins leading-4">
              {description}
            </Text>
          </View>
          
          {/* Time Ago */}
          <View className="self-stretch h-4 relative mt-1">
            <Text className="absolute left-0 text-white/50 text-xs font-normal font-Poppins leading-5">
              {timeAgo}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}