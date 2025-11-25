import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ArrowLeft, ChevronLeft } from 'lucide-react-native';

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  onPress?: () => void;
  style?: any;
  disabled?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  icon, 
  title, 
  onPress, 
  style,
  disabled = false 
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className="bg-[#101010] rounded-full mx-5 mb-4 px-4 py-3 border border-[#525252]"
      style={[styles.menuItem, style]}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="mr-4">
            {icon}
          </View>
          <Text className="text-white text-lg font-Poppins">
            {title}
          </Text>
        </View>
        <ChevronLeft
          size={20} 
          color="#FFFFFF" 
          strokeWidth={1.5}
          style={{ transform: [{ rotate: '180deg' }] }}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    shadowColor: '#ec4899',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
});

export default MenuItem;