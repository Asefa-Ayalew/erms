"use client";

import React from "react";
import { Card, Text, Title } from "@mantine/core";
import { userInfo } from "@/lib/auth/hooks/user-info";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { TaskBoard } from "./components/task-board";
import { TaskProvider } from "./utils/task-context";
import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

const TaskManagement = () => {
 const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  }),
  useSensor(KeyboardSensor)
);
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <TaskProvider>
        <DndContext sensors={sensors} collisionDetection={closestCorners}>
          <TaskBoard />
        </DndContext>
      </TaskProvider>
    </AuthGuard>
  );
};

export default TaskManagement;
