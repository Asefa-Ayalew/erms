"use client";

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Paper,
  ScrollArea,
  Skeleton,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { Project, ProjectStatus, projectStatusLabel } from "../models/project";
import {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useGetManagerOptionsQuery,
  useGetProjectsQuery,
  useUpdateProjectMutation,
} from "../queries/projects.api";
import { useUserInfo } from "@/lib/auth/hooks/user-info";
import { ProjectFormModal } from "./project-form-modal";

function statusColor(status: ProjectStatus): string {
  const map: Record<ProjectStatus, string> = {
    planning: "gray",
    active: "blue",
    in_progress: "violet",
    on_hold: "yellow",
    completed: "green",
    cancelled: "red",
  };
  return map[status] ?? "gray";
}

const money = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function ProjectsContent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const user = useUserInfo();

  const { data: projects, isLoading, isFetching } = useGetProjectsQuery();
  const { data: managerOptions = [] } = useGetManagerOptionsQuery();

  const [createProject, { isLoading: creating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: updating }] = useUpdateProjectMutation();
  const [deleteProject, { isLoading: deleting }] = useDeleteProjectMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | undefined>();

  const canEdit =
    user?.hasRole?.("admin") ||
    user?.hasRole?.("manager") ||
    user?.hasRole?.("project_manager");

  const managerById = useMemo(() => {
    const m = new Map<string, string>();
    for (const o of managerOptions) {
      m.set(o.value, o.label);
    }
    return m;
  }, [managerOptions]);

  const saving = creating || updating;

  const list = useMemo<Project[]>(() => {
    if (Array.isArray(projects)) return projects as Project[];
    if (Array.isArray((projects as any)?.data)) return (projects as any).data;
    if (Array.isArray((projects as any)?.items)) return (projects as any).items;
    return [];
  }, [projects]);

  const tableBusy = isLoading || isFetching;

  const openCreate = () => {
    setEditing(undefined);
    setModalOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setModalOpen(true);
  };

  const handleSubmit = async (values: Partial<Project>) => {
    try {
      if (editing) {
        await updateProject({ id: editing.id, payload: values }).unwrap();
      } else {
        await createProject(values).unwrap();
      }
      setModalOpen(false);
      setEditing(undefined);
    } catch {}
  };

  const handleDelete = (p: Project) => {
    if (typeof window !== "undefined" && window.confirm(`Delete “${p.name}”?`)) {
      void deleteProject(p.id);
    }
  };

  // SSR safety (optional but good)
  if (!mounted) {
    return (
      <Box className="max-w-[1200px] mx-auto w-full">
        <Skeleton height={40} width="40%" mb="md" />
        <Skeleton height={300} />
      </Box>
    );
  }

  return (
    <Box className="max-w-[1200px] mx-auto w-full">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Projects</Title>
          <Text size="sm" c="dimmed">
            Manage projects and assignments
          </Text>
        </div>

        {canEdit && (
          <Button leftSection={<IconPlus size={18} />} onClick={openCreate}>
            New project
          </Button>
        )}
      </Group>

      <Paper withBorder radius="lg">
        <ScrollArea>
          <Table striped highlightOnHover stickyHeader>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Project</Table.Th>
                <Table.Th>Location</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th className="text-right">Budget</Table.Th>
                <Table.Th>Start</Table.Th>
                <Table.Th>End</Table.Th>
                <Table.Th>Manager</Table.Th>
                {canEdit && <Table.Th className="text-right">Actions</Table.Th>}
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {tableBusy ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Table.Tr key={i}>
                    {Array.from({ length: canEdit ? 8 : 7 }).map((_, j) => (
                      <Table.Td key={j}>
                        <Skeleton height={20} />
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))
              ) : list.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={canEdit ? 8 : 7}>
                    <Text ta="center" c="dimmed" py="xl">
                      No projects found
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                list.map((p) => (
                  <Table.Tr key={p.id}>
                    <Table.Td>{p.name}</Table.Td>
                    <Table.Td>{p.location || "—"}</Table.Td>
                    <Table.Td>
                      <Badge color={statusColor(p.status)}>
                        {projectStatusLabel(p.status)}
                      </Badge>
                    </Table.Td>
                    <Table.Td className="text-right">
                      {money.format(p.budget)}
                    </Table.Td>
                    <Table.Td>{p.startDate}</Table.Td>
                    <Table.Td>{p.endDate}</Table.Td>
                    <Table.Td>
                      {p.managerId ? managerById.get(p.managerId) ?? p.managerId : "—"}
                    </Table.Td>

               
                      <Table.Td className="text-right">
                        <Group gap="xs" justify="flex-end">
                          <ActionIcon onClick={() => openEdit(p)}>
                            <IconEdit size={18} />
                          </ActionIcon>
                          <ActionIcon color="red" onClick={() => handleDelete(p)}>
                            <IconTrash size={18} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>

      <ProjectFormModal
        key={editing?.id ?? "create"}
        opened={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(undefined);
        }}
        project={editing}
        managerOptions={managerOptions}
        saving={saving}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}