import React from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import EventCard from './EventCard';

interface EventData {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  price: string;
  currency: string;
  image: string;
  category: string;
  isFavorite?: boolean;
}

interface EventsListProps {
  events: EventData[];
  onEventPress: (event: EventData) => void;
  onFavoritePress: (eventId: string) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export default function EventsList({
  events,
  onEventPress,
  onFavoritePress,
  onRefresh,
  refreshing = false,
  loading = false,
  onLoadMore,
  hasMore = false,
}: EventsListProps) {
  const renderEventCard = ({ item }: { item: EventData }) => (
    <EventCard
      event={item}
      onPress={onEventPress}
      onFavoritePress={onFavoritePress}
    />
  );

  const renderFooter = () => {
    if (!loading) return null;
    
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#E91E63" />
      </View>
    );
  };

  const handleLoadMore = () => {
    if (hasMore && !loading && onLoadMore) {
      onLoadMore();
    }
  };

  return (
    <FlatList
      data={events}
      renderItem={renderEventCard}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 20,
      }}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#E91E63"
            colors={['#E91E63']}
          />
        ) : undefined
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderFooter}
      removeClippedSubviews={true}
      maxToRenderPerBatch={5}
      windowSize={10}
      initialNumToRender={3}
    />
  );
}