"use client";

import { Card, Text, Group, SimpleGrid, Badge, Title } from "@mantine/core";
import type { Employee, EmploymentStatus } from "../../../models/employee.model";

const statusColor: Record<EmploymentStatus, string> = {
  active: "green",
  inactive: "gray",
  terminated: "red",
};

export default function EmployeePreview({ data }: { data?: Partial<Employee> | null }) {
  const label = (text: string, value: string | undefined) => (
    <div>
      <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
        {text}
      </Text>
      <Text size="sm">{value && String(value).trim() !== "" ? value : "—"}</Text>
    </div>
  );

  return (
    <Card withBorder padding="md" className="h-full bg-gray-50/80">
      <Group justify="space-between" mb="md">
        <Title order={5}>Preview</Title>
        {data?.employmentStatus && (
          <Badge color={statusColor[data.employmentStatus as EmploymentStatus] ?? "blue"}>
            {data.employmentStatus}
          </Badge>
        )}
      </Group>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        {label("Employee code", data?.employeeCode)}
        {label("First name", data?.firstName)}
        {label("Father name", data?.fatherName)}
        {label("Grandfather name", data?.gFatherName)}
        {label("TIN", data?.tin)}
        {label("FAN", data?.fan)}
        {label("Gender", data?.gender)}
        {label("Date of birth", data?.dateOfBirth)}
        {label("Phone", data?.phone)}
        {label("Email", data?.email)}
        {label("Hire date", data?.hireDate)}
        {label("Department ID", data?.departmentId)}
        {label("Position ID", data?.positionId)}
      </SimpleGrid>
    </Card>
  );
}
