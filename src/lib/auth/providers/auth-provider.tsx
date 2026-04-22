"use client";

import { ReactNode, createContext, useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "@/app/(features)/auth/queries/auth.api";
import { hasRole } from "@/lib/auth/roles";
import { clearCredentials, setCredentials } from "@/store/slices/authSlice";
import type { LoginRequest, UserProfile } from "@/types/auth";
import type { RootState } from "@/lib/core/store/app-store";

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
  const pathname = usePathname();
  const authState = useSelector((state: RootState) => state.auth);
  const [loginRequest, loginState] = useLoginMutation();

  useEffect(() => {
    if (loginState.isLoading) {
      return;
    }

    if (!authState.token && pathname !== "/login") {
      router.push("/login");
      return;
    }

    if (authState.token && authState.user && pathname === "/login") {
      router.push("/dashboard");
    }
  }, [authState.token, authState.user, loginState.isLoading, pathname, router]);

  const login = async (payload: LoginRequest) => {
    const result = await loginRequest(payload).unwrap();
    dispatch(setCredentials(result));
  };

  const logout = () => {
    dispatch(clearCredentials());
    router.push("/login");
  };

  const checkRole = (role: string) => hasRole(authState.user?.roles, role);

  const contextValue = {
    user: authState.user,
    isAuthenticated: Boolean(authState.user && authState.token),
    isLoading: loginState.isLoading,
    login,
    logout,
    hasRole: checkRole,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthInnerProvider>{children}</AuthInnerProvider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
