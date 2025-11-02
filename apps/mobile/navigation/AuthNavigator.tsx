import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import TermsAndConditions from '../screens/auth/TermsAndConditions';
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';
import { CountrySetupScreen, DocumentVerification, IDScanScreen } from '../screens/auth';
import VerifyIndentity from '../screens/auth/VerifyIdentityScreen';
import ChooseVerify from '../screens/auth/ChooseVerifyScreen';
import VerifiedSuccess from '../screens/auth/VerifiedSuccessScreen';
import VerificationFailed from '../screens/auth/VerificationFailedScreen';

export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  TermsAndConditions: undefined;
  ProfileSetup: undefined;
  CountrySetup: undefined;
  VerifyIdentity: undefined;
  ChooseVerify: undefined;
  IDScan: undefined;
  DocumentationVerification: undefined;
  VerifiedSuccess: undefined;
  VerificationFailed: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="CountrySetup" component={CountrySetupScreen} />
      <Stack.Screen name="VerifyIdentity" component={VerifyIndentity} />
      <Stack.Screen name="ChooseVerify" component={ChooseVerify} />
      <Stack.Screen name="IDScan" component={IDScanScreen} />
      <Stack.Screen name="DocumentationVerification" component={DocumentVerification} />
      <Stack.Screen name="VerifiedSuccess" component={VerifiedSuccess} />
      <Stack.Screen name="VerificationFailed" component={VerificationFailed} />
    </Stack.Navigator>
  );
}
