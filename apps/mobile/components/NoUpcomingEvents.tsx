import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface NoUpcomingEventsProps {
  onViewEvents?: () => void;
}

const NoUpcomingEvents: React.FC<NoUpcomingEventsProps> = ({ onViewEvents }) => {
  return (
    <View
      style={{
        backgroundColor: 'rgba(13, 13, 13)', 
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(37, 37, 37)',
        paddingVertical: 8,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        // marginBottom: 14,
      }}
    >
      {/* Calendar Icon */}
      <View style={{ marginBottom: 14 }}>
        <Image
          source={require('../assets/icons/events.png')}
          style={{
            width: 44,
            height: 44,
          }}
          resizeMode="contain"
        />
      </View>

      {/* No upcoming events text */}
      <Text
        style={{
          color: 'white',
          fontSize: 18,
          fontWeight: '500',
          fontFamily: 'Poppins',
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        No upcoming events
      </Text>

      {/* Description text */}
      <Text
        style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: 12,
          fontWeight: '400',
          fontFamily: 'Poppins',
          textAlign: 'center',
          lineHeight: 20,
          marginBottom: 2,
        }}
      >
        Browse our exclusive events and book{'\n'}your seat
      </Text>

      {/* View Available Events Button */}
      <TouchableOpacity
        onPress={onViewEvents}
        style={{
          paddingHorizontal: 24,
          paddingVertical: 12,
        }}
      >
        <Text
          style={{
            color: '#99225E', 
            fontSize: 14,
            fontWeight: '500',
            fontFamily: 'Poppins',
          }}
        >
          View Available Events
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoUpcomingEvents;