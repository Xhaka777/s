import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import TermsAndConditions from '../screens/auth/TermsAndConditions';
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';
import { Booklet, CategoryQuestionsScreen, Conclusion, CountrySetupScreen, DocumentVerification, EmailVerification, IDScanScreen, OrderAnswersScreen, PsychologicalChat, RelationshipExperience, TrapAnswers, TrapsPreparation, UploadPhoto, WelcomePsychological, WelcomeQuestionnaire } from '../screens/auth';
import VerifyIndentity from '../screens/auth/veriff/VerifyIdentityScreen';
import ChooseVerify from '../screens/auth/veriff/ChooseVerifyScreen';
import VerifiedSuccess from '../screens/auth/veriff/VerifiedSuccessScreen';
import VerificationFailed from '../screens/auth/veriff/VerificationFailedScreen';
import SpoonedQuestionnaire from '../screens/auth/questionnaire/SpoonedQuestionnaire';
import EarlyInfluences from '../screens/auth/psychological/EarlyInfluences';
import { useOnboardingStatus } from '../api/hooks/useOnboardingStatus';
import { useNavigation } from '@react-navigation/native';

export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  TermsAndConditions: undefined;
  //User information required
  ProfileSetup: undefined;
  CountrySetup: undefined;
  //Veriff verification required
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
  PsychologicalChat: undefined;
  //
  EmailVerification: undefined;
  UploadPhoto: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const getScreenNameForStep = (step: number): keyof AuthStackParamList | null => {
  switch (step) {
    case 1:
      return 'SignUp';
    case 2:
      return 'ProfileSetup';
    case 3:
      return 'VerifyIdentity';
    case 4:
      return 'WelcomeQuestionnaire';
    case 5:
      return 'WelcomePsychological';
    case 6:
      return 'EmailVerification';
    case 0:
      return null;
    default:
      return 'Welcome';
  }
}

export default function AuthNavigator() {
  const navigation = useNavigation();
  const { data: onboardingStatus, isLoading } = useOnboardingStatus();

  useEffect(() => {
    if (!isLoading && onboardingStatus) {
      if (onboardingStatus.onbordingCompleted) {
        // Navigate to main app
        // This should be handled by RootNavigator
        return;
      }

      if (onboardingStatus.onboarding) {
        const currentStep = Math.floor(onboardingStatus.onboarding.status);
        const targetScreen = getScreenNameForStep(currentStep);

        if (targetScreen) {
          //Use a timeout to ensure navigation is ready
          setTimeout(() => {
            navigation.navigate(targetScreen as never);
          }, 100);
        }
      }

    }
  }, [onboardingStatus, isLoading, navigation]);

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
      <Stack.Screen name="PsychologicalChat" component={PsychologicalChat} />
      <Stack.Screen name="EmailVerification" component={EmailVerification} />
      <Stack.Screen name="UploadPhoto" component={UploadPhoto} />
    </Stack.Navigator>
  );
}