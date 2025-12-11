import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Button from './Button'

interface SubscriptionCardProps {
    title: string;
    subtitle: string;
    price: string;
    currency?: string;
    period?: string;
    features: string[];
    onPress: () => void;
    isElite?: boolean;
    iconComponent?: React.ReactNode;
}

// Better checkmark component using SVG
const CheckIcon = () => (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <Path
            d="M13.5 4.5L6 12L2.5 8.5"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
    title,
    subtitle,
    price,
    currency = 'CHF',
    period = '/month',
    features,
    onPress,
    isElite = false,
    iconComponent
}) => {
    return (
        <View
            className="mx-4 mb-4 rounded-2xl overflow-hidden"
            style={{
                backgroundColor: isElite
                    ? 'rgba(153, 34, 94, 0.4)' // #99225E with 40% opacity
                    : 'rgba(153, 34, 94, 0.2)', // #99225E with 20% opacity
                borderWidth: 0.8,
                borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
        >
            <View className="p-6">
                {/* Header Section */}
                <View className="mb-6">
                    <View className="flex-row items-center mb-2">
                        {iconComponent && (
                            <View
                                className="w-10 h-10 rounded-full items-center justify-center mr-2"
                                style={{
                                    backgroundColor: isElite ? '#EC4899' : 'rgba(255, 255, 255, 0.1)'
                                }}
                            >
                                {iconComponent}
                            </View>
                        )}
                        <Text
                            className="text-white text-xl font-semibold"
                            style={{ fontFamily: 'Poppins' }}
                        >
                            {title}
                        </Text>
                    </View>
                    <Text
                        className="text-xs"
                        style={{
                            fontFamily: 'Poppins',
                            color: 'rgba(255, 255, 255, 0.6)'
                        }}
                    >
                        {subtitle}
                    </Text>
                </View>

                {/* Price Section */}
                <View
                    className="mb-6 pb-4"
                    style={{
                        borderBottomWidth: 0.8,
                        borderBottomColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                >
                    <View className="flex-row items-baseline">
                        <Text
                            className="text-white text-4xl font-semibold"
                            style={{ fontFamily: 'Poppins' }}
                        >
                            {currency} {price}
                        </Text>
                        <Text
                            className="text-base ml-1"
                            style={{
                                fontFamily: 'Poppins',
                                color: 'rgba(255, 255, 255, 0.6)'
                            }}
                        >
                            {period}
                        </Text>
                    </View>
                </View>

                {/* Features Section */}
                <View className="mb-6">
                    {features.map((feature, index) => (
                        <View key={index} className="flex-row items-center mb-2">
                            <View className="w-4 h-4 mr-6 items-center justify-center">
                                <CheckIcon />
                            </View>
                            <Text
                                className="text-xs flex-1"
                                style={{
                                    fontFamily: 'Poppins',
                                    color: 'rgba(255, 255, 255, 0.8)'
                                }}
                            >
                                {feature}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Button Section */}
                {isElite ? (
                    <Button
                        title={'Get Started'}
                        variant="primary"
                        onPress={onPress}
                        style={{
                            shadowColor: '#B8457B',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 8,
                            marginBottom: 4,
                        }}
                    />
                ) : (
                    <Button
                        title={'Get Started'}
                        variant="secondary"
                        onPress={onPress}
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.2,
                            shadowRadius: 8,
                            elevation: 8,
                        }}
                    />
                )}
            </View>
        </View>
    );
};

export default SubscriptionCard;

export default SubscriptionCard;