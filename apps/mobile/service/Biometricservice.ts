import ReactNativeBiometrics from 'react-native-biometrics';
import { Platform, Alert } from 'react-native';

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: true, // Allow fallback to device passcode
});

export interface BiometricResult {
  success: boolean;
  error?: string;
  biometryType?: string;
}

class BiometricService {
  /**
   * Check if biometric authentication is available
   */
  async checkBiometricAvailability(): Promise<{
    available: boolean;
    biometryType: string | null;
    error?: string;
  }> {
    try {
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      
      console.log('Biometric availability:', { available, biometryType });
      
      return {
        available,
        biometryType,
      };
    } catch (error) {
      console.log('Error checking biometric availability:', error);
      return {
        available: false,
        biometryType: null,
        error: 'Failed to check biometric availability',
      };
    }
  }

  /**
   * Prompt for biometric authentication
   */
  async authenticate(promptMessage: string = 'Authenticate with Face ID'): Promise<BiometricResult> {
    try {
      // First check if biometrics are available
      const availability = await this.checkBiometricAvailability();
      
      if (!availability.available) {
        return {
          success: false,
          error: 'Biometric authentication not available on this device',
        };
      }

      // Prompt for authentication
      const result = await rnBiometrics.simplePrompt({
        promptMessage,
        cancelButtonText: 'Cancel',
      });

      console.log('Biometric authentication result:', result);

      if (result.success) {
        return {
          success: true,
          biometryType: availability.biometryType || undefined,
        };
      } else {
        return {
          success: false,
          error: result.error || 'Authentication failed',
        };
      }
    } catch (error) {
      console.log('Biometric authentication error:', error);
      return {
        success: false,
        error: 'Authentication process failed',
      };
    }
  }

  /**
   * Show appropriate error message based on the error
   */
  handleAuthenticationError(error: string) {
    let title = 'Authentication Failed';
    let message = error;

    if (error.includes('UserCancel') || error.includes('cancelled')) {
      title = 'Authentication Cancelled';
      message = 'Authentication was cancelled by user';
    } else if (error.includes('UserFallback')) {
      title = 'Authentication Failed';
      message = 'Please try again or use your device passcode';
    } else if (error.includes('SystemCancel')) {
      title = 'System Error';
      message = 'Authentication was interrupted by system';
    } else if (error.includes('TouchIDNotAvailable') || error.includes('FaceIDNotAvailable')) {
      title = 'Biometrics Not Available';
      message = 'Biometric authentication is not available on this device';
    }

    Alert.alert(title, message, [{ text: 'OK' }]);
  }

  /**
   * Get user-friendly biometry type name
   */
  getBiometryDisplayName(biometryType: string | null): string {
    switch (biometryType) {
      case 'FaceID':
        return 'Face ID';
      case 'TouchID':
        return 'Touch ID';
      case 'Biometrics':
        return Platform.OS === 'android' ? 'Fingerprint' : 'Biometrics';
      default:
        return 'Biometric Authentication';
    }
  }
}

export const biometricService = new BiometricService();