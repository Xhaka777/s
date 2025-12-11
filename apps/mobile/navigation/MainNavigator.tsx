import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Platform, Image } from 'react-native';
import { Home, Calendar, MessageCircle, User } from 'lucide-react-native';
import HomeScreen from '../screens/main/HomeScreen';
import EventsScreen from '../screens/main/event/EventsScreen';
import ChatScreen from '../screens/main/ChatScreen';
import Notifications from '../screens/main/Notifications';
import ProfileNavigator from './ProfileNavigator';
import Settings from '../screens/main/settings/Settings';
import SubscriptionPlans from '../screens/main/settings/SubscriptionPlans';
import EventDetail from '../screens/main/event/EventDetail';
import EventGallery from '../screens/main/event/EventGallery';
import OrganizerProfile from '../screens/main/event/OrganizerProfile';
import BookingConfirmation from '../screens/main/event/BookingConfirmation';
import Waitlist from '../screens/main/event/Waitlist';
import CancelBooking from '../screens/main/event/CancelBooking';
import CancellationSuccess from '../screens/main/event/CancellationSuccess';
import EventCancelled from '../screens/main/event/EventCancelled';
import SuccessfullyChecked from '../screens/main/event/SuccessfullyChecked';
import MarkedNoShow from '../screens/main/event/MarkedNoShow';

export type MainTabParamList = {
  Home: undefined;
  Events: undefined;
  Chat: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  Notifications: undefined;
  //
  Settings: undefined;
  SubscriptionPlans: undefined;
  EventDetail: { eventId: string };
  EventGallery: { images: string[]; initialIndex?: number; eventTitle?: string };
  OrganizerProfile: { organizerId: string };
  BookingConfirmation: { eventId: string; bookingId: string };
  Waitlist: { eventId: string; waitlistId: string };
  CancelBooking: undefined;
  CancellationSuccess: undefined;
  EventCancelled: undefined;
  SuccessfullyChecked: undefined;
  MarkedNoShow: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<MainStackParamList>();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#B8457B',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused, color, size }) => {
          const iconSize = 24;
          let iconSource;

          switch (route.name) {
            case 'Home':
              iconSource = require('../assets/icons/home.png');
              break;
            case 'Events':
              iconSource = require('../assets/icons/events.png');
              break;
            case 'Chat':
              iconSource = require('../assets/icons/chat.png');
              break;
            case 'Profile':
              iconSource = require('../assets/icons/profile.png');
              break;
            default:
              iconSource = require('../assets/icons/home.png');
              break;
          }

          return (
            <Image
              source={iconSource}
              style={[
                styles.tabBarIcon,
                {
                  width: iconSize,
                  height: iconSize,
                  tintColor: color,
                  opacity: focused ? 1 : 0.7,
                }
              ]}
              resizeMode="contain"
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventsScreen}
        options={{
          tabBarLabel: 'Events',
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: 'Chat',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'card',
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
      />
      <Stack.Screen
        name='EventDetail'
        component={EventDetail}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='EventGallery'
        component={EventGallery}
        options={{
          headerShown: false,
          // presentation: 'modal'
        }}
      />
      <Stack.Screen
        name='OrganizerProfile'
        component={OrganizerProfile}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='BookingConfirmation'
        component={BookingConfirmation}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='Waitlist'
        component={Waitlist}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='CancelBooking'
        component={CancelBooking}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='CancellationSuccess'
        component={CancellationSuccess}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EventCancelled"
        component={EventCancelled}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='SuccessfullyChecked'
        component={SuccessfullyChecked}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='MarkedNoShow'
        component={MarkedNoShow}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{
          headerShown: false,
          headerTitle: 'Notifications',
          headerStyle: {
            backgroundColor: '#000000',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: false,
          headerTitle: 'Settings',
          headerStyle: {
            backgroundColor: '#000000',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="SubscriptionPlans"
        component={SubscriptionPlans}
        options={{
          headerShown: false,
          headerTitle: 'Subscription Plans',
          headerStyle: {
            backgroundColor: '#000000',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 34 : 20,
    left: 20,
    right: 20,
    height: 70,
    backgroundColor: '#312E36',
    borderRadius: 35,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#333333',
    marginLeft: 10,
    marginRight: 10,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  tabBarItem: {
    paddingVertical: 4,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});