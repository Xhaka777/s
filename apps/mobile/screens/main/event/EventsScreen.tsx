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
import { Button, SecUnion, ThirdUnion } from "../../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import NoEventsAvailable from "../../../components/NoEventsAvailable";
import CategoryTabs from "../../../components/CategoryTabs";
import EventsList from "../../../components/EventList";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../../../navigation/MainNavigator";
import { useNavigation } from "@react-navigation/native";

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

interface Category {
  id: string;
  name: string;
}

type EventsScreenNavigationProp = StackNavigationProp<MainStackParamList>;

export default function EventsScreen() {
  const navigation = useNavigation<EventsScreenNavigationProp>();

  // Mock data - replace with your actual data fetching logic
  const [events, setEvents] = useState<EventData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Mock data for demonstration - replace with your API calls
  const mockCategories: Category[] = [
    { id: 'all', name: 'All' },
    { id: 'dining', name: 'Dining' },
    { id: 'culture', name: 'Culture' },
    { id: 'wellness', name: 'Wellness' },
    { id: 'sport', name: 'Sport' },
  ];

  const mockEvents: EventData[] = [
    {
      id: '1',
      title: 'Michelin Star Tasting Menu',
      location: 'Basel',
      date: 'December 15',
      time: '20:00',
      price: '180',
      currency: 'CHF',
      image: require('../../../assets/images/event_demo.png'),
      category: 'Dining',
      isFavorite: false,
    },
    {
      id: '2',
      title: 'Michelin Star Tasting Menu',
      location: 'Basel',
      date: 'December 15',
      time: '20:00',
      price: '180',
      currency: 'CHF',
      image: require('../../../assets/images/event_demo.png'),
      category: 'Dining',
      isFavorite: false,
    },
    {
      id: '3',
      title: 'Michelin Star Tasting Menu',
      location: 'Basel',
      date: 'December 15',
      time: '20:00',
      price: '180',
      currency: 'CHF',
      image: require('../../../assets/images/event_demo.png'),
      category: 'Dining',
      isFavorite: false,
    },
    // Add more mock events as needed
  ];

  useEffect(() => {
    // Initialize with mock data
    setCategories(mockCategories);
    // Comment out the line below to show the NoEventsAvailable component
    setEvents(mockEvents);
  }, []);

  const handleNotifyPress = () => {
    console.log('User wants to be notified about new events');
    // Handle notification logic here
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Filter events based on selected category
    // This is where you'd typically make an API call or filter local data
  };

  const handleEventPress = (event: EventData) => {
    console.log('Event pressed:', event);
    // Navigate to event details screen
    navigation.navigate('EventDetail', { eventId: event.id })

  };

  const handleFavoritePress = (eventId: string) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId
          ? { ...event, isFavorite: !event.isFavorite }
          : event
      )
    );
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const hasEvents = events.length > 0;

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
        {/* Header */}
        <View className="flex-row items-center justify-between pt-5 pb-6 px-5">
          <Image
            source={require('../../../assets/images/spooned.png')}
            className="w-[140px] h-[50px]"
            resizeMode="contain"
          />

          <View className="flex-row items-center gap-4">
            <TouchableOpacity>
              <Image
                source={require('../../../assets/icons/notification.png')}
                className="w-[38px] h-[38px]"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={require('../../../assets/icons/filter.png')}
                className="w-[38px] h-[38px]"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Title Section */}
        <View className="mb-6 px-5">
          <Text className="text-white text-3xl font-PoppinsBold mb-2">
            Available Events
          </Text>
          <Text className="text-gray-400 text-lg">
            Book your seat at exclusive experiences
          </Text>
        </View>

        {hasEvents ? (
          <>
            {/* Category Tabs */}
            <CategoryTabs
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />

            {/* Events List */}
            <View className="flex-1 px-5">
              <EventsList
                events={events}
                onEventPress={handleEventPress}
                onFavoritePress={handleFavoritePress}
                onRefresh={handleRefresh}
                refreshing={refreshing}
                loading={loading}
              />
            </View>
          </>
        ) : (
          <ScrollView
            className="flex-1 px-5"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <NoEventsAvailable onNotifyPress={handleNotifyPress} />
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}