export type TaskStatus = 'not-started' | 'in-progress' | 'under-review' | 'completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  tags: string[];
  startDate: string;
  dueDate: string;
  assignee: string;
  badges: string[];
}
