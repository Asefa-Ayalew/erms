"use client";
import { ScrollArea, Box, Text, UnstyledButton } from "@mantine/core";
// biome-ignore lint/nursery/noRestrictedImports: <explanation>
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import classes from "./SideMenu.module.css";
import { cn } from "@/lib/ui/utilities/cn";
export type MenuTree = {
  isGroup?: boolean;
  hasMore?: boolean;
  label: string;
  icon?: React.ReactNode;
  link?: string;
  isExternal?: string;
  children?: MenuTree[];
  pathMatch?: number;
  /** If set, the item is shown only when the user has at least one of these roles (case-insensitive). If omitted, any authenticated user may see it. */
  allowedRoles?: string[];
};

type MenuItemProps = {
  data: MenuTree;
  level?: number;
};

const startsWith = (str: string, prefix: string) => str.startsWith(prefix);

function haveSameParentAtLevel(
  path1: string,
  path2: string,
  pathMatch: number,
): boolean {
  const getParentAtLevel = (path: string, level: number): string | undefined =>
    path.split("/").filter(Boolean)[level - 1];

  const parent1 = getParentAtLevel(path1, pathMatch);
  const parent2 = getParentAtLevel(path2, pathMatch);

  return parent1 !== undefined && parent1 === parent2;
}

const findActiveSubMenu = (data: MenuTree[], pathname: string): string[] => {
  let activeMenus: string[] = [];

  for (const item of data) {
    if (item.link && pathname.startsWith(item.link)) {
      activeMenus.push(item.label);
      if (item.children) {
        const childActiveMenus = findActiveSubMenu(item.children, pathname);
        activeMenus = activeMenus.concat(childActiveMenus);
      }
    } else if (item.children) {
      const childActiveMenus = findActiveSubMenu(item.children, pathname);
      activeMenus = activeMenus.concat(childActiveMenus);
    }
  }

  return activeMenus;
};

const MenuItem = ({ data, level = 0 }: MenuItemProps) => {
  const { isGroup, label, link, icon, children, pathMatch: compare } = data;
  const pathname = usePathname();
  const router = useRouter();

  // Start with menus expanded by default
  const [expanded, setExpanded] = useState(true);

  // Check if this is a main group that should have expand/collapse
  const isExpandableGroup = ['Human Resource', 'Project Management', 'Inventory', 'Administration'].includes(label);

  const isActiveChildren = useMemo(() => {
    if (children?.length) {
      const foundActiveMenus = findActiveSubMenu(children, pathname);
      return foundActiveMenus.length > 0;
    }
    return false;
  }, [pathname, children]);

  const hasChildren = (children?.length ?? 0) > 0;
  const isActive = link && (startsWith(pathname, link) || haveSameParentAtLevel(pathname, link, compare || 3));

  const handleToggle = () => {
    if (link && !hasChildren && !isGroup) {
      router.push(link);
      return;
    }

    if (hasChildren && (isExpandableGroup || !isGroup)) {
      setExpanded(!expanded);
    }
  };

  return (
    <li className="relative">
      {isGroup ? (
        isExpandableGroup ? (
          <UnstyledButton
            onClick={handleToggle}
            className={cn(
              "w-full text-left flex items-center justify-between rounded-lg px-3 py-2.5 transition-all duration-200 ease-in-out mb-2",
              "hover:bg-blue-50 hover:text-blue-700",
              "font-semibold text-sm uppercase tracking-wide border-l-2 border-blue-200",
              expanded
                ? "bg-blue-50 text-blue-700"
                : isActiveChildren
                  ? "bg-blue-50 text-blue-700 translate-x-0.5"
                  : "bg-gray-50 text-gray-700",
            )}
          >
            <Box className="flex items-center gap-3 flex-1 min-w-0">
              {icon && (
                <Box className="shrink-0 w-5 h-5 text-blue-600">
                  {icon}
                </Box>
              )}
              <Text className="truncate font-semibold text-sm">
                {label}
              </Text>
            </Box>

            <Box className="shrink-0 ml-2">
              {expanded ? (
                <IconChevronDown size={16} className="text-blue-600 transition-transform duration-200" />
              ) : (
                <IconChevronRight size={16} className="text-gray-500 transition-transform duration-200" />
              )}
            </Box>
          </UnstyledButton>
        ) : (
          <Box className="mb-2">
            <Text className={cn(classes.groupLabel, "px-3")}>{label}</Text>
          </Box>
        )
      ) : (
        <UnstyledButton
          onClick={handleToggle}
          className={cn(
            classes.menuItem,
            "group w-full text-left flex items-center justify-between rounded-lg px-3 py-2.5 transition-all duration-200 ease-in-out",
            "hover:bg-blue-50 hover:text-blue-700",
            level > 0 && "ml-6",
            (isActive || isActiveChildren) && "bg-blue-50 text-blue-700 font-medium translate-x-0.5",
          )}
        >
          <Box className="flex items-center gap-3 flex-1 min-w-0">
            {icon && (
              <Box className={cn(
                "shrink-0 w-5 h-5 text-gray-500 group-hover:text-blue-600",
                (isActive || isActiveChildren) && "text-blue-600",
              )}>
                {icon}
              </Box>
            )}
            <Text
              size="sm"
              className="truncate font-medium"
              style={{ color: 'inherit' }}
            >
              {label}
            </Text>
          </Box>

          {hasChildren && (
            <Box className="shrink-0 ml-2">
              {expanded ? (
                <IconChevronDown
                  size={16}
                  className="text-gray-400 transition-transform duration-200"
                />
              ) : (
                <IconChevronRight
                  size={16}
                  className="text-gray-400 transition-transform duration-200"
                />
              )}
            </Box>
          )}
        </UnstyledButton>
      )}

      {hasChildren && !isGroup && (
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            expanded ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
          )}
        >
          <ul className="space-y-1 py-1">
            {(children ?? []).map((child) => (
              <MenuItem
                data={child}
                level={level + 1}
                key={`${child.label}-${child.link}`}
              />
            ))}
          </ul>
        </div>
      )}

      {isGroup && hasChildren && isExpandableGroup && (
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            expanded ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
          )}
        >
          <ul className="space-y-1 py-1">
            {(children ?? []).map((child) => (
              <MenuItem
                data={child}
                level={level + 1}
                key={`${child.label}-${child.link}`}
              />
            ))}
          </ul>
        </div>
      )}

      {isGroup && hasChildren && !isExpandableGroup && (
        <ul className="mt-2 space-y-1">
          {(children ?? []).map((child) => (
            <MenuItem
              data={child}
              level={level + 1}
              key={`${child.label}-${child.link}`}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export function SideMenu({ menu }: { menu: MenuTree[] }) {
  return (
    <ScrollArea className="w-full px-4 py-4" scrollHideDelay={500}>
      <ul className="space-y-2">
        {menu.map((group, index) => (
          <MenuItem data={group} key={`${group.label}-${index}`} />
        ))}
      </ul>
    </ScrollArea>
  );
}
