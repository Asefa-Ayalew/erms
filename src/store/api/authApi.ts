import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { loginResponseSchema, loginInputSchema, userProfileSchema } from "@/types/auth";
import type { AuthState, LoginRequest, LoginResponse, UserProfile } from "@/types/auth";

type RootState = {
  auth: AuthState;
  [key: string]: unknown;
};

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "/api",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
  credentials: "include",
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
