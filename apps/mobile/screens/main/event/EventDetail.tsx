import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    ImageBackground,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    ArrowLeft,
    Star,
    Clock,
    MapPin,
    CloudRain,
    FileText,
    Users,
    CircleAlert
} from "lucide-react-native";
import LinearGradient from "react-native-linear-gradient";
import EventInfoCard from "../../../components/EventInfoCard";
import { Button } from "../../../components";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../../../navigation/MainNavigator";
import { useNavigation } from "@react-navigation/native";
import GenderWaitlistBottomSheet from "../../../components/GenderWaitlistBottomSheet";

const { width, height } = Dimensions.get('window');

type EventDetailNavigationProp = StackNavigationProp<MainStackParamList, 'EventDetail'>;

export default function EventDetail() {
    const navigation = useNavigation<EventDetailNavigationProp>();
    const [showWaitlistSheet, setShowWaitlistSheet] = useState(false);

    const galleryImages = [
        require('../../../assets/images/luxury_wine_tasting.png'),
        require('../../../assets/icons/wine-dine-event.png'),
        require('../../../assets/icons/wine-dine-event.png'),
        require('../../../assets/icons/wine-dine-event.png'),
    ];

    const handleLocationView = () => {
        console.log('View location pressed');
        // Navigate to map or location details
    };

    const handleGalleryPress = (index: number) => {
        navigation.navigate('EventGallery', {
            images: galleryImages,
            initialIndex: index,
            eventTitle: '',
        });
    };

    const handleBookSpot = () => {
        setShowWaitlistSheet(true);
    };

    const handleContinueBooking = () => {
        setShowWaitlistSheet(false);
        // Navigate to booking confirmation
        navigation.navigate('BookingConfirmation', {
            eventId: 'event-123',
            bookingId: 'SP-64603'
        });
    };

    return (
        <View className="bg-black flex-1">
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Hero Image Section with Gradient Overlay */}
                <View className="relative">
                    <ImageBackground
                        source={require('../../../assets/images/luxury_wine_tasting.png')}
                        style={{ width: width, height: height * 0.35 }}
                        resizeMode="contain"
                    >
                        {/* Dark gradient overlay at the bottom */}
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(153,34,94,0.8)', 'rgba(153,34,94,0.95)']}
                            locations={[0, 0.4, 0.8, 1]}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '60%',
                            }}
                        />

                        {/* Back Button */}
                        <SafeAreaView className="absolute top-0 left-0 right-0 z-20">
                            <TouchableOpacity 
                                className="ml-4 mt-2 w-10 h-10 bg-black/50 rounded-full items-center justify-center backdrop-blur-sm"
                                onPress={() => navigation.goBack()}
                            >
                                <ArrowLeft size={20} color="white" />
                            </TouchableOpacity>
                        </SafeAreaView>

                        {/* Content Overlay */}
                        <View className="absolute bottom-0 left-0 right-0 p-5 z-10">
                            {/* Category Badge */}
                            <View className="mb-4">
                                <View className="bg-[#99225E] px-3 py-1.5 rounded-full self-start">
                                    <Text className="text-white text-sm font-PoppinsMedium">
                                        Culture
                                    </Text>
                                </View>
                            </View>

                            {/* Title */}
                            <Text className="text-white text-2xl font-PoppinsBold mb-3 leading-9">
                                Private Art Gallery Evening
                            </Text>

                            {/* Rating */}
                            <View className="flex-row items-center">
                                <Star size={16} color="#FFD700" fill="#FFD700" />
                                <Text className="text-white text-base font-PoppinsSemiBold ml-1">
                                    4.9
                                </Text>
                                <Text className="text-gray-300 text-base font-PoppinsRegular ml-1">
                                    • by{' '}
                                </Text>
                                <Text className="text-white text-base font-PoppinsSemiBold">
                                    Prestige Events
                                </Text>
                            </View>
                        </View>
                    </ImageBackground>
                </View>

                <View className="bg-black px-5 py-6">
                    {/* Status Section */}
                    <View className="flex-row justify-between items-center mb-6">
                        {/* Open for Bookings */}
                        <Text className="text-[#4A90E2] text-base font-PoppinsMedium">
                            Open for Bookings
                        </Text>

                        {/* Only 2 spots left */}
                        <View className="flex-row items-center">
                            <CircleAlert size={16} color="#FF8904" />
                            <Text className="text-[#FF8904] text-base font-PoppinsMedium ml-2">
                                Only 2 spots left!
                            </Text>
                        </View>
                    </View>

                    {/* Info Cards Grid */}
                    <View className="space-y-3">
                        {/* First Row */}
                        <View className="flex-row justify-between" style={{ gap: 12 }}>
                            <View className="flex-1">
                                <EventInfoCard
                                    icon={Clock}
                                    title="Date & Time"
                                    description="Dec 15, 2025"
                                    additionalInfo="20:00 PM"
                                />
                            </View>
                            <View className="flex-1">
                                <EventInfoCard
                                    icon={MapPin}
                                    title="Location"
                                    description="Baur au Lac"
                                    additionalInfo="Basel"
                                    actionText="View"
                                    onActionPress={handleLocationView}
                                />
                            </View>
                        </View>

                        {/* Second Row */}
                        <View className="flex-row justify-between" style={{ gap: 12 }}>
                            <View className="flex-1">
                                <EventInfoCard
                                    icon={CloudRain}
                                    title="Weather Dependent"
                                    description="Yes"
                                />
                            </View>
                            <View className="flex-1">
                                <EventInfoCard
                                    icon={FileText}
                                    title="Plan B Description"
                                    description="Indoor event hall as backup venue"
                                />
                            </View>
                        </View>

                        {/* Third Row */}
                        <View className="flex-row justify-between" style={{ gap: 12 }}>
                            <View className="flex-1">
                                <EventInfoCard
                                    icon={Users}
                                    title="Attendees"
                                    description="15 / 20"
                                    additionalInfo="8 Men & 10 Women"
                                />
                            </View>
                            <View className="flex-1" />
                        </View>
                    </View>
                    <View className="mt-8">
                        <Text className="text-white text-xl font-PoppinsBold mb-3">
                            About Event
                        </Text>
                        <Text className="text-gray-300 text-base font-PoppinsRegular leading-6">
                            Experience a night of artistic wonder at Galerie d'Art Lumière. Sip champagne, admire captivating works, and mingle with fellow art lovers in Basel's vibrant cultural scene.
                        </Text>
                    </View>
                    {/* Gallery & Artists Section */}
                    <View className="mt-8">
                        <Text className="text-white text-xl font-PoppinsBold mb-4">
                            Gallery & Artists
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ gap: 12 }}
                        >
                            {galleryImages.map((image, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleGalleryPress(index)}
                                    activeOpacity={0.8}
                                >
                                    <Image
                                        source={image}
                                        style={{ width: 80, height: 80, borderRadius: 12 }}
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                    </View>
                    {/* Organizer Card */}
                    <View className="mt-8 bg-[#0D0D0D] rounded-2xl p-5 border border-[#404040]">
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center flex-1">
                                {/* Avatar */}
                                <View className="w-16 h-16 rounded-full bg-[#99225E] items-center justify-center mr-4">
                                    <Text className="text-white text-xl font-PoppinsBold">
                                        PE
                                    </Text>
                                </View>

                                {/* Organizer Info */}
                                <View className="flex-1">
                                    <Text className="text-white text-xl font-PoppinsBold mb-1">
                                        Prestige Events
                                    </Text>
                                    <View className="flex-row items-center">
                                        <Star size={18} color="#FFD700" fill="#FFD700" />
                                        <Text className="text-white text-sm font-Poppins ml-1">
                                            4.9
                                        </Text>
                                        <Text className="text-gray-400 text-sm font-PoppinsRegular ml-1">
                                            • Verified Organizer
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* View Button */}
                            <TouchableOpacity
                                className="bg-[#404040] px-4 py-2 rounded-full ml-2 border border-[#525252]"
                                onPress={() => navigation.navigate('OrganizerProfile', { organizerId: 'prestige-events-1234' })}
                            >
                                <Text className="text-white text-base font-PoppinsMedium">
                                    View
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Description */}
                        <Text className="text-gray-400 text-base font-PoppinsRegular leading-6">
                            Premium event organizer specializing in luxury wine and cultural experiences since 2019
                        </Text>
                    </View>

                    {/* Price & Booking Card */}
                    <View className="mt-6 mb-8 bg-[#0D0D0D] rounded-2xl p-6 border border-[#404040]">
                        {/* Price Section */}
                        <View className="flex-row items-center justify-between mb-6">
                            <View>
                                <Text className="text-gray-400 text-base font-PoppinsRegular mb-2">
                                    Price per person
                                </Text>
                                <Text className="text-white text-3xl font-PoppinsBold">
                                    CHF 180
                                </Text>
                            </View>

                            {/* Only 2 spots left badge */}
                            <View className="bg-[#2A1810] px-4 mb-10 rounded-full flex-row items-center">
                                <CircleAlert size={18} color="#FF8904" />
                                <Text className="text-[#FF8904] text-base font-PoppinsSemiBold ml-2">
                                    Only 2 spots left!
                                </Text>
                            </View>
                        </View>

                        <Button
                            title={'Book Your Spot'}
                            onPress={handleBookSpot}
                            variant="primary"
                            style={{
                                shadowColor: '#B8457B',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 8,
                            }}
                        />

                        {/* Cancellation Policy */}
                        <Text className="text-gray-400 text-center text-sm mt-4 font-PoppinsRegular">
                            Free cancellation up to 14 days before the event
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Gender Waitlist Bottom Sheet */}
            <GenderWaitlistBottomSheet
                visible={showWaitlistSheet}
                onClose={() => setShowWaitlistSheet(false)}
                onContinue={handleContinueBooking}
            />
        </View>
    );
}