import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TextInputProps,
    ViewStyle,
    TextStyle,
} from 'react-native';

interface InputProps extends Omit<TextInputProps, 'style'> {
    label: string;
    required?: boolean;
    error?: string;
    containerStyle?: ViewStyle;
    labelStyle?: TextStyle;
    inputStyle?: TextStyle;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export default function Input({
    label,
    required = false,
    error,
    containerStyle,
    labelStyle,
    inputStyle,
    leftIcon,
    rightIcon,
    value,
    onChangeText,
    placeholder,
    ...textInputProps
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(value || '');

    const handleChangeText = (text: string) => {
        setInternalValue(text);
        if (onChangeText) {
            onChangeText(text);
        }
    };

    const isTyping = isFocused || internalValue.length > 0;

    // Base container classes
    const containerClasses = "w-full flex-col justify-start items-start gap-3";

    // Content classes
    const contentClasses = "w-full flex-col justify-start items-start gap-4";

    // Label classes
    const labelClasses = "w-full text-white text-base font-PoppinsMedium leading-5";

    // Input container base classes
    // Base input container classes (white border always)
    const inputContainerBaseClasses =
        "w-full h-14  px-4 bg-transparent rounded-full border-[0.5px] border-white flex-row justify-start items-center gap-3 relative";

    // Adjust bottom border thickness on focus
    const getDynamicStyle = () => {
        if (error) {
            return { borderColor: '#f87171', borderBottomWidth: 3 }; // red bottom border for error
        }
        if (isFocused) {
            return { borderBottomWidth: 3 }; // thicker bottom border on focus (still white)
        }
        return {};
    };

    // Error text classes
    const errorTextClasses = "text-red-400 text-xs font-normal leading-4";

    return (
        <View
            className={containerClasses}
            style={containerStyle}
        >
            <View className={contentClasses}>
                {/* Label */}
                <Text
                    className={labelClasses}
                    style={[
                        { fontFamily: 'Poppins' },
                        labelStyle
                    ]}
                >
                    {label}{required && '*'}
                </Text>

                {/* Input Container */}
                <View
                    className={inputContainerBaseClasses}
                    style={getDynamicStyle()}
                >
                    {leftIcon && <View className="justify-center items-center">{leftIcon}</View>}

                    <TextInput
                        className="flex-1 text-white text-sm font-Poppins leading-1 h-full"
                        style={[
                            { fontFamily: 'Poppins' },
                            inputStyle
                        ]}
                        value={value || internalValue}
                        onChangeText={handleChangeText}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        {...textInputProps}
                    />

                    {rightIcon && <View className="justify-center items-center">{rightIcon}</View>}
                </View>


                {/* Error message */}
                {error && (
                    <Text
                        className={errorTextClasses}
                        style={{ fontFamily: 'Poppins' }}
                    >
                        {error}
                    </Text>
                )}
            </View>
        </View>
    );
}