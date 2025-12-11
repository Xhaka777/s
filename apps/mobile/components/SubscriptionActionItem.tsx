import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';

export interface SubscriptionActionItemProps {
  icon: any; // Can be require() path for local image
  title: string;
  onPress: () => void;
  iconColor?: string;
  iconBackgroundColor?: string;
}

const SubscriptionActionItem: React.FC<SubscriptionActionItemProps> = ({
  icon,
  title,
  onPress,
  iconColor = '#B8457B',
  iconBackgroundColor = 'rgba(184, 69, 123, 0.2)',
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center justify-between bg-[#0d0d0d] p-4 rounded-2xl border border-[#252525]"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center gap-3">
        <View Ç
          className="w-10 h-10 rounded-lg items-center justify-center"
          style={{ backgroundColor: iconBackgroundColor }}
        >
          <Image
            source={icon}
            className="w-5 h-5"
            resizeMode="contain"
            style={{ tintColor: iconColor }}
          />
        </View>
        <Text className="text-white text-base font-medium">
          {title}
        </Text>
      </View>
      <ChevronRight size={20} color="#6B7280" />
    </TouchableOpacity>
  );
};

export default SubscriptionActionItem;