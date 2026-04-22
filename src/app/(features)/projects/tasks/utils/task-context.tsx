'use client'

import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { Task, TaskStatus } from '../../models/task';
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useGetTasksQuery,
  useUpdateTaskMutation,
} from '../queries/tasks.api';

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  addTask: (task: Task) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (id: string, newStatus: TaskStatus) => Promise<void>;
  getTasks: (status: TaskStatus) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { data: tasksData, isLoading } = useGetTasksQuery();
  const [createTask] = useCreateTaskMutation();
  const [patchTask] = useUpdateTaskMutation();
  const [removeTask] = useDeleteTaskMutation();
  const tasks = useMemo(() => tasksData ?? [], [tasksData]);

  const addTask = useCallback(async (task: Task) => {
    await createTask(task).unwrap();
  }, [createTask]);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    await patchTask({ id, payload: updates }).unwrap();
  }, [patchTask]);

  const deleteTask = useCallback(async (id: string) => {
    await removeTask(id).unwrap();
  }, [removeTask]);

  const moveTask = useCallback(async (id: string, newStatus: TaskStatus) => {
    await patchTask({ id, payload: { status: newStatus } }).unwrap();
  }, [patchTask]);

  const getTasks = useCallback((status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  return (
    <TaskContext.Provider value={{ tasks, isLoading, addTask, updateTask, deleteTask, moveTask, getTasks }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
