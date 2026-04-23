"use client";

import { AuthGuard } from "@/lib/auth";
import { TaskBoard } from "./components/task-board";
import { TaskProvider } from "./utils/task-context";

const TaskManagement = () => {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <TaskProvider>
        <TaskBoard />
      </TaskProvider>
    </AuthGuard>
  );
};

export default TaskManagement;
