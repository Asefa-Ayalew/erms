import {
  IconHome,
  IconUsers,
  IconUserCircle,
  IconBriefcase,
  IconCalendarStats,
  IconChecklist,
  IconFileText,
  IconSettings,
  IconBuilding,
  IconPackage,
  IconShoppingCart,
  IconTruck,
  IconClipboardList,
  IconChartBar,
  IconDatabase,
  IconTool,
  IconTargetArrow,
  IconReportAnalytics,
} from "@tabler/icons-react";

import { MenuTree } from "./side-menu";

export const OfficeMenus = (): MenuTree[] => {
  return [
    // Dashboard
    {
      label: "Dashboard",
      icon: <IconHome stroke={1.4} size={18} />,
      link: "/dashboard",
    },

    {
      label: "Human Resource",
      icon: <IconUsers stroke={1.4} size={18} />,
      isGroup: true,
      children: [
        {
          label: "Employees",
          icon: <IconUserCircle stroke={1.4} size={18} />,
          link: "/hr/employees",
        },
        {
          label: "Departments",
          icon: <IconBuilding stroke={1.4} size={18} />,
          link: "/hr/departments",
        },
        {
          label: "Attendance",
          icon: <IconCalendarStats stroke={1.4} size={18} />,
          link: "/hr/attendance",
        },
        {
          label: "Leave Management",
          icon: <IconChecklist stroke={1.4} size={18} />,
          link: "/hr/leave",
        },
        {
          label: "Payroll",
          icon: <IconBriefcase stroke={1.4} size={18} />,
          link: "/hr/payroll",
        },
        {
          label: "Performance",
          icon: <IconChartBar stroke={1.4} size={18} />,
          link: "/hr/performance",
        },
        {
          label: "HR Reports",
          icon: <IconReportAnalytics stroke={1.4} size={18} />,
          link: "/hr/reports",
        },
      ],
    },

    {
      label: "Inventory",
      icon: <IconPackage stroke={1.4} size={18} />,
      isGroup: true,
      children: [
        {
          label: "Items",
          icon: <IconDatabase stroke={1.4} size={18} />,
          link: "/inventory/items",
        },
        {
          label: "Stock Management",
          icon: <IconClipboardList stroke={1.4} size={18} />,
          link: "/inventory/stock",
        },
        {
          label: "Purchase Orders",
          icon: <IconShoppingCart stroke={1.4} size={18} />,
          link: "/inventory/purchase-orders",
        },
        {
          label: "Suppliers",
          icon: <IconTruck stroke={1.4} size={18} />,
          link: "/inventory/suppliers",
        },
        {
          label: "Warehouses",
          icon: <IconBuilding stroke={1.4} size={18} />,
          link: "/inventory/warehouses",
        },
        {
          label: "Inventory Reports",
          icon: <IconReportAnalytics stroke={1.4} size={18} />,
          link: "/inventory/reports",
        },
      ],
    },

    {
      label: "Project Management",
      icon: <IconTargetArrow stroke={1.4} size={18} />,
      isGroup: true,
      children: [
        {
          label: "Projects",
          icon: <IconBriefcase stroke={1.4} size={18} />,
          link: "/projects",
        },
        {
          label: "Tasks",
          icon: <IconChecklist stroke={1.4} size={18} />,
          link: "/projects/tasks",
        },
        {
          label: "Team Management",
          icon: <IconUsers stroke={1.4} size={18} />,
          link: "/projects/teams",
        },
        {
          label: "Milestones",
          icon: <IconTargetArrow stroke={1.4} size={18} />,
          link: "/projects/milestones",
        },
        {
          label: "Time Tracking",
          icon: <IconCalendarStats stroke={1.4} size={18} />,
          link: "/projects/time-tracking",
        },
        {
          label: "Project Reports",
          icon: <IconReportAnalytics stroke={1.4} size={18} />,
          link: "/projects/reports",
        },
      ],
    },

    {
      label: "Administration",
      icon: <IconSettings stroke={1.4} size={18} />,
      isGroup: true,
      children: [
        {
          label: "User Management",
          icon: <IconUsers stroke={1.4} size={18} />,
          link: "/admin/users",
        },
        {
          label: "Roles & Permissions",
          icon: <IconTool stroke={1.4} size={18} />,
          link: "/admin/roles",
        },
        {
          label: "System Settings",
          icon: <IconSettings stroke={1.4} size={18} />,
          link: "/admin/settings",
        },
      ],
    },
  ];
};

export const PortalMenus = (): MenuTree[] => [
  {
    label: "My Dashboard",
    icon: <IconHome stroke={1.4} size={18} />,
    link: "/portal/dashboard",
  },
  {
    label: "My Tasks",
    icon: <IconChecklist stroke={1.4} size={18} />,
    link: "/portal/tasks",
  },
  {
    label: "My Attendance",
    icon: <IconCalendarStats stroke={1.4} size={18} />,
    link: "/portal/attendance",
  },
];
