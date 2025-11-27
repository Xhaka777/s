import React from 'react';
import { TouchableOpacity, Text, View, Image } from 'react-native';
import { Check } from 'lucide-react-native';

const QuestionnaireCategory = ({
    title,
    onPress,
    style = {},
    textStyle = {},
    isSelected = false,
    isCompleted = false,
    progress = 0,
    disabled = false,
    selectedColor = '#99225E', // Pink color for selected state
    selectedTextColor = '#99225E',
    completedColor = '#34C759', // Green color for completed state
}) => {
    // Determine the border color based on state
    const getBorderColor = () => {
        if (isCompleted || progress === 100) {
            return completedColor; // Green for completed
        }
        if (isSelected) {
            return selectedColor; // Pink for selected
        }
        return '#312E36'; // Default gray
    };

    // Determine text color based on state
    const getTextColor = () => {
        if (isCompleted || progress === 100) {
            return '#34C759'; // White text for completed
        }
        if (isSelected) {
            return selectedTextColor; // Pink for selected
        }
        return '#FFFFFF'; // White for default
    };

    // Get progress text to display
    const getProgressText = () => {
        if (isCompleted || progress === 100) {
            return null; // Don't show percentage for completed items
        }
        if (progress > 0) {
            return `${progress}%`;
        }
        return null;
    };

    // Get the right icon to show
    const getRightIcon = () => {
        if (isCompleted || progress === 100) {
            // Show green checkmark for completed
            return (
                <View className="w-8 h-6 justify-center items-center">
                    <Image
                        source={require('../assets/icons/green_checked.png')}
                        style={{ width: 20, height: 20 }}
                        resizeMode="contain"
                    />
                </View>
            );
        }
        
        const progressText = getProgressText();
        if (progressText) {
            // Show progress percentage
            return (
                <View className="w-8 h-6 justify-center items-center">
                    <Text className="text-[#FFF6A3] text-sm font-Poppins">
                        {progressText}
                    </Text>
                </View>
            );
        }
        
        if (isSelected) {
            // Show arrow for selected state
            return (
                <View className="w-8 h-6 justify-center items-center">
                    <Image
                        source={require('../assets/icons/arrow-right.png')}
                        style={{ width: 30, height: 30 }}
                        resizeMode="contain"
                    />
                </View>
            );
        }

        return null;
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            className={`w-full p-3 rounded-full border bg-[#101010] ${disabled ? 'opacity-50' : ''}`}
            style={[
                style,
                {
                    borderColor: getBorderColor(),
                }
            ]}
            activeOpacity={0.7}
        >
            <View className="flex-row justify-between items-center gap-2">
                <Text
                    className="flex-1 text-base font-medium font-Poppins leading-5"
                    style={[
                        textStyle,
                        { color: getTextColor() }
                    ]}
                >
                    {title}
                </Text>

                {/* Right side icon - checkmark, progress, or arrow */}
                {getRightIcon()}
            </View>
        </TouchableOpacity>
    );
};

export default QuestionnaireCategory;