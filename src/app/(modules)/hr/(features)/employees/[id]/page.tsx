"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, Group, SimpleGrid, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import {
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
  useLazyGetEmployeeQuery,
  useUpdateEmployeeMutation,
} from "../_store/employee.query";
import EmployeeForm, { type EmployeeFormValues } from "../_component/employee-form.component";
import EmployeePreview from "../_component/employee-preview.component";
import type { Employee } from "../../../models/employee.model";

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id ?? "");
  const isNew = id === "new";

  const [live, setLive] = useState<Partial<Employee>>({});
  const [getEmployee, { data: employee, isLoading: loadingEmployee }] = useLazyGetEmployeeQuery();
  const [createEmployee, { isLoading: creating }] = useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: updating }] = useUpdateEmployeeMutation();
  const [deleteEmployee, { isLoading: deleting }] = useDeleteEmployeeMutation();

  useEffect(() => {
    if (!isNew) {
      getEmployee({ id });
    }
  }, [getEmployee, id, isNew]);

  const previewData = useMemo(() => {
    if (isNew) {
      return live;
    }
    return { ...employee, ...live };
  }, [isNew, employee, live]);

  const handleSubmit = useCallback(
    async (values: EmployeeFormValues) => {
      try {
        if (isNew) {
          const { id: _omit, ...rest } = values;
          await createEmployee(rest).unwrap();
          notifications.show({
            title: "Success",
            message: "Employee created successfully.",
            color: "teal",
            icon: <IconCheck size={18} />,
          });
        } else {
          await updateEmployee({ ...values, id }).unwrap();
          notifications.show({
            title: "Success",
            message: "Employee updated successfully.",
            color: "teal",
            icon: <IconCheck size={18} />,
          });
        }
        router.push("/hr/employees");
      } catch {
        notifications.show({
          title: "Error",
          message: "Something went wrong",
          color: "red",
          icon: <IconX size={18} />,
        });
      }
    },
    [createEmployee, isNew, updateEmployee, router],
  );

  const handleDelete = useCallback(() => {
    if (isNew || !window.confirm("Delete this employee?")) return;
    void (async () => {
      try {
        await deleteEmployee(id).unwrap();
        notifications.show({
          title: "Deleted",
          message: "Employee removed.",
          color: "teal",
          icon: <IconCheck size={18} />,
        });
        router.push("/hr/employees");
      } catch {
        notifications.show({
          title: "Error",
          message: "Could not delete employee",
          color: "red",
          icon: <IconX size={18} />,
        });
      }
    })();
  }, [deleteEmployee, id, isNew, router]);

  if (!isNew && loadingEmployee && !employee) {
    return (
      <div className="p-4 text-sm text-gray-500">Loading…</div>
    );
  }

  return (
    <div className="p-2">
      <Title order={5} className="mb-4 text-gray-800">
        {isNew ? "New employee" : "Edit employee"}
      </Title>
        <Card withBorder padding="md">
          <EmployeeForm
            mode={isNew ? "new" : "edit"}
            defaultValues={isNew ? undefined : employee}
            onValuesChange={setLive}
            onSubmit={handleSubmit}
            onDelete={isNew ? undefined : handleDelete}
            loading={creating || updating}
            deleting={deleting}
          />
        </Card>
    </div>
  );
}
