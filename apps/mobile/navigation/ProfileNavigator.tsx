import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/main/profile/ProfileScreen";
import EditProfileScreen from "../screens/main/profile/EditProfileScreen";
import ChangeLocationScreen from "../screens/main/profile/ChangeLocationScreen";


export type ProfileStackParamList = {
    ProfileMain: undefined;
    EditProfile: undefined;
    Settings: undefined;
    ChangeLocation: undefined;
}

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: '#000' }
            }}
        >
            <Stack.Screen name="ProfileMain" component={ProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="ChangeLocation" component={ChangeLocationScreen} />
            {/* <Stack.Screen name="Settings" component={SettingsScreen} /> */}
        </Stack.Navigator>
    )
}