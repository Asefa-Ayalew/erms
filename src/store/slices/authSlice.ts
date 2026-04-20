import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, LoginResponse } from "@/types/auth";

const getInitialAuthState = (): AuthState => {
  if (typeof window === "undefined") {
    return { user: null, token: null };
  }

  try {
    const persisted = window.localStorage.getItem("erms-auth");
    if (!persisted) {
      return { user: null, token: null };
    }
    return JSON.parse(persisted) as AuthState;
  } catch {
    return { user: null, token: null };
  }
};

const initialState: AuthState = getInitialAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<LoginResponse>) {
      state.user = action.payload.user ?? state.user;
      state.token = action.payload.token;

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "erms-auth",
          JSON.stringify({ user: state.user, token: state.token }),
        );
      }
    },
    clearCredentials(state) {
      state.user = null;
      state.token = null;

      if (typeof window !== "undefined") {
        window.localStorage.removeItem("erms-auth");
      }
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
