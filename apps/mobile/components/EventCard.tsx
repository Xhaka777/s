import { CircleAlert, Clock, MapPin } from 'lucide-react-native';
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ImageBackground,
    Dimensions,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface EventData {
    id: string;
    title: string;
    location: string;
    date: string;
    time: string;
    price: string;
    currency: string;
    image: string | number;
    category: string;
    isFavorite?: boolean;
}

interface EventCardProps {
    event: EventData;
    onPress: (event: EventData) => void;
    onFavoritePress: (eventId: string) => void;
}

export default function EventCard({
    event,
    onPress,
    onFavoritePress,
}: EventCardProps) {
    const cardWidth = screenWidth - 40; // Account for horizontal padding

    return (
        <TouchableOpacity
            onPress={() => onPress(event)}
            className="mb-6"
            activeOpacity={0.9}
        >
            <View
                className="bg-[#0d0d0d] rounded-3xl overflow-hidden border border-[#252525]"
                style={{ width: cardWidth }}
            >
                {/* Image Section */}
                <View className="relative">
                    <ImageBackground
                        source={typeof event.image === 'string' ? { uri: event.image } : event.image}
                        className="w-full h-48 justify-between"
                        imageStyle={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
                    >
                        {/* Gradient Overlay */}
                        <View className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />

                        {/* Category Badge */}
                        <View className="absolute top-4 left-4">
                            <View className="bg-black/70 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                <Text className="text-white text-xs font-PoppinsMedium">
                                    {event.category}
                                </Text>
                            </View>
                        </View>

                        {/* Favorite Button */}
                        <TouchableOpacity
                            onPress={() => onFavoritePress(event.id)}
                            className="absolute top-4 right-4 w-10 h-10 bg-black/70 rounded-full items-center justify-center backdrop-blur-sm"
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Image
                                source={
                                    event.isFavorite
                                        ? require('../assets/icons/empty_heart.png')
                                        : require('../assets/icons/empty_heart.png')
                                }
                                className="w-5 h-5"
                                style={{ tintColor: event.isFavorite ? '#99225E' : 'white' }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </ImageBackground>
                </View>

                {/* Content Section */}
                <View className="p-5">
                    {/* Title */}
                    <Text className="text-white text-xl font-PoppinsBold mb-3 leading-6">
                        {event.title}
                    </Text>

                    {/* Location */}
                    <View className="flex-row items-center mb-2">
                        <MapPin size={14} color="rgba(255, 255, 255, 0.6)" />
                        <Text className="text-gray-400 text-sm font-PoppinsRegular ml-2">
                            {event.location}
                        </Text>
                    </View>

                    {/* Date and Time */}
                    <View className="flex-row items-center mb-2">
                        <Clock size={14} color="rgba(255, 255, 255, 0.6)" />
                        <Text className="text-gray-400 text-sm font-PoppinsRegular ml-2">
                            {event.date} • {event.time}
                        </Text>
                    </View>

                    <View className='flex-row items-center mb-4'>
                        <CircleAlert size={14} color={'#FF8904'} />
                        <Text className='text-[#FF8904] text-sm font-PoppinsRegular ml-2'>
                            Only 2 spots left!
                        </Text>
                    </View>

                    <View className='w-[100%] h-[1px] bg-[#252525] mb-2' />

                    {/* Price and Book Button */}
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-gray-400 text-sm font-PoppinsRegular mb-1">
                                Price per person
                            </Text>
                            <Text className="text-white text-2xl font-PoppinsBold">
                                {event.currency} {event.price}
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => onPress(event)}
                            className="bg-[#99225E] px-8 py-3 rounded-full"
                            activeOpacity={0.8}
                        >
                            <Text className="text-white text-base font-PoppinsSemiBold">
                                Book Now
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}