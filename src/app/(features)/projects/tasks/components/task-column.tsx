'use client'

import React from 'react';
import { Card, Badge, Button, Text, Stack } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './task-card';
import { Task, TaskStatus } from '../../models/task';

interface TaskColumnProps {
  status: TaskStatus;
  title: string;
  count: number;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

const statusConfig: Record<TaskStatus, { color: string; bgColor: string; lightBg: string }> = {
  'not-started': { color: '#6B7280', bgColor: '#F3F4F6', lightBg: '#F9FAFB' },
  'in-progress': { color: '#3B82F6', bgColor: '#DBEAFE', lightBg: '#EFF6FF' },
  'under-review': { color: '#F97316', bgColor: '#FED7AA', lightBg: '#FFF7ED' },
  'completed': { color: '#10B981', bgColor: '#BBEAD5', lightBg: '#F0FDF4' },
};

export function TaskColumn({
  status,
  title,
  count,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: TaskColumnProps) {
  const config = statusConfig[status];
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div 
      ref={setNodeRef}
      className={`flex-shrink-0 w-96 transition-all duration-200 ${isOver ? 'opacity-75 ring-2 ring-blue-400 rounded-lg' : ''}`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <Text fw={700} size="md" className="text-gray-900 mb-2">
              {title}
            </Text>
            <div
              className="h-1.5 rounded-full"
              style={{ background: config.color, width: '50px' }}
            />
          </div>
          <Badge
            size="lg"
            color={status === 'not-started' ? 'gray' : status === 'in-progress' ? 'blue' : status === 'under-review' ? 'orange' : 'teal'}
            variant="light"
            className="px-3 py-1 text-xs font-semibold"
          >
            {count}
          </Badge>
        </div>

        {/* Cards Container */}
        <div className="flex-1 min-h-0 overflow-y-auto" data-droppable={status}>
          <Stack gap="sm" className="pb-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}

            {tasks.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-block p-3 rounded-lg mb-2" style={{ backgroundColor: config.lightBg }}>
                  <Text size="2xl">📭</Text>
                </div>
                <Text size="sm" c="dimmed" fw={500}>
                  No tasks yet
                </Text>
              </div>
            )}
          </Stack>
        </div>

        {/* Add Button */}
        <Button
          variant="subtle"
          leftSection={<IconPlus size={16} />}
          className="w-full mt-2 text-gray-600 hover:text-gray-900 transition-colors"
          onClick={() => onAddTask(status)}
        >
          Add Task
        </Button>
      </div>
    </div>
  );
}
