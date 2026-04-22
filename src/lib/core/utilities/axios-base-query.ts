import { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { FetchArgs } from "@reduxjs/toolkit/query";
import type { RootState } from "@/lib/core/store/app-store";

function resolveBaseForUrl(baseUrl: string): string {
  const trimmed = baseUrl.trim();
  if (trimmed) {
    return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
  }
  if (typeof window !== "undefined") {
    return `${window.location.origin}/`;
  }
  const fallback =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:3001";
  return fallback.endsWith("/") ? fallback : `${fallback}/`;
}

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" }
  ): BaseQueryFn<
    {
      url: string;
      method: FetchArgs["method"];
      data?: unknown;
      headers?: Record<string, string>;
      params?: Record<string, string | number | boolean | undefined>;
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers }, { getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth?.token;
      const finalUrl = new URL(url, resolveBaseForUrl(baseUrl));
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            finalUrl.searchParams.set(key, String(value));
          }
        });
      }

      const response = await fetch(finalUrl.toString(), {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: data === undefined ? undefined : JSON.stringify(data),
      });

      const responseData = await response.json().catch(() => null);
      if (!response.ok) {
        return {
          error: {
            status: response.status,
            data: responseData,
          },
        };
      }

      return { data: responseData };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Request failed";
      return {
        error: {
          status: "FETCH_ERROR",
          data: { message },
        },
      };
    }
  };
