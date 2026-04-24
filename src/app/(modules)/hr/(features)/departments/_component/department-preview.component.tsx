"use client";

import { Drawer, Text, Title, Group, Divider, Badge } from "@mantine/core";

interface DepartmentPreviewProps {
  opened: boolean;
  onClose: () => void;
  data?: {
    name?: string;
    description?: string;
  } | null;
}

export default function DepartmentPreview({
  opened,
  onClose,
  data,
}: DepartmentPreviewProps) {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="md"
      title="Department Preview"
      padding="lg"
      closeOnClickOutside
      closeOnEscape
    >
      <div className="flex flex-col gap-4">
        <Group className="flex justify-between items-center">
          <Title order={6}>
            {data?.name || "-"}
          </Title>

          <Badge color="green" variant="light">
            Department
          </Badge>
        </Group>

        <Divider />

        <div className="flex flex-col gap-2">
          <Text size="sm" className="text-gray-500">
            Description
          </Text>

          <div className="p-3 rounded-md bg-gray-50 border border-gray-200 text-gray-700 text-sm leading-relaxed">
            {data?.description ? (
              <div
                dangerouslySetInnerHTML={{ __html: data.description }}
              />
            ) : (
              <span className="text-gray-400">No description available</span>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
}