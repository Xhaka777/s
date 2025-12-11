import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Dimensions,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, CircleCheck, Calendar, Users } from 'lucide-react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../../../navigation/MainNavigator';
import { ThirdUnion } from '../../../components';

const { height } = Dimensions.get('window');

type OrganizerProfileNavigationProp = StackNavigationProp<MainStackParamList,
    'OrganizerProfile'
>;

type OrganizerProfileRouteProp = RouteProp<MainStackParamList, 'OrganizerProfile'>;

interface OrganizerProfileProps {
    navigation: OrganizerProfileNavigationProp;
    route: OrganizerProfileRouteProp;
}

export default function OrganizerProfile({ navigation, route }: OrganizerProfileProps) {
    const { organizerId } = route.params;

    // Gallery images for the organizer
    const galleryImages = [
        require('../../../assets/images/luxury_wine_tasting.png'),
        require('../../../assets/icons/wine-dine-event.png'),
        require('../../../assets/icons/wine-dine-event.png'),
        require('../../../assets/icons/wine-dine-event.png'),
        require('../../../assets/images/luxury_wine_tasting.png'),
        require('../../../assets/icons/wine-dine-event.png'),
        require('../../../assets/icons/wine-dine-event.png'),
        require('../../../assets/icons/wine-dine-event.png'),
        require('../../../assets/images/luxury_wine_tasting.png'),
        require('../../../assets/icons/wine-dine-event.png'),
    ];

    const handleGalleryPress = (index: number) => {
        navigation.navigate('EventGallery', {
            images: galleryImages,
            initialIndex: index,
            eventTitle: 'Event Organizer Gallery',
        });
    };

    const handleSocialMediaPress = (platform: string) => {
        const urls: { [key: string]: string } = {

        };

        if (urls[platform]) {
            Linking.openURL(urls[platform]);
        }
    };

    return (
        <View className="flex-1 bg-black">
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Pink Header Section - 20% of screen height */}
            <View
                style={{ height: height * 0.2, zIndex: 1, backgroundColor: "rgba(153, 34, 93, 0.46)" }}
            />

            {/* ThirdUnion SVG - Positioned absolutely ON TOP of pink header */}
            <View
                className="absolute"
                style={{
                    left: 16,
                    top: -134,
                    width: 424,
                    height: 137,
                    transform: [{ rotate: '20deg' }],
                    zIndex: 2,
                }}
            >
                <ThirdUnion />
            </View>

            {/* Back Button - needs to be on top of ThirdUnion */}
            <SafeAreaView className="absolute top-0 left-0 right-0" style={{ zIndex: 20 }}>
                <View className="flex-row items-center justify-between px-5">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 items-center justify-center"
                    >
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-lg font-PoppinsBold">
                        Organizer Profile
                    </Text>
                    <View className="w-10" />
                </View>
            </SafeAreaView>

            {/* Profile Picture - Positioned absolutely to overlap */}
            <View className="absolute left-6" style={{ top: height * 0.2 - 50, zIndex: 10 }}>
                <View className="relative">
                    <Image
                        source={require('../../../assets/images/luxury_wine_tasting.png')}
                        style={{ width: 100, height: 100 }}
                        className="rounded-full border-4 border-black"
                        resizeMode="cover"
                    />
                    {/* Verification Badge */}
                    <View className="absolute bottom-0 right-0 bg-[#2B7FFF] rounded-full p-1 border-2 border-black">
                        <CircleCheck size={24} color="#fff" />
                    </View>
                </View>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Organizer Info */}
                <View className="px-6" style={{ marginTop: 60 }}>
                    {/* Name */}
                    <Text className="text-white text-2xl font-PoppinsBold">
                        Prestige Events Zürich
                    </Text>

                    {/* Rating */}
                    <View className="flex-row items-center mt-2">
                        <Star size={20} color="#FFD700" fill="#FFD700" />
                        <Text className="text-white text-base font-PoppinsBold ml-1">
                            4.9
                        </Text>
                        <Text className="text-gray-400 text-base font-PoppinsRegular ml-1">
                            (127 reviews)
                        </Text>
                    </View>

                    {/* Description */}
                    <Text className="text-gray-300 text-base font-PoppinsRegular leading-6 mt-4">
                        Premium event curation for Zürich's elite. Specializing in wine tastings, fine dining, and exclusive cultural experiences.
                    </Text>

                    {/* Stats Cards */}
                    <View className="flex-row justify-between mt-6" style={{ gap: 12 }}>
                        {/* Events Card */}
                        <View className="flex-1 bg-[#0D0D0D] rounded-2xl p-5 border border-[#404040]">
                            <View className="flex-row items-center mb-3">
                                <Calendar size={20} color="#AD46FF" />
                                <Text className="text-gray-400 text-sm font-PoppinsRegular ml-2">
                                    EVENTS
                                </Text>
                            </View>
                            <Text className="text-white text-xl font-PoppinsSemiBold">
                                143
                            </Text>
                        </View>

                        {/* Attendees Card */}
                        <View className="flex-1 bg-[#0D0D0D] rounded-2xl p-5 border border-[#404040]">
                            <View className="flex-row items-center mb-3">
                                <Users size={20} color="#00C950" />
                                <Text className="text-gray-400 text-sm font-PoppinsRegular ml-2">
                                    ATTENDEES
                                </Text>
                            </View>
                            <Text className="text-white text-xl font-PoppinsSemiBold">
                                2847
                            </Text>
                        </View>
                    </View>

                    {/* Event Organizer Gallery */}
                    <View className="mt-8">
                        <Text className="text-white text-xl font-PoppinsMedium mb-4">
                            Event Organizer Gallery
                        </Text>
                        <View className="flex-row justify-between" style={{ gap: 8 }}>
                            {galleryImages.slice(0, 3).map((image, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleGalleryPress(index)}
                                    activeOpacity={0.8}
                                    style={{
                                        width: (Dimensions.get('window').width - 64) / 4,
                                        height: 80,
                                    }}
                                >
                                    <Image
                                        source={image}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: 12,
                                        }}
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>
                            ))}
                            {/* +10 More Card */}
                            <TouchableOpacity
                                onPress={() => handleGalleryPress(3)}
                                activeOpacity={0.8}
                                style={{
                                    width: (Dimensions.get('window').width - 64) / 4,
                                    height: 80,
                                    borderRadius: 12,
                                    backgroundColor: 'rgba(153, 34, 94, 0.5)',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'relative',
                                }}
                            >
                                <Image
                                    source={galleryImages[3]}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 12,
                                        position: 'absolute',
                                    }}
                                    resizeMode="cover"
                                />
                                <View
                                    style={{
                                        backgroundColor: 'rgba(153, 34, 93, 0.6)',
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 12,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text className="text-white text-3xl font-PoppinsBold">
                                        +10
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Social Media & Website */}
                    <View className="mt-8">
                        <Text className="text-white text-xl font-PoppinsMedium mb-4">
                            Social Media & Website
                        </Text>

                        {/* First Row */}
                        <View className="flex-row justify-between mb-3" style={{ gap: 12 }}>
                            <TouchableOpacity
                                onPress={() => handleSocialMediaPress('website')}
                                className="flex-1 bg-[#0D0D0D] rounded-full py-4 px-5 border border-[#404040] flex-row items-center justify-center"
                            >
                                <View className="w-6 h-6 rounded items-center justify-center mr-3">
                                    <Image
                                        source={require('../../../assets/icons/website.png')}
                                        style={{ width: 20, height: 20 }}
                                        resizeMode='cover'
                                    />
                                </View>
                                <Text className="text-white text-base font-PoppinsMedium">
                                    Website
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => handleSocialMediaPress('tiktok')}
                                className="flex-1 bg-[#0D0D0D] rounded-full py-4 px-5 border border-[#404040] flex-row items-center justify-center"
                            >
                                <View className="w-6 h-6 bg-black rounded items-center justify-center mr-3">
                                    <Image
                                        source={require('../../../assets/icons/tiktok.png')}
                                        style={{ width: 20, height: 20 }}
                                        resizeMode='cover'
                                    />
                                </View>
                                <Text className="text-white text-base font-PoppinsMedium">
                                    TikTok
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Second Row */}
                        <View className="flex-row justify-between mb-3" style={{ gap: 12 }}>
                            <TouchableOpacity
                                onPress={() => handleSocialMediaPress('facebook')}
                                className="flex-1 bg-[#0D0D0D] rounded-full py-4 px-5 border border-[#404040] flex-row items-center justify-center"
                            >
                                <View className="w-6 h-6 rounded items-center justify-center mr-3">
                                    <Image
                                        source={require('../../../assets/icons/facebook.png')}
                                        style={{ width: 20, height: 20 }}
                                        resizeMode='cover'
                                    />
                                </View>
                                <Text className="text-white text-base font-PoppinsMedium">
                                    Facebook
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => handleSocialMediaPress('linkedin')}
                                className="flex-1 bg-[#0D0D0D] rounded-full py-4 px-5 border border-[#404040] flex-row items-center justify-center"
                            >
                                <View className="w-6 h-6 rounded items-center justify-center mr-3">
                                    <Image
                                        source={require('../../../assets/icons/linkedin.png')}
                                        style={{ width: 20, height: 20 }}
                                        resizeMode='cover'
                                    />
                                </View>
                                <Text className="text-white text-base font-PoppinsMedium">
                                    Linkedin
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Third Row */}
                        <View className="flex-row justify-between mb-3">
                            <TouchableOpacity
                                onPress={() => handleSocialMediaPress('instagram')}
                                className="bg-[#0D0D0D] rounded-full py-4 px-7 border border-[#404040] flex-row items-center justify-center"
                                style={{ width: (Dimensions.get('window').width - 50) / 2 }}
                            >
                                <View className="w-6 h-6 rounded items-center justify-center mr-3">
                                    <Image
                                        source={require('../../../assets/icons/instagram.png')}
                                        style={{ width: 20, height: 20 }}
                                        resizeMode='cover'
                                    />
                                </View>
                                <Text className="text-white text-base font-PoppinsMedium">
                                    Instagram
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}