import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outlined';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  // Base classes for button
  const baseButtonClasses = "h-14 rounded-full justify-center items-center px-6";
  
  // Variant-specific classes
  const variantClasses = {
    primary: "bg-primary",
    secondary: "bg-white border border-gray-200",
    outlined: "bg-transparent border-2 border-white"
  };
  
  // State classes
  const stateClasses = disabled ? "opacity-50" : "";
  
  // Combine all button classes
  const buttonClasses = `${baseButtonClasses} ${variantClasses[variant]} ${stateClasses}`;
  
  // Text classes with Poppins font
  const baseTextClasses = "text-base font-PoppinsMedium";
  const textColorClasses = {
    primary: "text-white",
    secondary: "text-black",
    outlined: "text-white"
  };
  const disabledTextClasses = disabled ? "opacity-70" : "";
  
  const textClasses = `${baseTextClasses} ${textColorClasses[variant]} ${disabledTextClasses}`;

  return (
    <TouchableOpacity
      className={buttonClasses}
      style={[
        {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outlined' ? '#FFFFFF' : variant === 'primary' ? '#FFFFFF' : '#000000'} 
          size="small" 
        />
      ) : (
        <Text 
          className={textClasses}
          style={textStyle}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}