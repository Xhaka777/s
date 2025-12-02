import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ChevronRight, MapPin, Clock } from 'lucide-react-native';

export interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  image: any; // For require() images, or string for URLs
}

interface UpcomingEventCardProps {
  event: Event;
  onPress?: (event: Event) => void;
}

const UpcomingEventCard: React.FC<UpcomingEventCardProps> = ({ event, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress?.(event)}
      className="bg-[#0D0D0D] rounded-2xl border border-[#252525] p-4 flex-row items-center mb-3"
    >
      {/* Event Image */}
      <Image
        source={event.image}
        className="w-[60px] h-[60px] rounded-xl mr-4"
        resizeMode="cover"
      />

      {/* Event Details */}
      <View className="flex-1">
        {/* Event Title */}
        <Text className="text-white text-base font-semibold mb-2">
          {event.title}
        </Text>

        {/* Location */}
        <View className="flex-row items-center mb-1.5">
          <MapPin size={14} color="rgba(255, 255, 255, 0.6)" />
          <Text className="text-white/60 text-sm ml-1.5">
            {event.location}
          </Text>
        </View>

        {/* Date and Time */}
        <View className="flex-row items-center">
          <Clock size={14} color="rgba(255, 255, 255, 0.6)" />
          <Text className="text-white/60 text-sm ml-1.5">
            {event.date} • {event.time}
          </Text>
        </View>
      </View>

      {/* Chevron Right */}
      <ChevronRight size={20} color="rgba(255, 255, 255, 0.4)" />
    </TouchableOpacity>
  );
};

export default UpcomingEventCard;