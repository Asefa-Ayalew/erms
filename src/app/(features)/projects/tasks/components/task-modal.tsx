'use client'

import React, { useState, useEffect } from 'react';
import {
  Modal,
  TextInput,
  Textarea,
  Select,
  TagsInput,
  Button,
  Stack,
  Group,
  Text,
  Divider,
} from '@mantine/core';
import { Task, TaskStatus, TaskPriority } from '../../models/task';

interface TaskModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => void;
  initialTask?: Task;
  defaultStatus?: TaskStatus;
}

export function TaskModal({
  opened,
  onClose,
  onSubmit,
  initialTask,
  defaultStatus = 'not-started',
}: TaskModalProps) {
  const [formData, setFormData] = useState<Partial<Task>>({
    id: '',
    title: '',
    description: '',
    status: defaultStatus,
    priority: 'Medium',
    tags: [],
    startDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    assignee: '',
    badges: [],
  });

  useEffect(() => {
    if (initialTask) {
      setFormData(initialTask);
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData({
        id: '',
        title: '',
        description: '',
        status: defaultStatus,
        priority: 'Medium',
        tags: [],
        startDate: new Date().toISOString().split('T')[0],
        dueDate: tomorrow.toISOString().split('T')[0],
        assignee: '',
        badges: [],
      });
    }
  }, [initialTask, defaultStatus, opened]);

  const handleSubmit = () => {
    if (!formData.title?.trim()) {
      alert('Please enter a task title');
      return;
    }

    const newTask: Task = {
      id: formData.id || Date.now().toString(),
      title: formData.title.trim(),
      description: formData.description || '',
      status: formData.status as TaskStatus,
      priority: formData.priority as TaskPriority,
      tags: formData.tags || [],
      startDate: formData.startDate || '',
      dueDate: formData.dueDate || '',
      assignee: formData.assignee || '',
      badges: formData.badges || [],
    };

    onSubmit(newTask);
    onClose();
  };

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title={
        <Text fw={700} size="lg">
          {initialTask ? '✏️ Edit Task' : '✨ Create New Task'}
        </Text>
      } 
      size="lg"
      centered
    >
      <Stack gap="md">
        <TextInput
          label="Task Title"
          placeholder="What needs to be done?"
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.currentTarget.value })}
          required
          className="font-medium"
        />

        <Textarea
          label="Description"
          placeholder="Add more details about this task..."
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.currentTarget.value })}
          minRows={3}
          maxRows={5}
        />

        <Divider />

        <Group grow>
          <Select
            label="Status"
            placeholder="Select status"
            data={[
              { value: 'not-started', label: '📋 Not Started' },
              { value: 'in-progress', label: '🚀 In Progress' },
              { value: 'under-review', label: '👁️ Under Review' },
              { value: 'completed', label: '✅ Completed' },
            ]}
            value={formData.status || 'not-started'}
            onChange={(value) => setFormData({ ...formData, status: value as TaskStatus })}
          />

          <Select
            label="Priority"
            placeholder="Select priority"
            data={[
              { value: 'Low', label: '🟢 Low' },
              { value: 'Medium', label: '🟡 Medium' },
              { value: 'High', label: '🔴 High' },
            ]}
            value={formData.priority || 'Medium'}
            onChange={(value) => setFormData({ ...formData, priority: value as TaskPriority })}
          />
        </Group>

        <Group grow>
          <TextInput
            label="Start Date"
            type="date"
            value={formData.startDate || ''}
            onChange={(e) => setFormData({ ...formData, startDate: e.currentTarget.value })}
          />

          <TextInput
            label="Due Date"
            type="date"
            value={formData.dueDate || ''}
            onChange={(e) => setFormData({ ...formData, dueDate: e.currentTarget.value })}
          />
        </Group>

        <TextInput
          label="Assignee"
          placeholder="Who is responsible? (e.g., John Doe)"
          value={formData.assignee || ''}
          onChange={(e) => setFormData({ ...formData, assignee: e.currentTarget.value })}
        />

        <TagsInput
          label="Tags"
          placeholder="Press Enter to add tags"
          value={formData.tags || []}
          onChange={(value) => setFormData({ ...formData, tags: value })}
          clearable
        />

        <Divider />

        <Group justify="flex-end">
          <Button variant="light" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            color={initialTask ? 'blue' : 'green'}
          >
            {initialTask ? 'Update Task' : 'Create Task'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
