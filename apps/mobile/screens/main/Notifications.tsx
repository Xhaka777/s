import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { Button, SecUnion, ThirdUnion } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import NotificationItem from "../../components/NotificationItem";

export interface NotificationData {
    id: string;
    type: 'event_reminder' | 'new_match' | 'event_update' | 'new_event';
    title: string;
    description: string;
    timeAgo: string;
    hasUnreadIndicator: boolean;
    icon: any;
}


export default function Notifications() {

    const sampleNotifications: NotificationData[] = [
        {
            id: '1',
            type: 'event_reminder',
            title: 'Event Reminder',
            description: 'Wine & Dine at Clouds starts in 2 days',
            timeAgo: '1h ago',
            hasUnreadIndicator: true,
            icon: require('../../assets/icons/bell.png'),
        },
        {
            id: '2',
            type: 'new_match',
            title: 'New Match',
            description: 'You have a new connection from Sunset Yacht Experience',
            timeAgo: '3h ago',
            hasUnreadIndicator: true,
            icon: require('../../assets/icons/bell.png'),
        },
        {
            id: '3',
            type: 'event_update',
            title: 'Event Update',
            description: 'Only 2 spots left for Alpine Wellness Retreat',
            timeAgo: '1d ago',
            hasUnreadIndicator: false,
            icon: require('../../assets/icons/bell.png'),
        },
        {
            id: '4',
            type: 'new_event',
            title: 'New Event Available',
            description: 'Jazz & Cocktails Night in Lausanne is now open for booking',
            timeAgo: '2d ago',
            hasUnreadIndicator: false,
            icon: require('../../assets/icons/bell.png'),
        },
    ];

    const [notifications, setNotifications] = useState(sampleNotifications);


    const handleNotificationPress = (notificationId: string) => {
        // Handle notification press - navigate to relevant screen or mark as read
        console.log('Notification pressed:', notificationId);

        // Mark as read by removing unread indicator
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === notificationId
                    ? { ...notification, hasUnreadIndicator: false }
                    : notification
            )
        );
    };


    return (
        <View className="flex-1 bg-black">
            <StatusBar barStyle='light-content' backgroundColor={'#000000'} />
            <View className="absolute inset-0 z-0">
                {/* Background gradient */}
                <Svg height="50%" width="100%" className="absolute top-0 left-0">
                    <Defs>
                        <RadialGradient
                            id="pinkGlow"
                            cx="0%" cy="10%" r="90%"
                            gradientUnits="userSpaceOnUse"
                        >
                            <Stop offset="0%" stopColor="#99225E" stopOpacity="0.4" />
                            <Stop offset="100%" stopColor="#000" stopOpacity="0" />
                        </RadialGradient>
                    </Defs>
                    <Rect width="100%" height="100%" fill="url(#pinkGlow)" />
                </Svg>

                {/* Glow background effect */}
                <View
                    className="absolute z-[1]"
                    style={{
                        left: 6,
                        top: -104,
                        width: 524,
                        height: 237,
                        transform: [{ rotate: '20deg' }],
                    }}
                >
                    <ThirdUnion />
                </View>
            </View>
            <SafeAreaView className="flex-1 relative z-10">
                <ScrollView
                    className="flex-1 px-5"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-row items-center justify-between pt-5 pb-6">
                        <Image
                            source={require('../../assets/images/spooned.png')}
                            className="w-[140px] h-[50px]"
                            resizeMode="contain"
                        />
                        <View className="flex-row items-center gap-4">
                            <TouchableOpacity >
                                <Image
                                    source={require('../../assets/icons/notification.png')}
                                    className="w-[38px] h-[38px]"
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image
                                    source={require('../../assets/icons/filter.png')}
                                    className="w-[38px] h-[38px]"
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className="mb-6">
                        <Text className="text-white text-3xl font-PoppinsBold mb-2">
                            Notifications
                        </Text>
                        <Text className="text-gray-400 text-lg">
                            Stay updated with your events
                        </Text>
                    </View>
                    {notifications.length > 0 ? (
                        <View className="pb-6">
                            {notifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    icon={notification.icon}
                                    title={notification.title}
                                    description={notification.description}
                                    timeAgo={notification.timeAgo}
                                    hasUnreadIndicator={notification.hasUnreadIndicator}
                                    onPress={() => handleNotificationPress(notification.id)}
                                />
                            ))}
                        </View>
                    ) : (
                        // Empty state - show this when no notifications
                        <View className="flex-1 items-center justify-center px-6 py-16">
                            <Image
                                source={require('../../assets/icons/bell.png')}
                                className="w-[50px] h-[50px] mb-8"
                                resizeMode="contain"
                            />
                            <View className="items-center mb-8">
                                <Text className="text-white text-xl font-PoppinsBold mb-3 text-center">
                                    No Notifications
                                </Text>
                                <Text className="text-gray-400 text-base text-center leading-6 max-w-[280px]">
                                    You're all caught up! We'll notify you about new events and updates.
                                </Text>
                            </View>
                        </View>
                    )}

                </ScrollView>

            </SafeAreaView>
        </View>
    )
}