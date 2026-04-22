import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/core/utilities/axios-base-query";

const apiUrl = "";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({ baseUrl: apiUrl }),
  tagTypes: ["Auth", "Tasks"],
  endpoints: () => ({}),
});
