"use client";

import { Drawer, Button, TextInput, Textarea, Group } from "@mantine/core";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const departmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
});

export type DepartmentFormValues = z.infer<typeof departmentSchema>;

interface Props {
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: DepartmentFormValues) => void;
  loading?: boolean;
  editMode?: "edit" | "new";
  data?: any;
}

export default function DepartmentForm({
  opened,
  onClose,
  onSubmit,
  loading,
  editMode,
  data,
}: Props) {
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleSubmit = (values: DepartmentFormValues) => {
    if (editMode === 'edit' && data.id) {
      values.id = String(data.id);
    }
    onSubmit(values);
    form.reset();
  };
  useEffect(() => {
    if (editMode === 'edit' && data) {
      form.setValue("name", data.name);
      form.setValue("description", data.description);
    }
  }, [editMode, data, form]);

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={editMode === 'edit' ? "Edit Department" : "Create Department"}
      position="right"
      size="lg"
    >
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <TextInput
          label="Department Name"
          placeholder="Enter name"
          {...form.register("name")}
          error={form.formState.errors.name?.message}
        />

        <Textarea
          mt="md"
          label="Description"
          placeholder="Enter description"
          minRows={3}
          {...form.register("description")}
          error={form.formState.errors.description?.message}
        />

        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {editMode === 'edit' ? "Update" : "Save"}
          </Button>
        </Group>
      </form>
    </Drawer>
  );
}
