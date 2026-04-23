'use client'

import React from 'react';
import { Card, Badge, Group, Stack, Text, ActionIcon, Menu } from '@mantine/core';
import { IconDots, IconTrash, IconEdit, IconCalendar, IconGripVertical } from '@tabler/icons-react';
import { useDraggable } from '@dnd-kit/core';
import { Task } from '../../models/task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityColors: Record<string, string> = {
  Low: '#10B981',
  Medium: '#F59E0B',
  High: '#EF4444',
};

const badgeColorMap: Record<string, string> = {
  'reviewed': 'teal',
  'rejected': 'red',
  'change-requested': 'orange',
  'under-review': 'blue',
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const dueDate = new Date(task.dueDate);
  const today = new Date();
  const isOverdue = dueDate < today && task.status !== 'completed';
  const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card 
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200 overflow-hidden group cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-0' : ''}`}
      padding="sm"
    >
      {/* Drag Handle and Priority Bar */}
      <div className="flex items-center gap-2 mb-3">
        <IconGripVertical size={14} className="text-gray-400 shrink-0" />
        <div 
          className="h-1 flex-1 rounded-full"
          style={{ backgroundColor: priorityColors[task.priority] }}
        />
      </div>

      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <Badge 
            size="xs" 
            variant="light"
            color={task.priority === 'Low' ? 'teal' : task.priority === 'Medium' ? 'yellow' : 'red'}
            className="mb-2"
          >
            {task.priority} Priority
          </Badge>
          <Text fw={600} size="sm" className="text-gray-900 line-clamp-2">
            {task.title}
          </Text>
        </div>
        <Menu>
          <Menu.Target>
            <ActionIcon 
              variant="subtle" 
              color="gray" 
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <IconDots size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item 
              leftSection={<IconEdit size={14} />}
              onClick={() => onEdit(task)}
            >
              Edit Task
            </Menu.Item>
            <Menu.Item 
              leftSection={<IconTrash size={14} />}
              color="red"
              onClick={() => onDelete(task.id)}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>

      {task.description && (
        <Text size="xs" className="text-gray-600 mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </Text>
      )}

      {/* Status Badges */}
      {task.badges.length > 0 && (
        <div className="flex gap-1 flex-wrap mb-3">
          {task.badges.map((badge, idx) => (
            <Badge 
              key={idx}
              size="xs" 
              variant="light"
              color={badgeColorMap[badge] || 'gray'}
            >
              {badge}
            </Badge>
          ))}
        </div>
      )}

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex gap-1 flex-wrap mb-3">
          {task.tags.slice(0, 3).map((tag, idx) => (
            <Badge key={idx} size="xs" variant="outline" color="gray">
              #{tag}
            </Badge>
          ))}
          {task.tags.length > 3 && (
            <Badge size="xs" variant="outline" color="gray">
              +{task.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Dates and Assignee */}
      <Stack gap={8} className="mb-3 pb-3 border-t border-gray-100">
        <Group gap={4} className="text-xs text-gray-500">
          <IconCalendar size={14} />
          <Text size="xs">{formatDate(task.startDate)} → {formatDate(task.dueDate)}</Text>
        </Group>
        
        {task.assignee && (
          <Text size="xs" className="text-gray-600">
            👤 <span className="font-medium">{task.assignee}</span>
          </Text>
        )}
      </Stack>

      {/* Due Date Indicator */}
      {isOverdue && (
        <div className="px-2 py-1 bg-red-50 rounded text-center border border-red-200">
          <Text size="xs" fw={600} c="red">Overdue by {Math.abs(daysLeft)} days</Text>
        </div>
      )}
      {!isOverdue && daysLeft <= 3 && daysLeft > 0 && (
        <div className="px-2 py-1 bg-yellow-50 rounded text-center border border-yellow-200">
          <Text size="xs" fw={600} c="orange">{daysLeft} day{daysLeft !== 1 ? 's' : ''} left</Text>
        </div>
      )}
    </Card>
  );
}
