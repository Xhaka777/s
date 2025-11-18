import React from 'react';
import { TouchableOpacity, Text, View, Image } from 'react-native';
import { Check } from 'lucide-react-native';

const QuestionnaireCategory = ({
    title,
    onPress,
    style = {},
    textStyle = {},
    isSelected = false,
    disabled = false,
    selectedColor = '#99225E', // Pink color for selected state
    selectedTextColor = '#99225E',
    completedColor = '#34C759',
}) => { 

    // const getBorder -

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            className={`w-full p-3 rounded-full border ${isSelected
                ? 'border-primary bg-[#101010]'
                : 'border-[#312E36] bg-[#101010]'
                } ${disabled ? 'opacity-50' : ''}`}
            style={[
                style,
                isSelected && {
                    borderColor: selectedColor,
                }
            ]}
            activeOpacity={0.7}
        >
            <View className="flex-row justify-between items-center gap-2">
                <Text
                    className={`flex-1 text-base font-medium font-Poppins leading-5 ${isSelected ? 'text-primary' : 'text-white'
                        }`}
                    style={[
                        textStyle,
                        isSelected && { color: selectedTextColor }
                    ]}
                >
                    {title}
                </Text>

                {/* Checkmark icon when selected */}
                {isSelected && (
                    <View className="w-8 h-6 justify-center items-center">
                        <Image
                            source={require('../assets/icons/arrow-right.png')}
                            style={{ width: 30, height: 30 }}
                            resizeMode="contain"
                        />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default QuestionnaireCategory;