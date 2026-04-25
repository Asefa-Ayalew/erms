"use client";

import { Button, Group, Select, TextInput, Stack } from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useLazyGetDepartmentsQuery } from "../../departments/_store/department.query";
import type {
  Employee,
  EmployeeGender,
  EmploymentStatus,
} from "../../../models/employee.model";
import { Department } from "../../../models/department.model";
import { IconDeviceFloppy, IconTrash } from "@tabler/icons-react";

const employeeSchema = z.object({
  id: z.string().optional(),
  employeeCode: z.string().min(1, "Employee code is required"),
  firstName: z.string().min(1, "First name is required"),
  fatherName: z.string().optional(),
  gFatherName: z.string().optional(),
  tin: z.string().optional(),
  fan: z.string().optional(),
  gender: z.enum(["male", "female"] as [EmployeeGender, EmployeeGender]),
  dateOfBirth: z.string().optional(),
  phone: z.string().optional(),
  email: z.union([z.literal(""), z.string().email()]),
  hireDate: z.string().optional(),
  employmentStatus: z.enum(["active", "inactive", "terminated"] as [
    EmploymentStatus,
    EmploymentStatus,
    EmploymentStatus,
  ]),
  departmentId: z.string().optional(),
  positionId: z.string().optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface Props {
  onSubmit: (values: EmployeeFormValues) => void;
  onDelete?: () => void;
  loading?: boolean;
  deleting?: boolean;
  defaultValues?: Partial<Employee> | null;
  mode: "new" | "edit";
  /** Live preview: called on change */
  onValuesChange?: (values: Partial<EmployeeFormValues>) => void;
}

export default function EmployeeForm({
  onSubmit,
  onDelete,
  loading,
  deleting,
  defaultValues,
  mode,
  onValuesChange,
}: Props) {
  const [getDepartments, { data: departments }] = useLazyGetDepartmentsQuery();

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      employeeCode: "",
      firstName: "",
      fatherName: "",
      gFatherName: "",
      tin: "",
      fan: "",
      gender: "male",
      dateOfBirth: "",
      phone: "",
      email: "",
      hireDate: "",
      employmentStatus: "active",
      departmentId: "",
      positionId: "",
    },
  });

  const { isDirty } = form.formState;

  useEffect(() => {
    getDepartments({});
  }, [getDepartments]);

  useEffect(() => {
    if (!defaultValues) return;
    form.reset({
      id: defaultValues.id,
      employeeCode: defaultValues.employeeCode ?? "",
      firstName: defaultValues.firstName ?? "",
      fatherName: defaultValues.fatherName ?? "",
      gFatherName: defaultValues.gFatherName ?? "",
      tin: defaultValues.tin ?? "",
      fan: defaultValues.fan ?? "",
      gender: (defaultValues.gender as EmployeeGender) ?? "male",
      dateOfBirth: defaultValues.dateOfBirth ?? "",
      phone: defaultValues.phone ?? "",
      email: defaultValues.email ?? "",
      hireDate: defaultValues.hireDate ?? "",
      employmentStatus:
        (defaultValues.employmentStatus as EmploymentStatus) ?? "active",
      departmentId: defaultValues.departmentId ?? "",
      positionId: defaultValues.positionId ?? "",
    });
  }, [defaultValues, form]);

  useEffect(() => {
    if (!onValuesChange) return;
    const sub = form.watch((vals) => {
      onValuesChange(vals as Partial<EmployeeFormValues>);
    });
    return () => sub.unsubscribe();
  }, [form, onValuesChange]);

  const deptOptions =
    Array.isArray(departments?.data) && departments.data.length
      ? departments.data.map((d: Department) => ({
          value: String(d.id),
          label: d.name ?? String(d.id),
        }))
      : [];

  return (
    <form
      onSubmit={form.handleSubmit((values) => {
        onSubmit(values);
      })}
    >
      <Stack gap="md">
        <TextInput
          label="Employee code"
          {...form.register("employeeCode")}
          error={form.formState.errors.employeeCode?.message}
        />
        <TextInput
          label="First name"
          {...form.register("firstName")}
          error={form.formState.errors.firstName?.message}
        />
        <TextInput label="Father name" {...form.register("fatherName")} />
        <TextInput label="Grandfather name" {...form.register("gFatherName")} />
        <TextInput label="TIN" {...form.register("tin")} />
        <TextInput label="FAN" {...form.register("fan")} />
        <Controller
          name="gender"
          control={form.control}
          render={({ field }) => (
            <Select
              label="Gender"
              data={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
              {...field}
            />
          )}
        />
        <TextInput
          type="date"
          label="Date of birth"
          {...form.register("dateOfBirth")}
        />
        <TextInput label="Phone" {...form.register("phone")} />
        <TextInput
          label="Email"
          {...form.register("email")}
          error={form.formState.errors.email?.message}
        />
        <TextInput
          type="date"
          label="Hire date"
          {...form.register("hireDate")}
        />
        <Controller
          name="employmentStatus"
          control={form.control}
          render={({ field }) => (
            <Select
              label="Employment status"
              data={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "terminated", label: "Terminated" },
              ]}
              {...field}
            />
          )}
        />
        <Controller
          name="departmentId"
          control={form.control}
          render={({ field }) => (
            <Select
              label="Department"
              placeholder="Select department"
              data={deptOptions}
              searchable
              clearable
              value={field.value || null}
              onChange={(v) => field.onChange(v ?? "")}
            />
          )}
        />
        <TextInput
          label="Position ID"
          placeholder="e.g. role or UUID"
          {...form.register("positionId")}
        />
        <Group justify="flex-start" gap={8} mt="md">
          <Group>
            <Button
              color="blue"
              type="submit"
              loading={loading}
              disabled={mode === "edit" && !isDirty}
              leftSection={<IconDeviceFloppy size={16} />}
            >
              {mode === "edit" ? "Update" : "Save"}
            </Button>
          </Group>
          {mode === "edit" && onDelete && (
            <Button
              type="button"
              color="red"
              loading={deleting}
              onClick={onDelete}
              leftSection={<IconTrash size={16} />}
            >
              Delete
            </Button>
          )}
        </Group>
      </Stack>
    </form>
  );
}
