"use client";

import { useParams, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  useLazyGetEmployeeQuery,
  useLazyGetEmployeesQuery,
} from "./_store/employee.query";
import { CollectionQuery, EntityConfig, entityViewMode } from "@/lib/entity";
import type { Employee, EmploymentStatus } from "../../models/employee.model";
import EntityTable from "@/lib/entity/table/entity-table";
import { Badge } from "@mantine/core";
const statusColor: Record<EmploymentStatus, string> = {
  active: "green",
  inactive: "gray",
  terminated: "red",
};

export default function EmployeesLayoutPage({
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

  const [getEmployees, { data: employees, isLoading: isLoadingEmployees }] =
    useLazyGetEmployeesQuery();
  const [getEmployee, { data: employee }] = useLazyGetEmployeeQuery();

  useEffect(() => {
    getEmployees({
      ...collectionQuery,
      withArchived: view === "archived",
      // includes: ["department", "position"],
    });
  }, [getEmployees, collectionQuery, view]);

  useEffect(() => {
    const pid = params?.id;
    if (pid && pid !== "new") {
      getEmployee({ id: String(pid) });
    }
  }, [getEmployee, params?.id]);

  useEffect(() => {
    setViewMode(params?.id !== undefined ? "detail" : "list");
  }, [params?.id]);

  useEffect(() => {
    setView(isArchived ? "archived" : "list");
  }, [isArchived]);
  const statusColor: Record<EmploymentStatus, string> = {
    active: "green",
    inactive: "gray",
    terminated: "red",
  };

  const config = useMemo<EntityConfig<Employee>>(
    () => ({
      primaryColumn: {
        key: "firstName",
        name: "Name",
        render: (row: Employee) =>
          `${row.firstName ?? ""} ${row.employeeCode ? `· ${row.employeeCode}` : ""}`.trim(),
      },
      rootUrl: "/hr/employees",
      identity: "id",
      visibleColumn: [
        {
          key: "employeeCode",
          name: "Code",
          render: (row: Employee) => row.employeeCode ?? "",
        },
        {
          key: "firstName",
          name: "First name",
          render: (row: Employee) => row.firstName ?? "",
        },
        {
          key: "email",
          name: "Email",
          render: (row: Employee) => row.email ?? "",
        },
        {
          key: "employmentStatus",
          name: "Status",
          render: (row: Employee) => (
            <Badge
              className="!lowercase"
              color={
                statusColor[row.employmentStatus as EmploymentStatus] ?? "blue"
              }
            >
              {row.employmentStatus}
            </Badge>
          ),
        },
      ],
      hasActions: false,
      showDetail: true,
    }),
    [],
  );

  const handlePaginationChange = useCallback((skip: number, take: number) => {
    setCollectionQuery((prev) => ({
      ...prev,
      skip,
      take,
    }));
  }, []);

  const onSearch = (search: string) => {
    setCollectionQuery((prev) => ({
      ...prev,
      skip: 0,
      search,
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
      skip: 0,
      sortBy: [order],
    }));
  };

  const detailLabel =
    params.id === "new"
      ? "New employee"
      : [employee?.firstName, employee?.employeeCode]
          .filter(Boolean)
          .join(" · ") || "Employee";

  return (
    <EntityTable
      title="Employees"
      detailTitle={params.id !== undefined ? detailLabel : "Employees"}
      config={config}
      detail={children}
      items={Array.isArray(employees?.data) ? employees.data : []}
      total={employees?.total ?? 0}
      itemsLoading={isLoadingEmployees}
      collectionQuery={collectionQuery}
      view={view}
      viewMode={viewMode}
      showNewButton={view === "list"}
      showArchivedList={false}
      onViewChange={setView}
      onPaginationChange={handlePaginationChange}
      onSearch={onSearch}
      onOrder={onOrder}
      onFilterChange={onFilter}
    />
  );
}
