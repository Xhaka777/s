import { createStore } from "../../../../packages/api/src/store/store";

const baseUrl = (import.meta as any).env?.VITE_API_URL || "http://localhost:3000/api";

export const { store, persistor, apiSlice, usersApi, formsApi } = createStore(baseUrl);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

