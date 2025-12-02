import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Platform, Image } from 'react-native';
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