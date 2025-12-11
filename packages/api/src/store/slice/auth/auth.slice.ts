import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "../../types";

const initialState: AuthState = {
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    clearAuth: (state) => {
      state.token = null;
    },
  },
});

export const { setToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;

