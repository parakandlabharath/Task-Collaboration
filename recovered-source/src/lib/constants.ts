import { User, TaskStatus, TaskPriority } from '../types';

export const PRESET_USERS: User[] = [
  {
    id: 'user_alex',
    name: 'Alex Morgan',
    email: 'alex@company.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    color: '#3b82f6',
    role: 'Product Lead',
    status: 'online',
  },
  {
    id: 'user_sarah',
    name: 'Sarah Chen',
    email: 'sarah@company.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    color: '#ec4899',
    role: 'Senior Designer',
    status: 'online',
  },
  {
    id: 'user_jordan',
    name: 'Jordan Miller',
    email: 'jordan@company.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    color: '#10b981',
    role: 'Fullstack Dev',
    status: 'online',
  },
  {
    id: 'user_elena',
    name: 'Elena Rostova',
    email: 'elena@company.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    color: '#8b5cf6',
    role: 'QA Specialist',
    status: 'idle',
  },
];

export const COLUMNS: { id: TaskStatus; label: string; color: string; bgLight: string; dotColor: string }[] = [
  { id: 'backlog', label: 'Backlog', color: 'text-slate-600 dark:text-slate-400', bgLight: 'bg-slate-500/10', dotColor: 'bg-slate-400' },
  { id: 'todo', label: 'To Do', color: 'text-blue-600 dark:text-blue-400', bgLight: 'bg-blue-500/10', dotColor: 'bg-blue-500' },
  { id: 'in_progress', label: 'In Progress', color: 'text-amber-600 dark:text-amber-400', bgLight: 'bg-amber-500/10', dotColor: 'bg-amber-500' },
  { id: 'in_review', label: 'In Review', color: 'text-purple-600 dark:text-purple-400', bgLight: 'bg-purple-500/10', dotColor: 'bg-purple-500' },
  { id: 'done', label: 'Done', color: 'text-emerald-600 dark:text-emerald-400', bgLight: 'bg-emerald-500/10', dotColor: 'bg-emerald-500' },
];

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; badgeBg: string; border: string }> = {
  low: {
    label: 'Low',
    color: 'text-slate-600 dark:text-slate-300',
    badgeBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    border: 'border-slate-300 dark:border-slate-700',
  },
  medium: {
    label: 'Medium',
    color: 'text-blue-600 dark:text-blue-400',
    badgeBg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
    border: 'border-blue-300 dark:border-blue-800',
  },
  high: {
    label: 'High',
    color: 'text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
    border: 'border-amber-300 dark:border-amber-800',
  },
  urgent: {
    label: 'Urgent',
    color: 'text-rose-600 dark:text-rose-400',
    badgeBg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
    border: 'border-rose-300 dark:border-rose-800',
  },
};
