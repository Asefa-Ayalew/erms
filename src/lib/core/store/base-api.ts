import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/core/utilities/axios-base-query";

const apiUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({ baseUrl: apiUrl }),
  tagTypes: ["Tasks", "Projects", "ManagerOptions", "Departments"],
  endpoints: () => ({}),
});
