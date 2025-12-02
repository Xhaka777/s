import React from 'react';
import { View } from 'react-native';
import UpcomingEventCard, { Event } from './UpcomingEventCard';

interface UpcomingEventsListProps {
  events: Event[];
  onEventPress?: (event: Event) => void;
}

const UpcomingEventsList: React.FC<UpcomingEventsListProps> = ({ 
  events, 
  onEventPress 
}) => {
  return (
    <View className="space-y-0">
      {events.map((event) => (
        <UpcomingEventCard
          key={event.id}
          event={event}
          onPress={onEventPress}
        />
      ))}
    </View>
  );
};

export default UpcomingEventsList;