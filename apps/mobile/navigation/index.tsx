export { default as RootNavigator } from './RootNavigator';
export { default as AuthNavigator } from './AuthNavigator';
export { default as MainNavigator } from './MainNavigator';
export { default as ProfileNavigator } from './ProfileNavigator'; // Add this line

export type { AuthStackParamList } from './AuthNavigator';
export type { MainTabParamList, MainStackParamList } from './MainNavigator'; // Add MainStackParamList
export type { RootStackParamList } from './RootNavigator';
export type { ProfileStackParamList } from './ProfileNavigator'; // Add this line