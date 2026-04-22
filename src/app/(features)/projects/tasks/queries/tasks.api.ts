import { baseApi } from "@/lib/core/store/base-api";
import type { Task } from "@/app/(features)/projects/models/task";

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => ({
        url: "/api/tasks",
        method: "GET",
      }),
      providesTags: ["Tasks"],
    }),
    createTask: builder.mutation<Task, Partial<Task>>({
      query: (payload) => ({
        url: "/api/tasks",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTask: builder.mutation<Task, { id: string; payload: Partial<Task> }>({
      query: ({ id, payload }) => ({
        url: `/api/tasks/${id}`,
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: ["Tasks"],
    }),
    deleteTask: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/api/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;
