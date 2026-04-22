"use client";

import { useState } from "react";
import { Badge, Container, Text } from "@mantine/core";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Task, TaskStatus } from "../../models/task";
import { TaskColumn } from "./task-column";
import { useTaskContext } from "../utils/task-context";
import { TaskModal } from "./task-modal";

export function TaskBoard() {
  const {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    getTasks,
    moveTask,
  } = useTaskContext();
  const [modalOpened, setModalOpened] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>("not-started");
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [sourceStatus, setSourceStatus] = useState<TaskStatus | null>(null);
  const [targetStatus, setTargetStatus] = useState<TaskStatus | null>(null);
  const [activeCardWidth, setActiveCardWidth] = useState<number>(384);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor),
  );

  const columns: Array<{
    status: TaskStatus;
    title: string;
  }> = [
    { status: "not-started", title: "Not Started" },
    { status: "in-progress", title: "In Progress" },
    { status: "under-review", title: "Under Review" },
    { status: "completed", title: "Completed" },
  ];

  const handleAddTask = (status: TaskStatus) => {
    setNewTaskStatus(status);
    setEditingTask(undefined);
    setModalOpened(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setModalOpened(true);
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(id);
    }
  };

  const handleSubmitTask = async (task: Task) => {
    if (editingTask) {
      await updateTask(editingTask.id, task);
    } else {
      await addTask(task);
    }
  };

  const resolveStatusFromDropTarget = (overId: string): TaskStatus | null => {
    const overTask = tasks.find((task) => task.id === overId);
    const status = (overTask?.status ?? overId) as TaskStatus;
    const validStatuses: TaskStatus[] = [
      "not-started",
      "in-progress",
      "under-review",
      "completed",
    ];
    return validStatuses.includes(status) ? status : null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = event.active.id as string;
    const task = tasks.find((item) => item.id === taskId);
    const measuredWidth = event.active.rect.current.initial?.width;
    if (measuredWidth) {
      setActiveCardWidth(measuredWidth);
    }
    setActiveTaskId(taskId);
    setSourceStatus(task?.status ?? null);
    setTargetStatus(task?.status ?? null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (!event.over) {
      return;
    }
    const resolved = resolveStatusFromDropTarget(event.over.id as string);
    if (resolved) {
      setTargetStatus(resolved);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over) {
      const taskId = active.id as string;
      const newStatus = resolveStatusFromDropTarget(over.id as string);
      if (newStatus) {
        await moveTask(taskId, newStatus);
      }
    }

    setActiveTaskId(null);
    setSourceStatus(null);
    setTargetStatus(null);
  };

  const activeTask = activeTaskId
    ? tasks.find((task) => task.id === activeTaskId)
    : null;
  const isCrossColumnMove = Boolean(
    sourceStatus && targetStatus && sourceStatus !== targetStatus,
  );

  const DndBoardContent = () => (
    <>
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <Text fw={800} size="xl" className="text-gray-900 mb-1">
              Task Manager
            </Text>
            <Text size="sm" c="dimmed">
              {isLoading
                ? "Loading tasks..."
                : `${completedTasks} of ${totalTasks} tasks completed`}
            </Text>
          </div>
          <div className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-200">
            <Text size="xs" c="dimmed">
              Progress:{" "}
              <span className="font-bold text-blue-600">
                {totalTasks > 0
                  ? Math.round((completedTasks / totalTasks) * 100)
                  : 0}
                %
              </span>
            </Text>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-8 -mx-4 px-4">
        <div className="flex gap-6 min-w-max">
          {columns.map((column) => {
            const columnTasks = getTasks(column.status);
            return (
              <TaskColumn
                key={column.status}
                status={column.status}
                title={column.title}
                count={columnTasks.length}
                tasks={columnTasks}
                isSourceColumn={sourceStatus === column.status}
                isTargetColumn={targetStatus === column.status}
                isCrossColumnMove={isCrossColumnMove}
                isDragging={Boolean(activeTask)}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            );
          })}
        </div>
      </div>
    </>
  );

  const totalTasks = tasks.length;
  const completedTasks = getTasks("completed").length;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      <Container size="xl" className="px-4 py-10">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div onDragOver={(e) => e.preventDefault()}>
            <DndBoardContent />
          </div>
          <DragOverlay>
            {activeTask ? (
              <div
                style={{ width: activeCardWidth }}
                className="rounded-lg border border-blue-200 bg-white p-3 shadow-2xl opacity-95"
              >
                <Badge
                  size="xs"
                  variant="light"
                  color={
                    activeTask.priority === "Low"
                      ? "teal"
                      : activeTask.priority === "Medium"
                        ? "yellow"
                        : "red"
                  }
                  className="mb-2"
                >
                  {activeTask.priority}
                </Badge>
                <Text fw={700} size="sm">
                  {activeTask.title}
                </Text>
                {activeTask.description && (
                  <Text size="xs" c="dimmed" className="mt-1 line-clamp-2">
                    {activeTask.description}
                  </Text>
                )}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Container>

      <TaskModal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setEditingTask(undefined);
        }}
        onSubmit={handleSubmitTask}
        initialTask={editingTask}
        defaultStatus={newTaskStatus}
      />
    </div>
  );
}
