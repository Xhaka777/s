import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { createApiSlice } from "./api/auth";
import { injectUsersEndpoints } from "./api/users";
import { injectEventsEndpoints } from "./api/events/events";
import { injectNotificationsEndpoints } from "./api/notifications/notifications";
import { injectFormsEndpoints } from "./api/forms/forms";
import { injectEventRunsEndpoints } from "./api/event-runs/event-runs";
import { injectEventRunInvitesEndpoints } from "./api/event-run-invites/event-run-invites";
import { injectEventOrganizersEndpoints } from "./api/event-organizers/event-organizers";
import { injectFormCategoriesEndpoints } from "./api/form-categories/form-categories";
import { injectFormQuestionsEndpoints } from "./api/form-questions/form-questions";
import { injectFormQuestionOptionsEndpoints } from "./api/form-question-options/form-question-options";
import { injectUserFormAnswersEndpoints } from "./api/user-form-answers/user-form-answers";
import { injectUploadsEndpoints } from "./api/uploads/uploads";
import { injectElasticEndpoints } from "./api/elastic/elastic";
import { injectAccountActivationEndpoints } from "./api/auth/account-activation";
import authReducer from "./slice/auth/auth.slice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { useDispatch } from "react-redux";

export const createStore = (baseUrl: string) => {
  const apiSlice = createApiSlice(baseUrl);
  
  // Inject all API endpoints
  const usersApi = injectUsersEndpoints(apiSlice);
  const eventsApi = injectEventsEndpoints(apiSlice);
  const notificationsApi = injectNotificationsEndpoints(apiSlice);
  const formsApi = injectFormsEndpoints(apiSlice);
  const eventRunsApi = injectEventRunsEndpoints(apiSlice);
  const eventRunInvitesApi = injectEventRunInvitesEndpoints(apiSlice);
  const eventOrganizersApi = injectEventOrganizersEndpoints(apiSlice);
  const formCategoriesApi = injectFormCategoriesEndpoints(apiSlice);
  const formQuestionsApi = injectFormQuestionsEndpoints(apiSlice);
  const formQuestionOptionsApi = injectFormQuestionOptionsEndpoints(apiSlice);
  const userFormAnswersApi = injectUserFormAnswersEndpoints(apiSlice);
  const uploadsApi = injectUploadsEndpoints(apiSlice);
  const elasticApi = injectElasticEndpoints(apiSlice);
  const accountActivationApi = injectAccountActivationEndpoints(apiSlice);

  const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth"],
  };

  const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    // router: routerReducer,
  });
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }).concat(apiSlice.middleware) as any,
    devTools: true,
  });

  return {
    store,
    persistor: persistStore(store),
    apiSlice,
    usersApi,
    eventsApi,
    notificationsApi,
    formsApi,
    eventRunsApi,
    eventRunInvitesApi,
    eventOrganizersApi,
    formCategoriesApi,
    formQuestionsApi,
    formQuestionOptionsApi,
    userFormAnswersApi,
    uploadsApi,
    elasticApi,
    accountActivationApi,
  };
};


const defaultStoreConfig = createStore("");
export const store = defaultStoreConfig.store;
export const persistor = defaultStoreConfig.persistor;
export const apiSlice = defaultStoreConfig.apiSlice;
export const usersApi = defaultStoreConfig.usersApi;
export const eventsApi = defaultStoreConfig.eventsApi;
export const notificationsApi = defaultStoreConfig.notificationsApi;
export const formsApi = defaultStoreConfig.formsApi;
export const eventRunsApi = defaultStoreConfig.eventRunsApi;
export const eventRunInvitesApi = defaultStoreConfig.eventRunInvitesApi;
export const eventOrganizersApi = defaultStoreConfig.eventOrganizersApi;
export const formCategoriesApi = defaultStoreConfig.formCategoriesApi;
export const formQuestionsApi = defaultStoreConfig.formQuestionsApi;
export const formQuestionOptionsApi = defaultStoreConfig.formQuestionOptionsApi;
export const userFormAnswersApi = defaultStoreConfig.userFormAnswersApi;
export const uploadsApi = defaultStoreConfig.uploadsApi;
export const elasticApi = defaultStoreConfig.elasticApi;
export const accountActivationApi = defaultStoreConfig.accountActivationApi;

// Export users API hooks
export const {
  useCheckSessionMutation,
  useCompleteOnboardingStageOneMutation,
  useCreateUserMutation,
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useGetUsersOnboardingStatusQuery,
  useSearchUsersQuery,
} = usersApi;

// Export events API hooks
export const {
  useCreateEventMutation,
  useListEventsQuery,
  useGetEventQuery,
  useUpdateEventMutation,
  useSetEventStatusMutation,
} = eventsApi;

// Export notifications API hooks
export const {
  useCreateNotificationMutation,
  useGetNotificationsQuery,
  useGetUnreadNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
  useGetReadStatusQuery,
  useMarkAllAsReadMutation,
} = notificationsApi;

// Export forms API hooks
export const {
  useCreateFormMutation,
  useGetFormsQuery,
  useGetFormQuery,
  useUpdateFormMutation,
  useDeleteFormMutation,
} = formsApi;

// Export event-runs API hooks
export const {
  useCheckUserAvailabilityQuery,
  useCreateEventRunMutation,
  useListEventRunsQuery,
  useGetEventRunQuery,
  useUpdateEventRunMutation,
  useSetEventRunStatusMutation,
  useDeleteEventRunMutation,
} = eventRunsApi;

// Export event-run-invites API hooks
export const {
  useCreateInviteMutation,
  useListInvitesQuery,
  useGetInviteQuery,
  useUpdateInviteStatusMutation,
  useAcceptInviteMutation,
  useDeclineInviteMutation,
  useDeleteInviteMutation,
} = eventRunInvitesApi;

// Export event-organizers API hooks
export const {
  useCreateOrganizerWithRepMutation,
  useListOrganizersQuery,
  useGetOrganizerQuery,
  useUpdateOrganizerMutation,
  useDeleteOrganizerMutation,
} = eventOrganizersApi;

// Export form-categories API hooks
export const {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesByFormQuery,
} = formCategoriesApi;

// Export form-questions API hooks
export const {
  useCreateQuestionMutation,
  useGetQuestionsQuery,
  useGetQuestionQuery,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useGetQuestionsByCategoryQuery,
} = formQuestionsApi;

// Export form-question-options API hooks
export const {
  useCreateOptionMutation,
  useGetOptionsQuery,
  useGetOptionQuery,
  useUpdateOptionMutation,
  useDeleteOptionMutation,
} = formQuestionOptionsApi;

// Export user-form-answers API hooks
export const {
  useCreateAnswerMutation,
  useGetAnswersQuery,
  useGetAnswersByUserQuery,
} = userFormAnswersApi;

// Export uploads API hooks
export const {
  useUploadTestMutation,
} = uploadsApi;

// Export elastic API hooks
export const {
  useGetIndicesQuery,
  useCreateUsersIndexMutation,
  useUpsertUserMutation,
  useGetMatchesQuery,
} = elasticApi;

// Export account-activation API hooks
export const {
  useIssueActivationMutation,
  useCompleteActivationMutation,
} = accountActivationApi;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => AppDispatch = useDispatch;
