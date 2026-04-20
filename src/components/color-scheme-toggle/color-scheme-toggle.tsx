"use client";

import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <ActionIcon
      variant="light"
      color="indigo"
      size="lg"
      radius="md"
      onClick={() => setColorScheme(colorScheme === "dark" ? "light" : "dark")}
      className="transition-transform active:scale-95"
    >
      {colorScheme === "dark" ? (
        <IconSun stroke={2} size={20} />
      ) : (
        <IconMoon stroke={2} size={20} />
      )}
    </ActionIcon>
  );
}