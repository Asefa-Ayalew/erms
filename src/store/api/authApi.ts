import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { loginResponseSchema, userProfileSchema } from "@/types/auth";
import type {
  AuthState,
  ExternalUserDetailResponse,
  LoginRequest,
  LoginResponse,
  UserProfile,
} from "@/types/auth";

type RootState = {
  auth: AuthState;
  [key: string]: unknown;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://lr24j6p3-3001.uks1.devtunnels.ms";
const baseUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;

type ExternalLoginResponse = {
  accessToken?: string;
  refreshToken?: string;
};

function normalizeRoles(roles: ExternalUserDetailResponse["roles"]): string[] {
  if (!Array.isArray(roles)) {
    return [];
  }

  return roles
    .map((role) => {
      if (typeof role === "string") {
        return role;
      }

      if (role && typeof role === "object") {
        return role.name ?? role.roleName ?? "";
      }

      return "";
    })
    .filter(Boolean);
}

function normalizeName(payload: ExternalUserDetailResponse) {
  const combinedName = [payload.firstName, payload.fatherName ?? payload.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return payload.name ?? payload.fullName ?? combinedName;
}

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
  credentials: "omit",
});

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/api/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: unknown) =>
        loginResponseSchema.parse({
          token:
            (response as { token?: string })?.token ??
            (response as ExternalLoginResponse)?.accessToken ??
            "",
          refreshToken: (response as ExternalLoginResponse)?.refreshToken ?? null,
          user: null,
        }),
    }),
    me: builder.query<UserProfile, void>({
      query: () => "/api/auth/me",
      transformResponse: (response: unknown) =>
        userProfileSchema.parse({
          id:
            (response as ExternalUserDetailResponse)?.id ??
            (response as ExternalUserDetailResponse)?.userId ??
            (response as ExternalUserDetailResponse)?.sub ??
            "",
          username:
            (response as ExternalUserDetailResponse)?.username ??
            (response as ExternalUserDetailResponse)?.email ??
            "",
          name: normalizeName(response as ExternalUserDetailResponse) ?? "",
          roles: normalizeRoles((response as ExternalUserDetailResponse)?.roles),
        }),
    }),
  }),
});

export const { useLoginMutation, useMeQuery } = authApi;
