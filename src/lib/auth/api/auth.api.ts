import { parseLoginResponse } from "@/lib/auth";
import { baseApi } from "@/lib/core";
import type { LoginRequest, LoginResponse } from "@/types/auth";

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
