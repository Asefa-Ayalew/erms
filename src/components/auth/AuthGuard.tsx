"use client";

import { ReactNode, useEffect } from "react";
import { Center, Loader, Text, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/hooks/useAuth";

type AuthGuardProps = {
  children: ReactNode;
  allowedRoles?: string[];
};

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.push("/login");
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

  if (auth.isLoading) {
    return (
      <Center className="min-h-[60vh]">
        <Loader size="lg" />
      </Center>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <Center className="min-h-[60vh]">
        <Loader size="lg" />
      </Center>
    );
  }

  if (allowedRoles && !allowedRoles.some((role) => auth.hasRole(role))) {
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
