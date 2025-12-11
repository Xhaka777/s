import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

interface MembershipCardProps {
    hasSubscription: boolean;
    subscriptionEndDate?: string;
    onViewPlans: () => void;
}

export default function MembershipCard({
    hasSubscription,
    subscriptionEndDate = "Dec 31, 2026",
    onViewPlans
}: MembershipCardProps) {
    return (
        <View className="px-4 pt-5 pb-4 mb-6 rounded-2xl border-[0.8px] shadow-2xl"
            style={{
                backgroundColor: 'rgba(157, 23, 77, 0.2)',
                borderColor: 'rgba(157, 23, 77, 0.4)',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.25,
                shadowRadius: 25,
                elevation: 25,
            }}
        >
            {hasSubscription ? (
                // Premium Membership Active State
                <>
                    <View className="flex-row justify-between items-center mb-4">
                        <View className="flex-row items-center gap-3 flex-1">
                            <View className="w-12 h-12 bg-[#99225E] rounded-full justify-center items-center">
                                <Image
                                    source={require('../assets/icons/crown.png')}
                                    className="w-6 h-6"
                                    resizeMode="contain"
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white text-base font-semibold mb-1">
                                    Premium Membership
                                </Text>
                                <Text className="text-white/60 text-xs">
                                    Active until {subscriptionEndDate}
                                </Text>
                            </View>
                        </View>
                        <View className="w-6 h-6 ml-3 mb-5">
                            <Image
                                source={require('../assets/icons/green_checked.png')}
                                className="w-6 h-6"
                                resizeMode="contain"
                            />
                        </View>
                    </View>
                    <View className="border-t-[0.8px] border-white/10 pt-3 flex-row items-center gap-2">
                        <Image
                            source={require('../assets/icons/star.png')}
                            className="w-4 h-4"
                            resizeMode="contain"
                        />
                        <Text className="text-white/80 text-sm font-medium">
                            Unlimited access to exclusive events
                        </Text>
                    </View>
                </>
            ) : (
                // Subscribe to Premium State
                <>
                    <View className="flex-row items-center gap-3 mb-4">
                        <View className="w-12 h-12 bg-[#99225E] rounded-full justify-center items-center">
                            <Image
                                source={require('../assets/icons/crown.png')}
                                className="w-6 h-6"
                                resizeMode="contain"
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white text-lg font-semibold mb-1">
                                Subscribe to Premium
                            </Text>
                            <Text className="text-white/60 text-sm">
                                Get access to exclusive events
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={onViewPlans}
                        className="bg-[#99225E] rounded-full py-3 px-6 mt-2"
                        style={{
                            backgroundColor: '#99225E',
                        }}
                    >
                        <Text className="text-white text-center text-base font-semibold">
                            View Plans
                        </Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}