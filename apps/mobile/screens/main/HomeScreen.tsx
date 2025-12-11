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
import { ArrowLeft, CheckSquare, Shield } from "lucide-react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import LinearGradient from 'react-native-linear-gradient';
import NoUpcomingEvents from "../../components/NoUpcomingEvents";
import UpcomingEventsList from "../../components/UpcomingEventsList";
import { Event } from "../../components/UpcomingEventCard";
import StatsCard from "../../components/StatsCard";
import MembershipCard from "../../components/Membershipcard";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();
  //
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);

  // Dummy data for upcoming events
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Wine & Dine at Clouds',
      location: 'Zurich',
      date: 'Dec 1',
      time: '19:00',
      image: require('../../assets/icons/wine-dine-event.png'),
    },
    {
      id: '2',
      title: 'Wine & Dine at Clouds',
      location: 'Zurich',
      date: 'Dec 1',
      time: '19:00',
      image: require('../../assets/icons/wine-dine-event.png'), // Replace with your actual image
    }
  ]);

  // Toggle this to test both states
  // Set to empty array to test NoUpcomingEvents component
  // const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  const handleEventPress = (event: Event) => {
    console.log('Event pressed:', event.title);
    // Navigate to event details screen
  };

  const handleViewAllEvents = () => {
    console.log('View all events pressed');
    // Navigate to events list screen
  };

  const handleViewAvailableEvents = () => {
    console.log('View available events pressed');
    // Navigate to browse events screen
  };

  const handleViewPlans = () => {
    console.log('View plans pressed');
    navigation.navigate('SubscriptionPlans' as never);

    // Navigate to subscription plans screen
  };

  const handleNotificationPress = () => {
    navigation.navigate('Notifications' as never);
  };

  const handleFilterPress = () => {
    navigation.navigate('Settings' as never);
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
            left: 6,           // X position from Figma
            top: -104,         // Y position from Figma  
            width: 524,        // Width from Figma
            height: 237,       // Height from Figma
            transform: [{ rotate: '20deg' }], // No rotation
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
          {/* Header */}
          <View className="flex-row items-center justify-between pt-5 pb-8">
            <Image
              source={require('../../assets/images/spooned.png')}
              className="w-[140px] h-[50px]"
              resizeMode="contain"
            />

            <View className="flex-row items-center gap-4">
              <TouchableOpacity onPress={handleNotificationPress}>
                <Image
                  source={require('../../assets/icons/notification.png')}
                  className="w-[38px] h-[38px]"
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleFilterPress}>
                <Image
                  source={require('../../assets/icons/filter.png')}
                  className="w-[38px] h-[38px]"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Welcome Section */}
          <View className="mb-6">
            <Text className="text-white text-3xl font-bold mb-2">Welcome Sofia</Text>
            <Text className="text-gray-400 text-lg">Discover exciting events nearby</Text>
          </View>

          <MembershipCard
            hasSubscription={hasSubscription}
            subscriptionEndDate="DEc 31, 2026"
            onViewPlans={handleViewPlans}
          />

          {/* My Upcoming Events Section */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white text-xl font-bold">My Upcoming Events</Text>
              {upcomingEvents.length > 0 && (
                <TouchableOpacity onPress={handleViewAllEvents}>
                  <Text className="text-pink-400 font-medium">View All</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Dynamic content based on events availability */}
            {upcomingEvents.length > 0 ? (
              <UpcomingEventsList
                events={upcomingEvents}
                onEventPress={handleEventPress}
              />
            ) : (
              <NoUpcomingEvents
                onViewEvents={handleViewAvailableEvents}
              />
            )}
          </View>

          <View className="flex-row gap-4 mb-6">
            <StatsCard
              icon={require('../../assets/icons/empty_heart.png')}
              count={upcomingEvents.length}
              label="Events Booked"
              onPress={() => {

              }}
            />

            <StatsCard
              icon={require('../../assets/icons/multiple_persons.png')}
              count={5}
              label="Connections Made"
              onPress={() => {
                //
              }}
            />
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}