import { baseApi } from "@/lib/core/store/base-api";
import { loginResponseSchema, userProfileSchema } from "@/types/auth";
import type { LoginRequest, LoginResponse, UserProfile } from "@/types/auth";

type ExternalLoginResponse = {
  accessToken?: string;
  refreshToken?: string;
};

type ExternalUserDetailResponse = {
  id?: string;
  userId?: string;
  sub?: string;
  username?: string;
  email?: string;
  phone?: string;
  name?: string;
  fullName?: string;
  firstName?: string;
  fatherName?: string;
  lastName?: string;
  roles?: string[] | Array<{ name?: string; roleName?: string }>;
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
      return role?.name ?? role?.roleName ?? "";
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

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        data: credentials,
      }),
      transformResponse: (response: unknown) =>
        loginResponseSchema.parse({
          token: (response as ExternalLoginResponse)?.accessToken ?? "",
          refreshToken: (response as ExternalLoginResponse)?.refreshToken ?? null,
          user: null,
        }),
      invalidatesTags: ["Auth"],
    }),
    me: builder.query<UserProfile, void>({
      query: () => ({
        url: "/auth/user-detail",
        method: "GET",
      }),
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
      providesTags: ["Auth"],
    }),
  }),
});

export const { useLoginMutation, useMeQuery } = authApi;
