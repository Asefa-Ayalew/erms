"use client";

import { AuthGuard } from "@/lib/auth";
import { ProjectsContent } from "./components/projects-content";

export default function ProjectsPage() {
  return (
    <AuthGuard allowedRoles={["admin", "project_manager", "user"]}>
      <ProjectsContent />
    </AuthGuard>
  );
}
