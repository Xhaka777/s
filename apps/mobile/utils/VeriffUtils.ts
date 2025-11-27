import AsyncStorage from '@react-native-async-storage/async-storage';

// Veriff status constants
export const VERIFF_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  APPROVED: 'approved',
  DECLINED: 'declined',
  EXPIRED: 'expired',
  ABANDONED: 'abandoned',
} as const;

// Veriff result status constants  
export const VERIFF_RESULT_STATUS = {
  DONE: 'DONE',
  CANCELED: 'CANCELED', 
  ERROR: 'ERROR',
} as const;

// Storage keys
const STORAGE_KEYS = {
  VERIFF_SESSION_ID: '@veriff_session_id',
  VERIFICATION_STATUS: '@verification_status',
} as const;

// Veriff utility functions
export const VeriffUtils = {
  // Save Veriff session ID to AsyncStorage
  saveSessionId: async (sessionId: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.VERIFF_SESSION_ID, sessionId);
    } catch (error) {
      console.error('Failed to save Veriff session ID:', error);
    }
  },

  // Get Veriff session ID from AsyncStorage
  getSessionId: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.VERIFF_SESSION_ID);
    } catch (error) {
      console.error('Failed to get Veriff session ID:', error);
      return null;
    }
  },

  // Clear Veriff session ID
  clearSessionId: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.VERIFF_SESSION_ID);
    } catch (error) {
      console.error('Failed to clear Veriff session ID:', error);
    }
  },

  // Save verification status
  saveVerificationStatus: async (status: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.VERIFICATION_STATUS, status);
    } catch (error) {
      console.error('Failed to save verification status:', error);
    }
  },

  // Get verification status
  getVerificationStatus: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.VERIFICATION_STATUS);
    } catch (error) {
      console.error('Failed to get verification status:', error);
      return null;
    }
  },

  // Check if verification is complete
  isVerificationComplete: (status: string): boolean => {
    return status === VERIFF_STATUS.APPROVED || status === VERIFF_STATUS.DECLINED;
  },

  // Check if verification is in progress
  isVerificationInProgress: (status: string): boolean => {
    return status === VERIFF_STATUS.PENDING || status === VERIFF_STATUS.PROCESSING;
  },

  // Get status display text
  getStatusDisplayText: (status: string): string => {
    switch (status) {
      case VERIFF_STATUS.PENDING:
        return 'Verification pending...';
      case VERIFF_STATUS.PROCESSING:
        return 'Processing verification...';
      case VERIFF_STATUS.APPROVED:
        return 'Verification approved';
      case VERIFF_STATUS.DECLINED:
        return 'Verification declined';
      case VERIFF_STATUS.EXPIRED:
        return 'Verification expired';
      case VERIFF_STATUS.ABANDONED:
        return 'Verification abandoned';
      default:
        return 'Unknown status';
    }
  },

  // Get status color for UI
  getStatusColor: (status: string): string => {
    switch (status) {
      case VERIFF_STATUS.PENDING:
      case VERIFF_STATUS.PROCESSING:
        return '#FCD34D'; // Yellow
      case VERIFF_STATUS.APPROVED:
        return '#10B981'; // Green
      case VERIFF_STATUS.DECLINED:
      case VERIFF_STATUS.EXPIRED:
      case VERIFF_STATUS.ABANDONED:
        return '#EF4444'; // Red
      default:
        return '#6B7280'; // Gray
    }
  },

  // Create Veriff configuration
  createVeriffConfig: (sessionId: string, locale: string = 'en', theme: string = 'dark') => ({
    sessionId,
    locale,
    theme,
    // Add any other configuration options you need
  }),
};

// Type definitions
export type VeriffStatus = typeof VERIFF_STATUS[keyof typeof VERIFF_STATUS];
export type VeriffResultStatus = typeof VERIFF_RESULT_STATUS[keyof typeof VERIFF_RESULT_STATUS];

export interface VeriffResult {
  status: VeriffResultStatus;
  error?: string;
  sessionId?: string;
}

export interface VeriffConfig {
  sessionId: string;
  locale?: string;
  theme?: string;
}