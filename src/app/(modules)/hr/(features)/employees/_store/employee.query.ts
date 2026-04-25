import { apiSlice } from "@/app/store/app.api";
import { Collection, CollectionQuery } from "@/lib/entity";
import { collectionQueryBuilder } from "@/lib/core";
import { Employee } from "../../../models/employee.model";
import { EMPLOYEE_ENDPOINT } from "./employee.endpoint";

const listRequest = (request: CollectionQuery): CollectionQuery => ({
  ...request,
  useFlatSort: true,
});

export const employeeQuery = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmployee: builder.query<Employee, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${EMPLOYEE_ENDPOINT.detail}/${data?.id}`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      providesTags: (_result, _e, arg) =>
        arg.id ? [{ type: "Employee" as const, id: String(arg.id) }] : ["Employee"],
    }),

    getEmployees: builder.query<Collection<Employee>, CollectionQuery>({
      query: (request: CollectionQuery) => ({
        url: EMPLOYEE_ENDPOINT.list,
        method: "GET",
        params: collectionQueryBuilder(listRequest(request)),
      }),
      providesTags: ["Employees"],
    }),

    createEmployee: builder.mutation<Employee, Partial<Employee>>({
      query: (newData) => ({
        url: EMPLOYEE_ENDPOINT.create,
        method: "POST",
        data: newData,
      }),
      invalidatesTags: ["Employees"],
    }),

    updateEmployee: builder.mutation<Employee, Partial<Employee> & { id: string }>({
      query: (newData) => ({
        url: `${EMPLOYEE_ENDPOINT.update}/${newData.id}`,
        method: "PATCH",
        data: newData,
      }),
      invalidatesTags: (_r, _e, arg) => [
        "Employees",
        { type: "Employee" as const, id: arg.id },
      ],
    }),

    deleteEmployee: builder.mutation<void, string>({
      query: (id) => ({
        url: `${EMPLOYEE_ENDPOINT.delete}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [
        "Employees",
        { type: "Employee" as const, id },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useLazyGetEmployeeQuery,
  useLazyGetEmployeesQuery,
  useGetEmployeeQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeQuery;
