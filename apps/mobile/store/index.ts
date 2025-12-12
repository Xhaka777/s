import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from "redux-persist";
import { createApiSlice } from "@braynex/api/src/store/api/auth";
import { injectUsersEndpoints } from "@braynex/api/src/store/api/users";
import { injectEventsEndpoints } from "@braynex/api/src/store/api/events/events";
import { injectNotificationsEndpoints } from "@braynex/api/src/store/api/notifications/notifications";
import { injectFormsEndpoints } from "@braynex/api/src/store/api/forms/forms";
import authReducer from "./slices/auth.slice";

// Your API base URL - use your actual backend URL
const API_BASE_URL = "http://192.168.1.5:3000";

// Create the API slice with your base URL
const apiSlice = createApiSlice(API_BASE_URL);

// Inject all endpoints you need
const usersApi = injectUsersEndpoints(apiSlice);
const eventsApi = injectEventsEndpoints(apiSlice);
const notificationsApi = injectNotificationsEndpoints(apiSlice);
const formsApi = injectFormsEndpoints(apiSlice);
// Add other endpoints as needed...

// Configure persistence for React Native
const persistConfig = {
  key: "root",
  storage: AsyncStorage, // ✅ Use AsyncStorage for React Native
  whitelist: ["auth"], // Only persist auth state
  timeout: 10000, // Add timeout for RN
};

// Combine reducers
const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
        ],
      },
      immutableCheck: false, // Disable for better RN performance
    }).concat(apiSlice.middleware),
  devTools: __DEV__, // ✅ Only enable in development
});

export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export API slice for query invalidation if needed
export { apiSlice };

// Export all the API hooks
export const {
  useCheckSessionMutation,
  useCompleteOnboardingStageOneMutation,
  useCompleteOnboardingStageTwoMutation,
  useCompleteOnboardingStageThreeMutation,
  useCreateUserMutation,
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useGetUsersOnboardingStatusQuery,
  useSearchUsersQuery,
  useHandleVeriffWebhookMutation,
  useGetVeriffStatusQuery,
} = usersApi;

export const {
  useCreateEventMutation,
  useListEventsQuery,
  useGetEventQuery,
  useUpdateEventMutation,
  useSetEventStatusMutation,
} = eventsApi;

export const {
  useCreateNotificationMutation,
  useGetNotificationsQuery,
  useGetUnreadNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
  useGetReadStatusQuery,
  useMarkAllAsReadMutation,
} = notificationsApi;

export const {
  useCreateFormMutation,
  useGetFormsQuery,
  useGetFormQuery,
  useUpdateFormMutation,
  useDeleteFormMutation,
  useGetQuestionsAndOptionsFromFormQuery,
} = formsApi;