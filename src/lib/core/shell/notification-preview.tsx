import { cn } from "@/lib/ui/utilities/cn";
import {
  ActionIcon,
  Indicator,
  Popover,
  Text,
  Box,
  Avatar,
  Stack,
  Group,
  ThemeIcon,
  Divider,
  UnstyledButton,
} from "@mantine/core";
import {
  IconBell,
  IconSettings,
  IconMessageCircle,
  IconCheck,
} from "@tabler/icons-react";
import { useState } from "react";

export function NotificationPreview() {
  const [opened, setOpened] = useState(false);

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom-end"
      withArrow
      shadow="xl"
      transitionProps={{ transition: "pop-top-right" }}
    >
      <Popover.Target>
        <ActionIcon
          variant="subtle"
          onClick={() => setOpened((o) => !o)}
          size="lg"
          radius="md"
          className={cn(
            "transition-all hover:bg-gray-100",
            opened && "bg-gray-100",
          )}
        >
          <Indicator color="red" size={9} offset={5} processing>
            <IconBell stroke={1.5} size={22} className="text-gray-700" />
          </Indicator>
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown
        p={0}
        className="rounded-xl border border-gray-100 shadow-2xl overflow-hidden w-80"
      >
        <Box className="p-4 bg-linear-to-r from-indigo-50 to-white flex items-center justify-between">
          <Text className="font-semibold text-gray-800">Notifications</Text>
          <ActionIcon variant="transparent" size="sm" color="indigo">
            <IconCheck size={16} />
          </ActionIcon>
        </Box>
        <Divider />
        <Stack gap={0}>
          {[
            {
              icon: IconMessageCircle,
              color: "blue",
              title: "New Message",
              desc: "Alice sent you a message",
              time: "5m ago",
            },
            {
              icon: IconSettings,
              color: "grape",
              title: "System Update",
              desc: "Version 2.0 is deployed",
              time: "2h ago",
            },
          ].map((item, i) => (
            <UnstyledButton
              key={i}
              className="p-4 hover:bg-gray-50 transition-colors flex gap-3 text-left border-b border-gray-50 last:border-0"
            >
              <ThemeIcon
                variant="light"
                color={item.color}
                size="lg"
                radius="xl"
              >
                <item.icon size={18} />
              </ThemeIcon>
              <Box className="flex-1">
                <Text size="sm" className="font-medium text-gray-900">
                  {item.title}
                </Text>
                <Text size="xs" color="dimmed" className="mt-0.5">
                  {item.desc}
                </Text>
              </Box>
              <Text size="xs" color="dimmed" className="whitespace-nowrap">
                {item.time}
              </Text>
            </UnstyledButton>
          ))}
        </Stack>
        <Box className="p-3 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
          <Text size="sm" className="text-indigo-600 font-medium">
            View all
          </Text>
        </Box>
      </Popover.Dropdown>
    </Popover>
  );
}
