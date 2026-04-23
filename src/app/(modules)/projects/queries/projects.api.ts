import { baseApi } from "@/lib/core/store/base-api";
import type { Project } from "@/app/(features)/projects/models/project";

export type ManagerOption = { value: string; label: string };

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => ({
        url: "/projects",
        method: "GET",
      }),
      providesTags: ["Projects"],
    }),
    getManagerOptions: builder.query<ManagerOption[], void>({
      query: () => ({
        url: "/managers",
        method: "GET",
      }),
      providesTags: ["ManagerOptions"],
    }),
    createProject: builder.mutation<Project, Partial<Project>>({
      query: (payload) => ({
        url: "/projects",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Projects"],
    }),
    updateProject: builder.mutation<Project, { id: string; payload: Partial<Project> }>({
      query: ({ id, payload }) => ({
        url: `/projects/${id}`,
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: ["Projects"],
    }),
    deleteProject: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetManagerOptionsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi;
