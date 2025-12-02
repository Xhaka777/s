import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface StatsCardProps {
    icon: any; 
    count: number;
    label: string;
    onPress?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, count, label, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-1 bg-[#0d0d0d] border border-[#252525] rounded-2xl py-6 px-4 items-start justify-center"
            activeOpacity={0.7}
        >
            <View className="w-12 h-12 bg-pink-800/20 rounded-full justify-center items-center mb-4">
                <Image
                    source={icon}
                    className="w-6 h-6"
                    resizeMode="contain"
                />
            </View>

            <Text className="text-white text-3xl font-bold mb-1">
                {count}
            </Text>

            <Text className="text-white/60 text-sm text-center">
                {label}
            </Text>
        </TouchableOpacity>
    );
};

export default StatsCard;