'use client'

import React, { useState } from 'react';
import { Container, Text } from '@mantine/core';
import { DragEndEvent } from '@dnd-kit/core';
import { Task, TaskStatus } from '../../models/task';
import { TaskColumn } from './task-column';
import { useTaskContext } from '../utils/task-context';
import { TaskModal } from './task-modal';

export function TaskBoard() {
  const { tasks, addTask, updateTask, deleteTask, getTasks, moveTask } = useTaskContext();
  const [modalOpened, setModalOpened] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('not-started');

  const columns: Array<{
    status: TaskStatus;
    title: string;
  }> = [
    { status: 'not-started', title: 'Not Started' },
    { status: 'in-progress', title: 'In Progress' },
    { status: 'under-review', title: 'Under Review' },
    { status: 'completed', title: 'Completed' },
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

  const handleDeleteTask = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
    }
  };

  const handleSubmitTask = (task: Task) => {
    if (editingTask) {
      updateTask(editingTask.id, task);
    } else {
      addTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;
    
    const validStatuses: TaskStatus[] = ['not-started', 'in-progress', 'under-review', 'completed'];
    if (validStatuses.includes(newStatus)) {
      moveTask(taskId, newStatus);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = getTasks('completed').length;

  const DndBoardContent = () => (
    <>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <Text fw={800} size="xl" className="text-gray-900 mb-1">
              Task Manager
            </Text>
            <Text size="sm" c="dimmed">
              {completedTasks} of {totalTasks} tasks completed
            </Text>
          </div>
          <div className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-200">
            <Text size="xs" c="dimmed">
              Progress: <span className="font-bold text-blue-600">{totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%</span>
            </Text>
          </div>
        </div>
      </div>

      {/* Board */}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Container size="xl" className="px-4 py-10">
        <div onDragOver={(e) => e.preventDefault()}>
          <DndBoardContent />
        </div>
      </Container>

      {/* Modal */}
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
