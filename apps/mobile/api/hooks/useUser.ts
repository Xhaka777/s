import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  useInfiniteQuery,
  UseQueryOptions, 
  UseMutationOptions,
  UseInfiniteQueryOptions 
} from '@tanstack/react-query';
import { userService } from '../services/user';
import {
  User,
  CreateUserInput,
  UpdateUserInput,
  UserProfileSetup,
  UserLocationSetup,
  UserIdParam,
  UserQuery,
  PublicUser,
  UpdateBalance,
} from '../schema/user';
import { PaginatedResponse, PaginationQuery, SuccessResponse } from '../schema/common';

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserQuery & PaginationQuery) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  currentUser: () => [...userKeys.all, 'currentUser'] as const,
  publicUsers: () => [...userKeys.all, 'public'] as const,
  publicUser: (id: string) => [...userKeys.publicUsers(), id] as const,
  search: (query: string) => [...userKeys.all, 'search', query] as const,
  nearby: (lat: number, lng: number, radius: number) => [...userKeys.all, 'nearby', lat, lng, radius] as const,
  blocked: () => [...userKeys.all, 'blocked'] as const,
  stats: () => [...userKeys.all, 'stats'] as const,
} as const;

// Queries

// Get current user
export const useCurrentUser = (
  options?: UseQueryOptions<User, Error>
) => {
  return useQuery({
    queryKey: userKeys.currentUser(),
    queryFn: () => userService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Get user by ID
export const useUser = (
  id: string,
  options?: UseQueryOptions<User, Error>
) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getUserById({ id }),
    enabled: !!id,
    ...options,
  });
};

// Get public user by ID
export const usePublicUser = (
  id: string,
  options?: UseQueryOptions<PublicUser, Error>
) => {
  return useQuery({
    queryKey: userKeys.publicUser(id),
    queryFn: () => userService.getPublicUserById({ id }),
    enabled: !!id,
    ...options,
  });
};

// Get users list with filters and pagination
export const useUsers = (
  query: UserQuery & PaginationQuery,
  options?: UseQueryOptions<PaginatedResponse<User>, Error>
) => {
  return useQuery({
    queryKey: userKeys.list(query),
    queryFn: () => userService.getUsers(query),
    ...options,
  });
};

// Get public users with infinite scroll
export const useInfinitePublicUsers = (
  query: UserQuery,
  options?: UseInfiniteQueryOptions<PaginatedResponse<PublicUser>, Error>
) => {
  return useInfiniteQuery({
    queryKey: userKeys.list({ ...query, page: 1 }),
    queryFn: ({ pageParam = 1 }) => 
      userService.getPublicUsers({ ...query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined;
    },
    ...options,
  });
};

// Search users
export const useSearchUsers = (
  searchQuery: string,
  filters?: UserQuery,
  options?: UseQueryOptions<PublicUser[], Error>
) => {
  return useQuery({
    queryKey: userKeys.search(searchQuery),
    queryFn: () => userService.searchUsers(searchQuery, filters),
    enabled: searchQuery.length > 2, // Only search if query is longer than 2 chars
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  });
};

// Get users by location
export const useNearbyUsers = (
  latitude: number,
  longitude: number,
  radius: number = 50,
  options?: UseQueryOptions<PublicUser[], Error>
) => {
  return useQuery({
    queryKey: userKeys.nearby(latitude, longitude, radius),
    queryFn: () => userService.getUsersByLocation(latitude, longitude, radius),
    enabled: !!latitude && !!longitude,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

// Get blocked users
export const useBlockedUsers = (
  options?: UseQueryOptions<PublicUser[], Error>
) => {
  return useQuery({
    queryKey: userKeys.blocked(),
    queryFn: () => userService.getBlockedUsers(),
    ...options,
  });
};

// Get user statistics (admin only)
export const useUserStats = (
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: () => userService.getUserStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Mutations

// Create user (admin only)
export const useCreateUser = (
  options?: UseMutationOptions<User, Error, CreateUserInput>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateUserInput) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
    ...options,
  });
};

// Update current user
export const useUpdateCurrentUser = (
  options?: UseMutationOptions<User, Error, UpdateUserInput>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateUserInput) => userService.updateCurrentUser(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.currentUser(), updatedUser);
      queryClient.invalidateQueries({ queryKey: userKeys.details() });
    },
    ...options,
  });
};

// Update user by ID (admin only)
export const useUpdateUser = (
  options?: UseMutationOptions<User, Error, UserIdParam & { data: UpdateUserInput }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ data, ...params }: UserIdParam & { data: UpdateUserInput }) => 
      userService.updateUserById(params, data),
    onSuccess: (updatedUser, variables) => {
      queryClient.setQueryData(userKeys.detail(variables.id), updatedUser);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    ...options,
  });
};

// Update profile setup (onboarding)
export const useUpdateProfileSetup = (
  options?: UseMutationOptions<User, Error, UserProfileSetup>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UserProfileSetup) => userService.updateProfileSetup(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.currentUser(), updatedUser);
    },
    ...options,
  });
};

// Update location setup (onboarding)
export const useUpdateLocationSetup = (
  options?: UseMutationOptions<User, Error, UserLocationSetup>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UserLocationSetup) => userService.updateLocationSetup(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.currentUser(), updatedUser);
    },
    ...options,
  });
};

// Update user balance (admin only)
export const useUpdateUserBalance = (
  options?: UseMutationOptions<User, Error, UserIdParam & { data: UpdateBalance }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ data, ...params }: UserIdParam & { data: UpdateBalance }) => 
      userService.updateUserBalance(params, data),
    onSuccess: (updatedUser, variables) => {
      queryClient.setQueryData(userKeys.detail(variables.id), updatedUser);
      if (variables.id === queryClient.getQueryData(userKeys.currentUser())?.id) {
        queryClient.setQueryData(userKeys.currentUser(), updatedUser);
      }
    },
    ...options,
  });
};

// Upload avatar
export const useUploadAvatar = (
  options?: UseMutationOptions<{ avatar_url: string }, Error, FormData>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file: FormData) => userService.uploadAvatar(file),
    onSuccess: (data) => {
      // Update current user with new avatar URL
      queryClient.setQueryData(userKeys.currentUser(), (oldData: User | undefined) => 
        oldData ? { ...oldData, avatar_url: data.avatar_url } : oldData
      );
    },
    ...options,
  });
};

// Delete avatar
export const useDeleteAvatar = (
  options?: UseMutationOptions<SuccessResponse, Error, void>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => userService.deleteAvatar(),
    onSuccess: () => {
      queryClient.setQueryData(userKeys.currentUser(), (oldData: User | undefined) => 
        oldData ? { ...oldData, avatar_url: null } : oldData
      );
    },
    ...options,
  });
};

// Block user
export const useBlockUser = (
  options?: UseMutationOptions<SuccessResponse, Error, UserIdParam>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: UserIdParam) => userService.blockUser(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.blocked() });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    ...options,
  });
};

// Unblock user
export const useUnblockUser = (
  options?: UseMutationOptions<SuccessResponse, Error, UserIdParam>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: UserIdParam) => userService.unblockUser(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.blocked() });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    ...options,
  });
};

// Report user
export const useReportUser = (
  options?: UseMutationOptions<SuccessResponse, Error, UserIdParam & { reason: string; details?: string }>
) => {
  return useMutation({
    mutationFn: ({ reason, details, ...params }: UserIdParam & { reason: string; details?: string }) => 
      userService.reportUser(params, reason, details),
    ...options,
  });
};

// Deactivate account
export const useDeactivateAccount = (
  options?: UseMutationOptions<SuccessResponse, Error, void>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => userService.deactivateAccount(),
    onSuccess: () => {
      queryClient.clear();
    },
    ...options,
  });
};

// Delete account
export const useDeleteAccount = (
  options?: UseMutationOptions<SuccessResponse, Error, void>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => userService.deleteAccount(),
    onSuccess: () => {
      queryClient.clear();
    },
    ...options,
  });
};

// Delete user by ID (admin only)
export const useDeleteUser = (
  options?: UseMutationOptions<SuccessResponse, Error, UserIdParam>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: UserIdParam) => userService.deleteUserById(params),
    onSuccess: (_, variables) => {
      queryClient.removeQueries({ queryKey: userKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
    ...options,
  });
};

// Verify user identity (admin only)
export const useVerifyUserIdentity = (
  options?: UseMutationOptions<SuccessResponse, Error, UserIdParam>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: UserIdParam) => userService.verifyUserIdentity(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    ...options,
  });
};

// Custom hooks for common patterns

// Check if current user
export const useIsCurrentUser = (userId: string) => {
  const { data: currentUser } = useCurrentUser();
  return currentUser?.id === userId;
};

// Get user display name
export const useUserDisplayName = (user?: User | PublicUser) => {
  if (!user) return '';
  return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown User';
};

// User profile completion status
export const useProfileCompletion = () => {
  const { data: user } = useCurrentUser();
  
  if (!user) return { completed: false, percentage: 0, missing: [] };
  
  const requiredFields = ['first_name', 'last_name', 'gender', 'dob', 'city', 'country'];
  const optionalFields = ['avatar_url'];
  
  const missingRequired = requiredFields.filter(field => !user[field]);
  const missingOptional = optionalFields.filter(field => !user[field]);
  
  const completed = missingRequired.length === 0;
  const totalFields = requiredFields.length + optionalFields.length;
  const completedFields = totalFields - missingRequired.length - missingOptional.length;
  const percentage = Math.round((completedFields / totalFields) * 100);
  
  return {
    completed,
    percentage,
    missing: [...missingRequired, ...missingOptional],
    missingRequired,
    missingOptional,
  };
};