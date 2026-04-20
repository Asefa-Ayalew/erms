"use client";

import { Button, Group, useMantineColorScheme } from "@mantine/core";

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();

  return (
    <Group justify="center" mt="xl" className="flex space-x-4">
      <Button onClick={() => setColorScheme("light")}>Light</Button>
      <Button onClick={() => setColorScheme("dark")}>Dark</Button>
      <Button onClick={() => setColorScheme("auto")}>Auto</Button>
    </Group>
  );
}
