import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Platform } from 'react-native';
import { Home, Calendar, MessageCircle, User } from 'lucide-react-native';
import HomeScreen from '../screens/main/HomeScreen';
import EventsScreen from '../screens/main/EventsScreen';
import ChatScreen from '../screens/main/ChatScreen';
// import ProfileScreen from '../screens/main/profile/ProfileScreen';
import ProfileNavigator from './ProfileNavigator';

export type MainTabParamList = {
  Home: undefined;
  Events: undefined;
  Chat: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#B8457B',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        tabBarIcon: ({ focused, color, size }) => {
          const iconSize = 24;
          
          switch (route.name) {
            case 'Home':
              return <Home size={iconSize} color={color} strokeWidth={focused ? 2 : 1.5} />;
            case 'Events':
              return <Calendar size={iconSize} color={color} strokeWidth={focused ? 2 : 1.5} />;
            case 'Chat':
              return <MessageCircle size={iconSize} color={color} strokeWidth={focused ? 2 : 1.5} />;
            case 'Profile':
              return <User size={iconSize} color={color} strokeWidth={focused ? 2 : 1.5} />;
            default:
              return <Home size={iconSize} color={color} strokeWidth={focused ? 2 : 1.5} />;
          }
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

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    backgroundColor: '#1C1C1E',
    borderTopWidth: 1,
    borderTopColor: '#333333',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabBarItem: {
    paddingVertical: 4,
  },
});