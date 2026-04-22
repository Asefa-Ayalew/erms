"use client";

import { Avatar, Group, Menu, UnstyledButton, Text, Box } from '@mantine/core';
import { IconLogout, IconSettings, IconUser, IconChevronDown } from '@tabler/icons-react';
import { useState } from "react";
import { useClient } from "@/lib/hooks/useClient";
import { useUserInfo } from "@/lib/auth/hooks/user-info";

export function UserProfile() {
  const isClient = useClient();
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const user = useUserInfo();

  if (!isClient) {
    return null;
  }

  const initials = user.user
    ? user.user.name.split(' ').map((part: string) => part[0]).join('')
    : 'GU';

  return (
    <Menu
      width={260}
      position="bottom-end"
      transitionProps={{ transition: 'pop-top-right' }}
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton
          className={`flex items-center p-1.5 px-3 rounded-full transition-all duration-200 gap-3 border ${
            userMenuOpened
              ? 'bg-indigo-50 border-indigo-100 shadow-sm'
              : 'hover:bg-gray-50 border-transparent'
          }`}
        >
          <Group gap={12}>
            <Avatar radius="xl" size="md" color="indigo" className="shadow-sm">
              {initials}
            </Avatar>

            <Box className="hidden sm:block text-left">
              <Text size="sm" className="font-semibold text-gray-800 leading-tight">
                {user.user?.name ?? 'Guest'}
              </Text>
              <Text size="xs" color="dimmed" className="leading-tight">
                {user.user ? user.user.roles.join(', ') : 'Not signed in'}
              </Text>
            </Box>

            <IconChevronDown size={14} className="text-gray-400" />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown className="shadow-xl rounded-xl border-gray-100 p-2">
        <Menu.Label>Profile Settings</Menu.Label>

        <Menu.Item leftSection={<IconUser size={16} stroke={1.5} />} className="rounded-lg hover:bg-gray-50">
          My Account
        </Menu.Item>

        <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />} className="rounded-lg hover:bg-gray-50">
          Preferences
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          color="red"
          leftSection={<IconLogout size={16} stroke={1.5} />}
          className="rounded-lg hover:bg-red-50 font-medium"
          onClick={user.logout}
        >
          Log Out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}