"use client";
import { ActionIcon, Box, Drawer, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useToggle } from "react-use";

import { ColorSchemeToggle } from "@/components/color-scheme-toggle/color-scheme-toggle";
import { NotificationPreview } from "./notification-preview";
import { OrganizationSelector } from "./organization-selector";
import { UserProfile } from "./user-profile";
import { cn } from "@/lib/ui/utilities/cn";
import { Sidebar } from "./Sidebar";

type ShellProps = {
  children: ReactNode;
};

export function Shell({ children }: ShellProps): ReactNode {
  const [opened, { open, close }] = useDisclosure(false);
  const [isSidebarOpen, toggleSidebar] = useToggle(true);
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);

  // Hide sidebar and header on login page - only after hydration to prevent mismatch
  const isLoginPage = isHydrated && pathname === '/login';

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        close();
        if (isSidebarOpen) toggleSidebar(false);
      } else {
        if (!isSidebarOpen) toggleSidebar(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [close, toggleSidebar, isSidebarOpen]);

  useEffect(() => {
    if (pathname) {
      close();
      if (window.innerWidth <= 1024) {
        toggleSidebar(false);
      }
    }
  }, [pathname, close, toggleSidebar]);

  const handleMenuClick = () => {
    if (window.innerWidth <= 1024) {
      open();
    } else {
      toggleSidebar();
    }
  };

  return (
    <>
      <Box className="w-full flex h-screen bg-gray-50/30">
        {!isLoginPage && (
          <Box
            className={cn(
              "bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex-col z-20 transition-all duration-300 ease-in-out hidden lg:flex relative",
              isSidebarOpen
                ? "w-70 opacity-100"
                : "w-0 opacity-0 overflow-hidden",
            )}
          >
            {isSidebarOpen && <Sidebar />}
          </Box>
        )}

        <Box className="w-full flex flex-col flex-1 h-screen overflow-hidden">
          {!isLoginPage && (
            <header className="w-full h-16 py-2 px-4 lg:px-8 bg-white/80 backdrop-blur-md flex items-center justify-between border-b border-gray-100 z-10 sticky top-0 shadow-sm transition-all duration-300">
              <Group gap="md" align="center">
                <ActionIcon
                  variant="light"
                  color="indigo"
                  size="lg"
                  radius="md"
                  onClick={handleMenuClick}
                  className="transition-transform active:scale-95"
                >
                  {isSidebarOpen ? (
                    <IconMenu2 stroke={2} size={20} />
                  ) : (
                    <IconMenu2 stroke={2} size={20} />
                  )}
                </ActionIcon>

                <OrganizationSelector />
              </Group>

              <Group gap={16} align="center">
                <NotificationPreview />
                <ColorSchemeToggle />
                <Box className="h-8 w-px bg-gray-200 hidden sm:block" />
                <UserProfile />
              </Group>
            </header>
          )}

          <Box className={cn(
            "flex-1 overflow-y-auto",
            isLoginPage ? "p-0" : "p-4 lg:p-8 bg-gray-50/30"
          )}>
            {isLoginPage ? (
              <Box className="w-full h-full">
                {children}
              </Box>
            ) : (
              <Box className="max-w-7xl mx-auto h-full rounded-2xl bg-white shadow-sm border border-gray-100 p-6 lg:p-8">
                {children}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {!isLoginPage && (
        <Drawer
          opened={opened}
          onClose={close}
          size="xs"
          withCloseButton={false}
          padding={0}
          zIndex={100}
          transitionProps={{
            transition: "slide-right",
            duration: 250,
            timingFunction: "ease",
          }}
        >
          <Box className="relative h-full flex flex-col">
            <ActionIcon
              onClick={close}
              className="absolute top-4 right-4 z-50 bg-white shadow-sm border border-gray-100"
              radius="xl"
              size="md"
            >
              <IconX size={16} stroke={2} className="text-gray-600" />
            </ActionIcon>
            <Sidebar />
          </Box>
        </Drawer>
      )}
    </>
  );
}
