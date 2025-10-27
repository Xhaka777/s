import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Check } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/AuthNavigator';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import Union from '../../components/svg/Union';
import { GlowBackground } from '../../components';

type TermsAndConditionsScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'TermsAndConditions'
>;

interface TermsAndConditionsProps {
  onAccept?: () => void;
  onDecline?: () => void;
}

export default function TermsAndConditions({
  onAccept,
  onDecline,
}: TermsAndConditionsProps) {
  const navigation = useNavigation<TermsAndConditionsScreenNavigationProp>();
  const [isAccepted, setIsAccepted] = useState(false);

  const handleAccept = () => {
    if (isAccepted) {
      onAccept?.();
      navigation.goBack();
    }
  };

  const handleDecline = () => {
    onDecline?.();
    navigation.goBack();
  };

  const toggleAcceptance = () => {
    setIsAccepted(!isAccepted);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <Svg height="50%" width="100%" style={styles.gradient}>
        <Defs>
          <RadialGradient
            id="pinkGlow"
            cx="0%" cy="10%" r="90%"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#ff3c8c" stopOpacity="0.5" />
            <Stop offset="100%" stopColor="#000" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#pinkGlow)" />
      </Svg>
      
      <View style={styles.unionContainer}>
        <Union />
      </View>
      
      <View style={styles.glowContainer}>
        <GlowBackground width={242} height={218} />
      </View>
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#FFFFFF" strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Terms & Conditions</Text>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Introduction */}
          <View style={styles.introSection}>
            {/* <Text style={styles.introText}> */}
            <Text className='text-white text-lg'>
                
              Please read and accept to continue with Spooned.
            </Text>
          </View>

          {/* Terms sections */}
          <View style={styles.termsSection}>
            <View style={styles.termItem}>
              <Text style={styles.termTitle}>Account Usage</Text>
              <Text style={styles.termDescription}>
                Use Spooned responsibly, respect all users, and avoid harmful actions.
              </Text>
            </View>

            <View style={styles.termItem}>
              <Text style={styles.termTitle}>Content Ownership</Text>
              <Text style={styles.termDescription}>
                Your content is yours. Uploading grants us rights to display it.
              </Text>
            </View>

            <View style={styles.termItem}>
              <Text style={styles.termTitle}>User Conduct</Text>
              <Text style={styles.termDescription}>
                Engage responsibly. Abuse and unauthorized content are not allowed.
              </Text>
            </View>

            <View style={styles.termItem}>
              <Text style={styles.termTitle}>Termination</Text>
              <Text style={styles.termDescription}>
                Violations may lead to account suspension, including abuse or unauthorized use.
              </Text>
            </View>

            <View style={styles.termItem}>
              <Text style={styles.termTitle}>Changes to Terms</Text>
              <Text style={styles.termDescription}>
                Terms may be updated. We'll notify you of changes for your review.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom section with checkbox and buttons */}
        <View style={styles.bottomSection}>
          {/* Checkbox */}
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={toggleAcceptance}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, isAccepted && styles.checkboxChecked]}>
              {isAccepted && (
                <Check size={12} color="#FFFFFF" strokeWidth={2.5} />
              )}
            </View>
            <Text style={styles.checkboxText}>
              I have agree to the Terms & Conditions
            </Text>
          </TouchableOpacity>

          {/* Accept button */}
          <TouchableOpacity
            style={[
              styles.acceptButton,
              !isAccepted && styles.acceptButtonDisabled
            ]}
            onPress={handleAccept}
            disabled={!isAccepted}
            activeOpacity={0.8}
          >
            <Text style={styles.acceptButtonText}>Accept & Continue</Text>
          </TouchableOpacity>

          {/* Decline button */}
          <TouchableOpacity
            style={styles.declineButton}
            onPress={handleDecline}
            activeOpacity={0.8}
          >
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  unionContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
  },
  glowContainer: {
    position: 'absolute',
    top: -66,
    left: -93,
    width: 242,
    height: 218,
    zIndex: 3,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    gap: 16,
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  introSection: {
    marginBottom: 24,
  },
  introText: {
    fontSize: 16,
    color: '#999999',
    lineHeight: 24,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  termsSection: {
    gap: 24,
  },
  termItem: {
    gap: 8,
  },
  termTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 24,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  termDescription: {
    fontSize: 14,
    color: '#999999',
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  bottomSection: {
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 0 : 16,
    gap: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#B8457B',
    borderColor: '#B8457B',
  },
  checkboxText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  acceptButton: {
    height: 56,
    backgroundColor: '#B8457B',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  acceptButtonDisabled: {
    opacity: 0.4,
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  declineButton: {
    height: 56,
    backgroundColor: 'transparent',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  declineButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#B8457B',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});