"use client";

import { ReactNode, createContext, useContext, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "@/store/store";
import { authApi, useLoginMutation, useMeQuery } from "@/store/api/authApi";
import { clearCredentials, setCredentials } from "@/store/slices/authSlice";
import type { LoginRequest, UserProfile } from "@/types/auth";
import type { RootState } from "@/store/store";

type AuthContextValue = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function AuthInnerProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state: RootState) => state.auth);
  const [loginRequest, loginState] = useLoginMutation();
  const { data: me, isLoading: isProfileLoading, error } = useMeQuery(undefined, {
    skip: !authState.token,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (me) {
      dispatch(
        setCredentials({
          user: me,
          token: authState.token ?? "",
        }),
      );
    }
  }, [dispatch, me, authState.token]);

  useEffect(() => {
    if (error) {
      dispatch(clearCredentials());
    }
  }, [error, dispatch]);

  const login = async (payload: LoginRequest) => {
    const result = await loginRequest(payload).unwrap();
    dispatch(setCredentials(result));
    router.push("/dashboard");
  };

  const logout = () => {
    dispatch(clearCredentials());
    router.push("/login");
  };

  const hasRole = (role: string) => authState.user?.roles.includes(role) ?? false;

  const contextValue = useMemo(
    () => ({
      user: authState.user,
      isAuthenticated: Boolean(authState.user),
      isLoading: loginState.isLoading || isProfileLoading,
      login,
      logout,
      hasRole,
    }),
    [authState.user, authState.token, loginState.isLoading, isProfileLoading],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInnerProvider>{children}</AuthInnerProvider>
    </Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
