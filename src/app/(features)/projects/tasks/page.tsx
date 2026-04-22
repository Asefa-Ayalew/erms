"use client";

import React from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
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
