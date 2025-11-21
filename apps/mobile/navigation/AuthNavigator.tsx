import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import TermsAndConditions from '../screens/auth/TermsAndConditions';
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';
import { Booklet, CategoryQuestionsScreen, Conclusion, CountrySetupScreen, DocumentVerification, IDScanScreen, OrderAnswersScreen, RelationshipExperience, TrapAnswers, TrapsPreparation, WelcomePsychological, WelcomeQuestionnaire } from '../screens/auth';
import VerifyIndentity from '../screens/auth/VerifyIdentityScreen';
import ChooseVerify from '../screens/auth/ChooseVerifyScreen';
import VerifiedSuccess from '../screens/auth/VerifiedSuccessScreen';
import VerificationFailed from '../screens/auth/VerificationFailedScreen';
import SpoonedQuestionnaire from '../screens/auth/questionnaire/SpoonedQuestionnaire';
import EarlyInfluences from '../screens/auth/psychological/EarlyInfluences';

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
  //
  WelcomeQuestionnaire: undefined;
  SpoonedQuestionnaire: undefined;
  CategoryQuestions: undefined;
  OrderAnswers: undefined;
  //
  WelcomePsychological: undefined;
  EarlyInfluences: undefined;
  TrapsPreparation: undefined;
  RelationshipExperience: undefined;
  TrapAnswers: undefined;
  Conclusion: undefined;
  Booklet: undefined;
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
      <Stack.Screen name="WelcomeQuestionnaire" component={WelcomeQuestionnaire} />
      <Stack.Screen name="SpoonedQuestionnaire" component={SpoonedQuestionnaire} />
      <Stack.Screen name="CategoryQuestions" component={CategoryQuestionsScreen} />
      <Stack.Screen name='OrderAnswers' component={OrderAnswersScreen} />

      <Stack.Screen name='WelcomePsychological' component={WelcomePsychological} />
      <Stack.Screen name='EarlyInfluences' component={EarlyInfluences} />
      <Stack.Screen name='TrapsPreparation' component={TrapsPreparation} />
      <Stack.Screen name="RelationshipExperience" component={RelationshipExperience} />
      <Stack.Screen name="TrapAnswers" component={TrapAnswers} />
      <Stack.Screen name="Conclusion" component={Conclusion} />
      <Stack.Screen name="Booklet" component={Booklet} />
    </Stack.Navigator>
  );
}