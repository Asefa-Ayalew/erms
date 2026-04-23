export type ProjectStatus = "planning" | "active" | "in_progress" | "on_hold" | "completed" | "cancelled";

export type Project = {
  id: string;
  name: string;
  description: string;
  location: string;
  budget: number;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  managerId: string;
};

export const PROJECT_STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "planning", label: "Planning" },
  { value: "active", label: "Active" },
  { value: "in_progress", label: "In progress" },
  { value: "on_hold", label: "On hold" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function projectStatusLabel(status: ProjectStatus): string {
  return PROJECT_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}
