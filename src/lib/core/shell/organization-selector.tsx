import { Select } from "@mantine/core";
import { IconBuildingSkyscraper } from '@tabler/icons-react';

export function OrganizationSelector() {
  return (
    <Select
      placeholder="Select Organization"
      data={['ACME Corp', 'Stark Industries', 'Wayne Enterprises']}
      defaultValue="ACME Corp"
      variant="filled"
      radius="md"
      leftSection={<IconBuildingSkyscraper size={16} className="text-gray-500" />}
      styles={{
        input: {
          backgroundColor: '#f3f4f6',
          border: 'none',
          fontWeight: 500,
          color: '#1f2937',
          transition: 'background-color 0.2s ease',
          '&:focus': {
            backgroundColor: '#e5e7eb',
          },
        },
      }}
      className="hidden md:block w-48 shadow-sm transition-shadow hover:shadow-md rounded-md"
    />
  );
}
