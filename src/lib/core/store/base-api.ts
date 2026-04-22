import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/core/utilities/axios-base-query";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({ baseUrl: apiUrl }),
  tagTypes: ["Auth", "Tasks"],
  endpoints: () => ({}),
});
