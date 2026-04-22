import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { parseLoginResponse } from "@/lib/auth/login";
import type { AuthState, LoginRequest, LoginResponse } from "@/types/auth";

type RootState = {
  auth: AuthState;
  [key: string]: unknown;
};

const apiUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";
const baseUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;

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

/** Legacy slice; the app uses `baseApi` + `auth` injectEndpoints. Kept in sync. */
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  tagTypes: [],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: unknown) => parseLoginResponse(response),
    }),
  }),
});

export const { useLoginMutation } = authApi;
