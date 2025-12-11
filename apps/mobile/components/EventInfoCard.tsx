import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface EventInfoCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    additionalInfo?: string;
    actionText?: string;
    actionColor?: string;
    onActionPress?: () => void;
    iconColor?: string;
}

export default function EventInfoCard({
  icon: IconComponent,
  title,
  description,
  additionalInfo,
  actionText,
  actionColor = '#99225E',
  onActionPress,
  iconColor = 'rgba(255, 255, 255, 0.6)',
}: EventInfoCardProps) {
  return (
    <View className="bg-[#1a1a1a] rounded-2xl p-4 mt-4 border border-[#2a2a2a]" style={{ height: 100 }}>
      {/* Icon and Title */}
      <View className="flex-row items-center mb-2">
        <IconComponent size={16} color={iconColor} />
        <Text className="text-gray-400 text-xs font-PoppinsRegular ml-2">
          {title}
        </Text>
      </View>
      
      {/* Description */}
      <Text className="text-white text-base font-PoppinsSemiBold mb-1" numberOfLines={1}>
        {description}
      </Text>
      
      {/* Additional Info */}
      {additionalInfo && (
        <View className="flex-row items-center justify-between flex-1">
          <Text className="text-gray-400 text-xs font-PoppinsRegular flex-1" numberOfLines={2}>
            {additionalInfo}
          </Text>
          
          {/* Action Text/Button */}
          {actionText && onActionPress && (
            <TouchableOpacity onPress={onActionPress}>
              <Text 
                className="text-xs font-PoppinsMedium ml-2"
                style={{ color: actionColor }}
              >
                {actionText}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}