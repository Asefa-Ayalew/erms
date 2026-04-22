import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userFromAccessToken } from "@/lib/auth/jwt";
import type { AuthState, LoginResponse } from "@/types/auth";

const emptyAuth: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
};

function readPersistedAuth(): AuthState {
  if (typeof window === "undefined") {
    return { ...emptyAuth };
  }
  try {
    const raw = window.localStorage.getItem("erms-auth");
    if (!raw) {
      return { ...emptyAuth };
    }
    const parsed = JSON.parse(raw) as Partial<AuthState> & { token?: string | null };
    const token = parsed.token ?? null;
    const refreshToken = parsed.refreshToken ?? null;

    if (!token) {
      return { ...emptyAuth };
    }

    const user = userFromAccessToken(token);
    if (!user) {
      window.localStorage.removeItem("erms-auth");
      return { ...emptyAuth };
    }

    return { user, token, refreshToken };
  } catch {
    return { ...emptyAuth };
  }
}

const initialState: AuthState = readPersistedAuth();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<LoginResponse>) {
      if (action.payload.token != null && action.payload.token !== "") {
        state.token = action.payload.token;
        state.user = userFromAccessToken(action.payload.token) ?? action.payload.user ?? null;
      } else if (action.payload.user !== undefined) {
        state.user = action.payload.user ?? null;
      }
      if (action.payload.refreshToken !== undefined) {
        state.refreshToken = action.payload.refreshToken;
      }

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "erms-auth",
          JSON.stringify({
            user: state.user,
            token: state.token,
            refreshToken: state.refreshToken,
          }),
        );
      }
    },
    clearCredentials(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;

      if (typeof window !== "undefined") {
        window.localStorage.removeItem("erms-auth");
      }
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
