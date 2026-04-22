"use client";

import {
  Badge,
  Button,
  Card,
  Grid,
  Group,
  RingProgress,
  SegmentedControl,
  Progress,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconAdjustmentsHorizontal,
  IconDots,
  IconPackage,
  IconSearch,
  IconTargetArrow,
  IconUsers,
} from "@tabler/icons-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useUserInfo } from "@/lib/auth/hooks/user-info";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState } from "react";

type DashboardTab = "Dashboard" | "HR" | "Inventory" | "Project Management";

type ModuleDashboardConfig = {
  heading: string;
  balanceLabel: string;
  balanceValue: string;
  plannedSpendLabel: string;
  plannedSpendValue: string;
  outcomeLabel: string;
  outcomeValue: string;
  deliverableLabel: string;
  deliverableValue: string;
  breakdown: { label: string; amount: string; progress: number }[];
  trendData: { name: string; value: number }[];
  deliverableData: { name: string; value: number }[];
  statusLabel: string;
  statusIcon: React.ReactNode;
};

const moduleDashboards: Record<DashboardTab, ModuleDashboardConfig> = {
  Dashboard: {
    heading: "Enterprise overview",
    balanceLabel: "Operational performance",
    balanceValue: "84%",
    plannedSpendLabel: "Resource utilization",
    plannedSpendValue: "72%",
    outcomeLabel: "Overall execution",
    outcomeValue: "91%",
    deliverableLabel: "Department completion",
    deliverableValue: "38 Milestones",
    statusLabel: "Cross-module status",
    statusIcon: <IconPackage size={18} className="text-blue-600" />,
    trendData: [
      { name: "Mon", value: 64 },
      { name: "Tue", value: 72 },
      { name: "Wed", value: 69 },
      { name: "Thu", value: 78 },
      { name: "Fri", value: 84 },
    ],
    deliverableData: [
      { name: "HR", value: 30 },
      { name: "Inventory", value: 26 },
      { name: "Projects", value: 24 },
      { name: "Users", value: 18 },
    ],
    breakdown: [
      { label: "Human Resources", amount: "85%", progress: 85 },
      { label: "Inventory Operations", amount: "72%", progress: 72 },
      { label: "Project Delivery", amount: "91%", progress: 91 },
    ],
  },
  HR: {
    heading: "Human resource dashboard",
    balanceLabel: "Attendance compliance",
    balanceValue: "93%",
    plannedSpendLabel: "HR process progress",
    plannedSpendValue: "76%",
    outcomeLabel: "Workforce health",
    outcomeValue: "88%",
    deliverableLabel: "HR activities",
    deliverableValue: "24 Activities",
    statusLabel: "HR execution status",
    statusIcon: <IconUsers size={18} className="text-blue-600" />,
    trendData: [
      { name: "Mon", value: 88 },
      { name: "Tue", value: 91 },
      { name: "Wed", value: 90 },
      { name: "Thu", value: 94 },
      { name: "Fri", value: 93 },
    ],
    deliverableData: [
      { name: "Attendance", value: 34 },
      { name: "Payroll", value: 22 },
      { name: "Leaves", value: 16 },
      { name: "Performance", value: 14 },
    ],
    breakdown: [
      { label: "Onboarding", amount: "82%", progress: 82 },
      { label: "Payroll Processing", amount: "94%", progress: 94 },
      { label: "Performance Reviews", amount: "76%", progress: 76 },
    ],
  },
  Inventory: {
    heading: "Inventory dashboard",
    balanceLabel: "Stock accuracy",
    balanceValue: "89%",
    plannedSpendLabel: "Inventory process progress",
    plannedSpendValue: "68%",
    outcomeLabel: "Supply chain execution",
    outcomeValue: "86%",
    deliverableLabel: "Inventory transactions",
    deliverableValue: "41 Transactions",
    statusLabel: "Inventory execution status",
    statusIcon: <IconPackage size={18} className="text-blue-600" />,
    trendData: [
      { name: "Mon", value: 58 },
      { name: "Tue", value: 64 },
      { name: "Wed", value: 61 },
      { name: "Thu", value: 70 },
      { name: "Fri", value: 74 },
    ],
    deliverableData: [
      { name: "Receiving", value: 28 },
      { name: "Issuing", value: 33 },
      { name: "Transfers", value: 19 },
      { name: "Returns", value: 12 },
    ],
    breakdown: [
      { label: "Stock Reconciliation", amount: "89%", progress: 89 },
      { label: "Purchase Orders", amount: "67%", progress: 67 },
      { label: "Warehouse Allocation", amount: "73%", progress: 73 },
    ],
  },
  "Project Management": {
    heading: "Project management dashboard",
    balanceLabel: "Schedule adherence",
    balanceValue: "81%",
    plannedSpendLabel: "Project flow progress",
    plannedSpendValue: "74%",
    outcomeLabel: "Delivery confidence",
    outcomeValue: "87%",
    deliverableLabel: "Project outputs",
    deliverableValue: "29 Deliverables",
    statusLabel: "Project execution status",
    statusIcon: <IconTargetArrow size={18} className="text-blue-600" />,
    trendData: [
      { name: "Mon", value: 54 },
      { name: "Tue", value: 62 },
      { name: "Wed", value: 59 },
      { name: "Thu", value: 66 },
      { name: "Fri", value: 71 },
    ],
    deliverableData: [
      { name: "Tasks Done", value: 36 },
      { name: "Milestones", value: 17 },
      { name: "Risks Closed", value: 14 },
      { name: "Reviews", value: 22 },
    ],
    breakdown: [
      { label: "Sprint Completion", amount: "81%", progress: 81 },
      { label: "Milestone Tracking", amount: "74%", progress: 74 },
      { label: "Team Throughput", amount: "87%", progress: 87 },
    ],
  },
};

function ModuleProgressRows({ rows }: { rows: ModuleDashboardConfig["breakdown"] }) {
  return (
    <Stack gap="sm">
      {rows.map((item) => (
        <div key={item.label}>
          <Group justify="space-between" mb={4}>
            <div>
              <Text fw={600} size="sm">
                {item.label}
              </Text>
              <Text size="xs" c="dimmed">
                Target: {item.amount}
              </Text>
            </div>
            <Text size="xs" c="dimmed">
              {item.progress}%
            </Text>
          </Group>
          <Progress value={item.progress} color="blue" radius="xl" size="sm" />
        </div>
      ))}
    </Stack>
  );
}

export default function DashboardPage() {
  const user = useUserInfo();
  const [activeTab, setActiveTab] = useState<DashboardTab>("Dashboard");
  const dashboard = moduleDashboards[activeTab];

  return (
    <AuthGuard>
      <div className="space-y-5">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2}>Dashboard</Title>
            <Text size="sm" c="dimmed">
              {dashboard.heading} - Welcome back, {user.user?.name ?? "User"}
            </Text>
          </div>
          <Group gap="sm">
            <TextInput
              placeholder="Search"
              leftSection={<IconSearch size={14} />}
              className="min-w-52"
            />
            <Button variant="default" leftSection={<IconAdjustmentsHorizontal size={14} />}>
              Filter
            </Button>
          </Group>
        </Group>

        <SegmentedControl
          fullWidth
          color="blue"
          data={["Dashboard", "HR", "Inventory", "Project Management"]}
          value={activeTab}
          onChange={(value) => setActiveTab(value as DashboardTab)}
        />

        <Grid gap="md">
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Card withBorder radius="lg">
              <Group justify="space-between" mb="xs">
                <Text c="dimmed" size="sm">
                  {dashboard.balanceLabel}
                </Text>
                <Badge variant="light" color="gray">
                  This week
                </Badge>
              </Group>
              <Title order={2} mb="sm">
                {dashboard.balanceValue}
              </Title>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboard.trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef2ff" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#94a3b8" />
                    <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#2563eb" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Card withBorder radius="lg">
              <Group justify="space-between" mb="xs">
                <Text c="dimmed" size="sm">
                  {dashboard.plannedSpendLabel}
                </Text>
                <IconDots size={16} className="text-gray-500" />
              </Group>
              <Title order={2} mb="md">
                {dashboard.plannedSpendValue}
              </Title>
              <ModuleProgressRows rows={dashboard.breakdown} />
            </Card>
          </Grid.Col>
        </Grid>

        <Grid gap="md">
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Card withBorder radius="lg">
              <Group justify="space-between" mb="xs">
                <Text c="dimmed" size="sm">
                  {dashboard.outcomeLabel}
                </Text>
                <Badge variant="light" color="gray">
                  This week
                </Badge>
              </Group>
              <Title order={2}>{dashboard.outcomeValue}</Title>
              <Group justify="space-between" mt="md">
                <RingProgress
                  size={190}
                  thickness={28}
                  roundCaps
                  sections={[
                    { value: 40, color: "blue" },
                    { value: 38, color: "violet" },
                    { value: 22, color: "cyan" },
                  ]}
                  label={
                    <Text ta="center" fw={700} size="lg">
                      100%
                    </Text>
                  }
                />
                <Stack gap="sm">
                  <Group gap={8}>
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600 inline-block" />
                    <Text size="sm">Shipping and logistics</Text>
                  </Group>
                  <Text fw={700} mt={-6}>
                    {dashboard.breakdown[0]?.amount}
                  </Text>

                  <Group gap={8}>
                    <span className="h-2.5 w-2.5 rounded-full bg-violet-500 inline-block" />
                    <Text size="sm">Marketing and Advertising</Text>
                  </Group>
                  <Text fw={700} mt={-6}>
                    {dashboard.breakdown[1]?.amount}
                  </Text>

                  <Group gap={8}>
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-500 inline-block" />
                    <Text size="sm">Taxes</Text>
                  </Group>
                  <Text fw={700} mt={-6}>
                    {dashboard.breakdown[2]?.amount}
                  </Text>
                </Stack>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Card withBorder radius="lg">
              <Group justify="space-between" mb="xs">
                <Text c="dimmed" size="sm">
                  {dashboard.deliverableLabel}
                </Text>
                <Group gap={8}>
                  <Badge variant="light" color="gray">
                    This week
                  </Badge>
                  <IconDots size={16} className="text-gray-500" />
                </Group>
              </Group>
              <Title order={2} mb="sm">
                {dashboard.deliverableValue}
              </Title>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboard.deliverableData} layout="vertical" margin={{ left: 14 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef2ff" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={90} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#2563eb" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Grid.Col>
        </Grid>

        <Card withBorder radius="lg">
          <Group justify="space-between">
            <Group gap={8}>
              {dashboard.statusIcon}
              <Text fw={600}>{dashboard.statusLabel}</Text>
            </Group>
            <Badge color="blue" variant="light">
              Roles: {user.user?.roles.join(", ") ?? "N/A"}
            </Badge>
          </Group>
        </Card>
      </div>
    </AuthGuard>
  );
}
