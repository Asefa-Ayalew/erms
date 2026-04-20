import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { loginResponseSchema, loginInputSchema, userProfileSchema } from "@/types/auth";
import type { AuthState, LoginRequest, LoginResponse, UserProfile } from "@/types/auth";

type RootState = {
  auth: AuthState;
  [key: string]: unknown;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://lr24j6p3-3001.uks1.devtunnels.ms";
const baseUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    // Don't set authorization header for login - let cookies handle auth
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
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: unknown) => loginResponseSchema.parse(response),
    }),
    me: builder.query<UserProfile, void>({
      query: () => "/auth/me",
      transformResponse: (response: unknown) => userProfileSchema.parse(response),
    }),
  }),
});

export const { useLoginMutation, useMeQuery } = authApi;
