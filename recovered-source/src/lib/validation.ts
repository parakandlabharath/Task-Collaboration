import type { Project, Task, TaskPriority, TaskStatus, Comment } from '../types';

const STATUSES: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'in_review', 'done'];
const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isValidTask(value: unknown): value is Task {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string' && value.id.length > 0 &&
    typeof value.projectId === 'string' && value.projectId.length > 0 &&
    typeof value.title === 'string' && value.title.trim().length > 0 && value.title.length <= 120 &&
    typeof value.description === 'string' && value.description.length <= 2000 &&
    STATUSES.includes(value.status as TaskStatus) &&
    PRIORITIES.includes(value.priority as TaskPriority) &&
    Array.isArray(value.assignees) && Array.isArray(value.tags) &&
    value.tags.every((tag) => typeof tag === 'string' && tag.length <= 40) &&
    Array.isArray(value.checklist) && Number.isInteger(value.position) && (value.position as number) >= 0;
}

export function isValidProject(value: unknown): value is Project {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string' && value.id.length > 0 &&
    typeof value.name === 'string' && value.name.trim().length > 0 && value.name.length <= 100 &&
    typeof value.description === 'string' && value.description.length <= 1000 &&
    Array.isArray(value.members);
}

export function isValidComment(value: unknown): value is Comment {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string' && value.id.length > 0 &&
    typeof value.taskId === 'string' && value.taskId.length > 0 &&
    typeof value.content === 'string' && value.content.trim().length > 0 && value.content.length <= 2000 &&
    typeof value.userId === 'string' && typeof value.userName === 'string';
}

export function isValidTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === 'string' && STATUSES.includes(value as TaskStatus);
}
