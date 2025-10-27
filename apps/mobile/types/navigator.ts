import type { NavigatorScreenParams } from '@react-navigation/native';
import type { AuthStackParamList } from '../navigation/AuthNavigator';
import type { OnboardingStackParamList } from '../navigation/OnboardingNavigator';
import type { MainTabParamList } from '../navigation/MainNavigator';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
