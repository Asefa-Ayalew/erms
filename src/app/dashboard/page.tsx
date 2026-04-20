"use client";

import { Card, Text, Title } from "@mantine/core";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { userInfo } from "@/lib/auth/hooks/user-info";

export default function DashboardPage() {
  const user = userInfo();

  return (
    <AuthGuard allowedRoles={["admin", "user"]}>
      <div className="space-y-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Title order={2}>Dashboard</Title>
            <Text color="dimmed">A protected page that requires authentication.</Text>
          </div>
        </div>

        <Card shadow="sm" radius="md" withBorder>
          <div className="space-y-3">
            <Text size="lg" fw={600}>
              Welcome back, {user.user?.name}
            </Text>
            <Text color="dimmed">Your account roles: {user.user?.roles.join(", ")}</Text>
          </div>
        </Card>
      </div>
    </AuthGuard>
  );
}
