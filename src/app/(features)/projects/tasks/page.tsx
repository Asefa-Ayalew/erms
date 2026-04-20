'use client'

import React from 'react';
import { Card, Text, Title } from '@mantine/core';
import { userInfo } from '@/lib/auth/hooks/user-info';
import { AuthGuard } from '@/components/auth/AuthGuard';

const TaskManagement = () => {
  const user = userInfo();
  console.log("User info in TaskManagement page:", user); 
  return (
    <AuthGuard allowedRoles={['admin', 'user']}>
      <div className="space-y-6">
        <div>
          <Title order={2}>Task Management</Title>
          <Text c="dimmed">
            Signed in as {user.user?.name ?? user.user?.username ?? 'User'}.
          </Text>
        </div>

        <Card withBorder radius="md" padding="lg">
          <div className="space-y-2">
            <Text fw={600}>Task board components are missing from this workspace.</Text>
            <Text c="dimmed">
              The route is fixed and protected now, but the previous task board import cannot be
              restored until those component files are added back.
            </Text>
          </div>
        </Card>
      </div>
    </AuthGuard>
  );
};

export default TaskManagement;
