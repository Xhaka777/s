import React from 'react';
import { TouchableOpacity, Text, View, Image } from 'react-native';
import { Check } from 'lucide-react-native';

const AnswerOption = ({ 
  text, 
  isSelected = false, 
  onPress, 
  disabled = false 
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      className={`w-full py-4 px-5 rounded-full flex-row justify-between items-center ${
        disabled ? 'opacity-50' : ''
      }`}
      style={{
        backgroundColor: '#201E23',
        borderWidth: 1,
        borderColor: isSelected ? '#99225E' : '#525252',
      }}
    >
      <Text 
        className="flex-1 text-white text-base font-PoppinsMedium leading-5 pr-3"
        numberOfLines={4}
      >
        {text}
      </Text>
      
      <View className="w-6 h-6 justify-center items-center">
        {isSelected ? (
          <Image 
            source={require('../assets/icons/pink_checked.png')}
            style={{ width: 24, height: 24 }}
            resizeMode='contain'
          />
        ) : (
          <View 
            className="w-5 h-5 rounded-full"
            style={{ 
              borderWidth: 1,
              borderColor: '#99225E' 
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default AnswerOption;