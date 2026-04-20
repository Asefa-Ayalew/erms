import { useNetwork } from "@mantine/hooks";
import Link from "next/link";
import { Box, Text } from "@mantine/core";
import { IconFlame } from "@tabler/icons-react";

import { OfficeMenus } from "./menus";
import { SideMenu } from "./side-menu";

export const Sidebar = () => {
  const networkStatus = useNetwork();
  const year = new Date().getFullYear();

  return (
    <>
      <Box className="hidden md:flex h-16 border-b border-gray-100 px-6 max-h-16 overflow-hidden w-full items-center bg-white">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 no-underline"
        >
          <Box className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 to-violet-500 shadow-md shadow-indigo-100">
            <IconFlame size={22} stroke={2} className="text-white" />
          </Box>
          <Box>
            <Text size="lg" className="font-semibold text-slate-900 tracking-tight">
              ERMS
            </Text>
            <Text size="xs" className="text-slate-500 italic mt-0.5">
              Enterprise resource management
            </Text>
          </Box>
        </Link>
      </Box>

      <Box className="flex-1 overflow-y-auto bg-gray-50/50">
        <SideMenu menu={OfficeMenus()} />
      </Box>

      <Box className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 bg-white text-xs text-gray-500 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <Box className="flex items-center justify-between">
          <Box className="flex items-center gap-2">
            <Box
              className={`w-2 h-2 rounded-full ${networkStatus.online ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"}`}
            />
            <Text size="xs" className="font-medium text-gray-600">
              {networkStatus.online ? "System Online" : "System Offline"}
            </Text>
          </Box>
          <Text size="xs" color="dimmed" className="font-mono">
            {process.env.NEXT_PUBLIC_VERSION ?? "v1.0.0"}
          </Text>
        </Box>
        <Box className="flex justify-between items-center opacity-80 pt-1 border-t border-gray-50">
          <Text size="xs">
            &copy; {year} {"Super soft"}
          </Text>
          <Text size="xs" className="font-medium text-indigo-500">
            Powered by Supersoft
          </Text>
        </Box>
      </Box>
    </>
  );
};
