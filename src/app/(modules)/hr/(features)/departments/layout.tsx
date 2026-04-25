"use client";

import { useParams, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  useCreateDepartmentMutation,
  useLazyGetArchivedDepartmentsQuery,
  useLazyGetDepartmentQuery,
  useLazyGetDepartmentsQuery,
  useUpdateDepartmentMutation,
} from "./_store/department.query";
import { CollectionQuery, EntityConfig, entityViewMode } from "@/lib/entity";
import { Department } from "../../models/department.model";
import EntityTable from "@/lib/entity/table/entity-table";
import { useDisclosure } from "@mantine/hooks";
import DepartmentForm from "./_component/department-form.component";
import {
  IconCheck,
  IconEdit,
  IconEye,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import DepartmentPreview from "./_component/department-preview.component";
import { notifications } from "@mantine/notifications";
export default function DepartmentListPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const searchParams = useSearchParams();
  const isArchived = searchParams.get("archived") === "true";
  const [viewMode, setViewMode] = useState<entityViewMode>("list");
  const [view, setView] = useState<"list" | "archived">("list");
  const [collectionQuery, setCollectionQuery] = useState<CollectionQuery>({
    skip: 0,
    take: 10,
  });
  const [opened, { open, close }] = useDisclosure(false);
  const [openedView, { open: openView, close: closeView }] =
    useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [item, setItem] = useState<Department | null>(null);

  const [
    getDepartments,
    { data: departments, isLoading: isLoadingDepartments },
  ] = useLazyGetDepartmentsQuery();

  const [getDepartment, { data: department }] = useLazyGetDepartmentQuery();

  const [
    createDepartment,
    { isLoading: creatingDepartment, isSuccess: isCreateSuccess },
  ] = useCreateDepartmentMutation();
  const [
    updateDepartment,
    { isLoading: updatingDepartment, isSuccess: isUpdateSuccess },
  ] = useUpdateDepartmentMutation();
  useEffect(() => {
    getDepartments({});
  }, [getDepartments]);

  useEffect(() => {
    getDepartment({ id: String(params.id) });
  }, [getDepartment, params.id]);

  useEffect(() => {
    setViewMode(params?.id !== undefined ? "detail" : "list");
  }, [params?.id]);

  useEffect(() => {
    if (isArchived) {
      setView("archived");
    } else {
      setView("list");
    }
  }, [isArchived]);

  const config = useMemo<EntityConfig<Department>>(
    () => ({
      primaryColumn: {
        key: "name",
        name: "Department Name",
        render: (data: Department) => `${data?.name ?? ""}`,
      },
      rootUrl: "/hr/departments",
      identity: "id",
      visibleColumn: [
        {
          key: "name",
          name: "Department Name",
          render: (data: Department) => `${data?.name ?? ""}`,
        },

        {
          key: "description",
          name: "Description",
          render: (data: Department) => (
            <div
              className="line-clamp-2"
              dangerouslySetInnerHTML={{ __html: data?.description ?? "" }}
            />
          ),
        },
      ],
      showDetail: false,
      actions: [
        {
          label: "View",
          icon: IconEye,
          key: "view",
          divider: true,
          onClick: (data) => {
            openView();
            setItem(data);
          },
        },
        {
          label: "Edit",
          icon: IconEdit,
          key: "edit",
          type: "primary",
          divider: true,
          onClick: (data) => {
            openEdit();
            setItem(data);
          },
        },
        {
          label: "Delete",
          icon: IconTrash,
          key: "delete",
          type: "danger",
          onClick: (data) => {
            openDelete();
            setItem(data);
          },
        },
      ],
    }),
    [],
  );

  const handlePaginationChange = useCallback((skip: number, top: number) => {
    setCollectionQuery((prev) => ({
      ...prev,
      skip,
      top,
    }));
  }, []);

  const onSearch = (search: string) => {
    setCollectionQuery((prev) => ({
      ...prev,
      skip: 0,
      search: search,
    }));
  };

  const onFilter = (filter: any[]) => {
    setCollectionQuery((prev) => ({
      ...prev,
      filter,
    }));
  };

  const onOrder = (order: { field: string; direction: "desc" | "asc" }) => {
    setCollectionQuery((prev) => ({
      ...prev,
      orderBy: [order],
    }));
  };

  const handleSubmit = async (values: any) => {
    try {
      if (values.id) {
        await updateDepartment(values).unwrap();
        closeEdit();
        notifications.show({
          title: "Success!",
          message: "Department updated successfully.",
          color: "teal",
          icon: <IconCheck size={18} />,
        });
      } else {
        await createDepartment(values).unwrap();
        close();
        notifications.show({
          title: "Success!",
          message: "Department created successfully.",
          color: "teal",
          icon: <IconCheck size={18} />,
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Something went wrong",
        color: "red",
        icon: <IconX size={18} />,
      });
    }
  };
  return (
    <>
      <EntityTable
        title="Departments"
        detailTitle={
          params.id !== "new"
            ? (department?.name ?? "Department Detail")
            : "New Department"
        }
        config={config}
        detail={children}
        items={Array.isArray(departments?.data) ? departments.data : []}
        total={departments?.count ?? 0}
        itemsLoading={isLoadingDepartments}
        collectionQuery={collectionQuery}
        view={view}
        viewMode={viewMode}
        showNewButton={view === "list"}
        onViewChange={setView}
        onPaginationChange={handlePaginationChange}
        onSearch={onSearch}
        onOrder={onOrder}
        onFilterChange={onFilter}
        handleAction={open}
      />
      <DepartmentForm
        editMode="new"
        opened={opened}
        onClose={close}
        onSubmit={handleSubmit}
      />
      <DepartmentPreview opened={openedView} onClose={closeView} data={item} />
      <DepartmentForm
        editMode="edit"
        data={item}
        opened={openedEdit}
        onClose={closeEdit}
        onSubmit={handleSubmit}
      />
    </>
  );
}
