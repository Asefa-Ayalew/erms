import { parseLoginResponse } from "@/lib/auth/login";
import { baseApi } from "@/lib/core/store/base-api";
import type { LoginRequest, LoginResponse } from "@/types/auth";

/** Login: `POST …/auth/login` → tokens; user is filled in `parseLoginResponse` (JWT or API `user`). */
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        data: credentials,
      }),
      transformResponse: (response: unknown) => parseLoginResponse(response),
    }),
  }),
});

export const { useLoginMutation } = authApi;
