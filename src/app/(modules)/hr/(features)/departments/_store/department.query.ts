import { apiSlice } from "@/app/store/app.api";
import { Collection, CollectionQuery } from "@/lib/entity";
import { Department } from "../../../models/department.model";
import { DEPARTMENT_ENDPOINT } from "./department.endpoint";
import { collectionQueryBuilder } from "@/lib/core";
let departmentCollection: CollectionQuery | undefined;

export const departmentQuery = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDepartment: builder.query<Department, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${DEPARTMENT_ENDPOINT.detail}/${data?.id}`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      providesTags: ["DepartmentInfo"],
    }),

    getDepartments: builder.query<Collection<Department>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: DEPARTMENT_ENDPOINT.list,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      providesTags: ["Departments"],
      async onQueryStarted(param, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            departmentCollection = param;
          }
        } catch {
          // no-op
        }
      },
    }),

      getArchivedDepartments: builder.query<Collection<Department>, CollectionQuery>(
          {
            query: (data: CollectionQuery) => ({
              url: DEPARTMENT_ENDPOINT.listArchivedDepartments,
              method: "GET",
              params: collectionQueryBuilder(data),
            }),
            providesTags: ["Departments"],
            async onQueryStarted(param, { queryFulfilled }) {
              try {
                const { data } = await queryFulfilled;
                if (data) {
                  departmentCollection = param;
                }
              } catch {
                // no-op
              }
            },
          }
        ),

    createDepartment: builder.mutation<Department, Department>({
      query: (newData: Department) => ({
        url: `${DEPARTMENT_ENDPOINT.create}`,
        method: "POST",
        data: newData,
      }),
      invalidatesTags: ["Departments"],
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data && departmentCollection) {
            dispatch(
              departmentQuery.util.updateQueryData(
                "getDepartments",
                departmentCollection,
                (draft) => {
                  if (data) {
                    draft.data.push(data);
                    draft.count += 1;
                  }
                }
              )
            );
          }
        } catch {
          // no-op
        }
      },
    }),

    updateDepartment: builder.mutation<Department, Department>({
      query: (newData: Department) => ({
        url: `${DEPARTMENT_ENDPOINT.update}`,
        method: "PUT",
        data: newData,
      }),
      invalidatesTags: ["DepartmentInfo", "Departments"],
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data && departmentCollection) {
            dispatch(
              departmentQuery.util.updateQueryData(
                "getDepartments",
                departmentCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((item) =>
                      item.id === data.id ? data : item
                    );
                  }
                }
              )
            );
          }
        } catch {
          // no-op
        }
      },
    }),
    archiveDepartment: builder.mutation<Department, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${DEPARTMENT_ENDPOINT.archive}/${data?.id}`,
        method: "DELETE",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data && departmentCollection) {
            dispatch(
              departmentQuery.util.updateQueryData(
                "getDepartments",
                departmentCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((department) => {
                      if (department.id === data.id) return data;
                      else {
                        return department;
                      }
                    });
                  }
                }
              )
            );
          }
        } catch {
          // no-op
        }
      },
    }),
    restoreDepartment: builder.mutation<Department, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${DEPARTMENT_ENDPOINT.restore}/${data?.id}`,
        method: "POST",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data && departmentCollection) {
            dispatch(
              departmentQuery.util.updateQueryData(
                "getDepartments",
                departmentCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((department) =>
                      department.id === data.id ? data : department
                    );
                  }
                }
              )
            );
          }
        } catch {
          // no-op
        }
      },
    }),
    deleteDepartment: builder.mutation<boolean, string>({
      query: (id: string) => ({
        url: `${DEPARTMENT_ENDPOINT.delete}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Departments"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data && departmentCollection) {
            dispatch(
              departmentQuery.util.updateQueryData(
                "getDepartments",
                departmentCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.filter(
                      (item) => item.id?.toString() !== id
                    );
                    draft.count -= 1;
                  }
                }
              )
            );
          }
        } catch {
          // no-op
        }
      },
    }),
  }),

  overrideExisting: true,
});

export const {
  useLazyGetDepartmentQuery,
  useLazyGetArchivedDepartmentsQuery,
  useArchiveDepartmentMutation,
  useGetDepartmentQuery,
  useRestoreDepartmentMutation,
  useLazyGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentQuery;
