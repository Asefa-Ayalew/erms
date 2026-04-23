"use client";

import { Button, Group, Modal, NumberInput, Select, Stack, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import {
  PROJECT_STATUS_OPTIONS,
  type Project,
  type ProjectStatus,
} from "@/app/(features)/projects/models/project";
import type { ManagerOption } from "@/app/(features)/projects/queries/projects.api";

type FormValues = {
  name: string;
  description: string;
  location: string;
  budget: number;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  managerId: string;
};

const empty: FormValues = {
  name: "",
  description: "",
  location: "",
  budget: 0,
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date().toISOString().slice(0, 10),
  status: "planning",
  managerId: "",
};

type ProjectFormModalProps = {
  opened: boolean;
  onClose: () => void;
  project?: Project;
  managerOptions: ManagerOption[];
  saving: boolean;
  onSubmit: (values: Partial<Project>) => Promise<void>;
};

function fromProject(p: Project): FormValues {
  return {
    name: p.name,
    description: p.description,
    location: p.location,
    budget: p.budget,
    startDate: p.startDate,
    endDate: p.endDate,
    status: p.status,
    managerId: p.managerId,
  };
}

export function ProjectFormModal({
  opened,
  onClose,
  project,
  managerOptions,
  saving,
  onSubmit,
}: ProjectFormModalProps) {
  const form = useForm<FormValues>({
    initialValues: project ? fromProject(project) : empty,
    validate: {
      name: (v) => (v.trim() ? null : "Name is required"),
      managerId: (v) => (v ? null : "Manager is required"),
    },
  });

  useEffect(() => {
    if (!opened) {
      return;
    }
    if (project) {
      form.setValues(fromProject(project));
    } else {
      form.setValues({
        ...empty,
        managerId: managerOptions[0]?.value ?? "",
      });
    }
  }, [opened, project?.id, project, managerOptions]);

  const handleSubmit = form.onSubmit(async (values) => {
    await onSubmit({
      name: values.name.trim(),
      description: values.description.trim(),
      location: values.location.trim(),
      budget: values.budget,
      startDate: values.startDate,
      endDate: values.endDate,
      status: values.status,
      managerId: values.managerId,
    });
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={project ? "Edit project" : "New project"}
      size="lg"
      radius="md"
      overlayProps={{ backgroundOpacity: 0.4, blur: 2 }}
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            withAsterisk
            label="Name"
            placeholder="Project name"
            autoFocus
            {...form.getInputProps("name")}
          />
          <Textarea
            minRows={3}
            label="Description"
            placeholder="What this project is about"
            {...form.getInputProps("description")}
          />
          <TextInput
            label="Location"
            placeholder="City, site, or remote"
            {...form.getInputProps("location")}
          />
          <NumberInput
            label="Budget"
            min={0}
            clampBehavior="strict"
            thousandSeparator=","
            prefix="$ "
            {...form.getInputProps("budget")}
          />
          <Group grow>
            <TextInput type="date" label="Start date" {...form.getInputProps("startDate")} />
            <TextInput type="date" label="End date" {...form.getInputProps("endDate")} />
          </Group>
          <Select
            label="Status"
            data={PROJECT_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            {...form.getInputProps("status")}
          />
          <Select
            withAsterisk
            label="Manager"
            placeholder="Select manager"
            data={managerOptions}
            value={form.values.managerId}
            onChange={(v) => form.setFieldValue("managerId", v ?? "")}
            error={form.errors.managerId}
            searchable
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {project ? "Save changes" : "Create project"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
