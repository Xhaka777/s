import { useMutation, useQuery, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { authService } from '../services/auth';
import {
  SignUpRequest,
  SignUpResponse,
  SignInRequest,
  SignInResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  SendPhoneVerification,
  VerifyPhone,
  PhoneVerificationResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ValidateSessionRequest,
  ValidateSessionResponse,
  FirebaseAuthRequest,
  FirebaseAuthResponse,
  LogoutRequest,
  LogoutResponse,
  ChangePasswordRequest,
  CheckEmailAvailability,
  CheckPhoneAvailability,
  AvailabilityResponse,
} from '../schema/auth';
import { SuccessResponse } from '../schema/common';
import { User } from '../schema/user';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'currentUser'] as const,
  validateSession: (token: string) => [...authKeys.all, 'validateSession', token] as const,
} as const;

// Mutations

// Sign Up
export const useSignUp = (
  options?: UseMutationOptions<SignUpResponse, Error, SignUpRequest>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SignUpRequest) => authService.signUp(data),
    onSuccess: (data) => {
      // Invalidate and refetch current user
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
      queryClient.setQueryData(authKeys.currentUser(), data.user);
    },
    ...options,
  });
};

// Sign In
export const useSignIn = (
  options?: UseMutationOptions<SignInResponse, Error, SignInRequest>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SignInRequest) => authService.signIn(data),
    onSuccess: (data) => {
      // Set current user data
      queryClient.setQueryData(authKeys.currentUser(), data.user);
    },
    ...options,
  });
};

// Firebase Sign In
export const useFirebaseSignIn = (
  options?: UseMutationOptions<FirebaseAuthResponse, Error, FirebaseAuthRequest>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: FirebaseAuthRequest) => authService.signInWithFirebase(data),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.currentUser(), data.user);
    },
    ...options,
  });
};

// Send Phone Verification
export const useSendPhoneVerification = (
  options?: UseMutationOptions<SuccessResponse, Error, SendPhoneVerification>
) => {
  return useMutation({
    mutationFn: (data: SendPhoneVerification) => authService.sendPhoneVerification(data),
    ...options,
  });
};

// Verify Phone
export const useVerifyPhone = (
  options?: UseMutationOptions<PhoneVerificationResponse, Error, VerifyPhone>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: VerifyPhone) => authService.verifyPhone(data),
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData(authKeys.currentUser(), data.user);
      }
    },
    ...options,
  });
};

// Forgot Password
export const useForgotPassword = (
  options?: UseMutationOptions<ForgotPasswordResponse, Error, ForgotPasswordRequest>
) => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authService.forgotPassword(data),
    ...options,
  });
};

// Reset Password
export const useResetPassword = (
  options?: UseMutationOptions<SuccessResponse, Error, ResetPasswordRequest>
) => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
    ...options,
  });
};

// Change Password
export const useChangePassword = (
  options?: UseMutationOptions<SuccessResponse, Error, ChangePasswordRequest>
) => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authService.changePassword(data),
    ...options,
  });
};

// Refresh Token
export const useRefreshToken = (
  options?: UseMutationOptions<RefreshTokenResponse, Error, RefreshTokenRequest>
) => {
  return useMutation({
    mutationFn: (data: RefreshTokenRequest) => authService.refreshToken(data),
    ...options,
  });
};

// Logout
export const useLogout = (
  options?: UseMutationOptions<LogoutResponse, Error, LogoutRequest | undefined>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data?: LogoutRequest) => authService.logout(data),
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
    },
    ...options,
  });
};

// Logout All Devices
export const useLogoutAllDevices = (
  options?: UseMutationOptions<SuccessResponse, Error, void>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => authService.logoutAllDevices(),
    onSuccess: () => {
      queryClient.clear();
    },
    ...options,
  });
};

// Check Email Availability
export const useCheckEmailAvailability = (
  options?: UseMutationOptions<AvailabilityResponse, Error, CheckEmailAvailability>
) => {
  return useMutation({
    mutationFn: (data: CheckEmailAvailability) => authService.checkEmailAvailability(data),
    ...options,
  });
};

// Check Phone Availability
export const useCheckPhoneAvailability = (
  options?: UseMutationOptions<AvailabilityResponse, Error, CheckPhoneAvailability>
) => {
  return useMutation({
    mutationFn: (data: CheckPhoneAvailability) => authService.checkPhoneAvailability(data),
    ...options,
  });
};

// Queries

// Get Current User
export const useCurrentUser = (
  options?: UseQueryOptions<User, Error>
) => {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: () => authService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    ...options,
  });
};

// Validate Session
export const useValidateSession = (
  token: string,
  options?: UseQueryOptions<ValidateSessionResponse, Error>
) => {
  return useQuery({
    queryKey: authKeys.validateSession(token),
    queryFn: () => authService.validateSession({ session_token: token }),
    enabled: !!token,
    staleTime: 1 * 60 * 1000, // 1 minute
    ...options,
  });
};

// Custom hooks for common patterns

// Check if user is authenticated
export const useIsAuthenticated = () => {
  const { data: user, isLoading, error } = useCurrentUser({
    retry: false,
    staleTime: 0,
  });

  return {
    isAuthenticated: !!user && !error,
    isLoading,
    user,
  };
};

// Auto refresh token when needed
export const useAutoRefresh = () => {
  const refreshMutation = useRefreshToken();
  
  // This could be enhanced with a timer or response interceptor
  // to automatically refresh tokens when they're about to expire
  
  return refreshMutation;
};

// Combined sign in/up flow
export const useAuthFlow = () => {
  const signUpMutation = useSignUp();
  const signInMutation = useSignIn();
  const firebaseSignInMutation = useFirebaseSignIn();
  const logoutMutation = useLogout();
  
  return {
    signUp: signUpMutation,
    signIn: signInMutation,
    firebaseSignIn: firebaseSignInMutation,
    logout: logoutMutation,
    isLoading: signUpMutation.isPending || signInMutation.isPending || firebaseSignInMutation.isPending,
  };
};

// Phone verification flow
export const usePhoneVerificationFlow = () => {
  const sendVerificationMutation = useSendPhoneVerification();
  const verifyPhoneMutation = useVerifyPhone();
  
  return {
    sendVerification: sendVerificationMutation,
    verifyPhone: verifyPhoneMutation,
    isLoading: sendVerificationMutation.isPending || verifyPhoneMutation.isPending,
  };
};

// Password reset flow
export const usePasswordResetFlow = () => {
  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();
  
  return {
    forgotPassword: forgotPasswordMutation,
    resetPassword: resetPasswordMutation,
    isLoading: forgotPasswordMutation.isPending || resetPasswordMutation.isPending,
  };
};