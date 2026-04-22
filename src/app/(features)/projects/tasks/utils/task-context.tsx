'use client'

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Task, TaskStatus } from '../../models/task';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStatus: TaskStatus) => void;
  getTasks: (status: TaskStatus) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'FASDF',
      description: 'FSDFS',
      status: 'not-started',
      priority: 'Medium',
      tags: ['FDSA'],
      startDate: '2025-11-27',
      dueDate: '2025-11-24',
      assignee: 'Perago Information Systems Test',
      badges: ['reviewed', 'rejected'],
    },
    {
      id: '2',
      title: 'New task for testing',
      description: 'New TASK',
      status: 'in-progress',
      priority: 'Medium',
      tags: ['AFDSFS', 'FADSFSAF'],
      startDate: '2025-11-27',
      dueDate: '2025-11-18',
      assignee: 'Perago Information Systems Test',
      badges: ['reviewed', 'change-requested'],
    },
    {
      id: '3',
      title: 'task 6 edited',
      description: 'Purchasing is the act of acquiring goods or services, often involving a financial exchange, but in business, it\'s a key part of the broader procurement process...',
      status: 'under-review',
      priority: 'Medium',
      tags: ['fsdsdf', 'fasdf', 'fasfa', 'fasdfs'],
      startDate: '2025-12-10',
      dueDate: '2025-12-09',
      assignee: 'Perago Information Systems Test',
      badges: ['reviewed'],
    },
    {
      id: '4',
      title: 'New action item saved',
      description: 'DescriptionFASDFSADFSADF fasdf fsdsfsad...',
      status: 'completed',
      priority: 'Low',
      tags: ['new tag', 'FSDFDSF', 'FADSFSFS', 'fasfs', 'fasdf'],
      startDate: '2026-02-11',
      dueDate: '2026-02-13',
      assignee: 'Perago Information Systems Test',
      badges: ['under-review', 'rejected'],
    },
    {
      id: '5',
      title: 'Design new dashboard',
      description: 'Create mockups and wireframes for the new dashboard',
      status: 'in-progress',
      priority: 'High',
      tags: ['design', 'UI/UX'],
      startDate: '2026-01-15',
      dueDate: '2026-02-01',
      assignee: 'Design Team',
      badges: ['in-progress'],
    },
    {
      id: '6',
      title: 'API Integration',
      description: 'Integrate third-party API for payment processing',
      status: 'not-started',
      priority: 'High',
      tags: ['backend', 'API'],
      startDate: '2026-02-01',
      dueDate: '2026-02-15',
      assignee: 'Backend Team',
      badges: ['pending'],
    },
    {
      id: '7',
      title: 'Bug fixes',
      description: 'Fix critical bugs reported in the last release',
      status: 'in-progress',
      priority: 'High',
      tags: ['bugs', 'fix'],
      startDate: '2026-01-20',
      dueDate: '2026-02-05',
      assignee: 'QA Team',
      badges: ['critical'],
    },
    {
      id: '8',
      title: 'New task for test',
      description: 'Testing new feature implementation',
      status: 'completed',
      priority: 'Low',
      tags: ['testing'],
      startDate: '2026-01-10',
      dueDate: '2026-01-30',
      assignee: 'QA Team',
      badges: ['completed'],
    },
  ]);

  const addTask = useCallback((task: Task) => {
    setTasks(prev => [...prev, task]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => (task.id === id ? { ...task, ...updates } : task)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const moveTask = useCallback((id: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(task => (task.id === id ? { ...task, status: newStatus } : task)));
  }, []);

  const getTasks = useCallback((status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, moveTask, getTasks }}>
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
