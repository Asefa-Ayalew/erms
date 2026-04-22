"use client";

import { ReactNode, useEffect } from "react";
import { Center, Loader, Text, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useUserInfo } from "@/lib/auth/hooks/user-info";

type AuthGuardProps = {
  children: ReactNode;
  allowedRoles?: string[];
};

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const user = useUserInfo();
  const router = useRouter();

  useEffect(() => {
    if (!user.isLoading && !user.isAuthenticated) {
      router.push("/login");
    }
  }, [user.isLoading, user.isAuthenticated, router]);

  if (user.isLoading) {
    return (
      <Center className="min-h-[60vh]">
        <Loader size="lg" />
      </Center>
    );
  }

  if (!user.isAuthenticated) {
    return (
      <Center className="min-h-[60vh]">
        <Loader size="lg" />
      </Center>
    );
  }

  if (allowedRoles && !allowedRoles.some((role) => user.hasRole(role))) {
    return (
      <Center className="min-h-[60vh]">
        <div className="space-y-2 text-center">
          <Title order={3}>Access denied</Title>
          <Text color="dimmed">Your account does not have permission to view this page.</Text>
        </div>
      </Center>
    );
  }

  return <>{children}</>;
}
