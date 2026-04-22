import { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { FetchArgs } from "@reduxjs/toolkit/query";
import type { RootState } from "@/lib/core/store/app-store";

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
      const finalUrl = new URL(url, baseUrl || window.location.origin);
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
