import type { Project, Task, TaskPriority, TaskStatus, Comment, User, ChecklistItem } from '../types';

const STATUSES: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'in_review', 'done'];
const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function nonEmpty(value: unknown, max = 200): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= max;
}
function isUser(value: unknown): value is User {
  if (!isRecord(value)) return false;
  return nonEmpty(value.id, 100) && nonEmpty(value.name, 80) &&
    nonEmpty(value.email, 200) && typeof value.avatar === 'string' &&
    typeof value.color === 'string' && nonEmpty(value.role, 80) &&
    ['online', 'idle', 'offline'].includes(String(value.status));
}
function isChecklistItem(value: unknown): value is ChecklistItem {
  return isRecord(value) && nonEmpty(value.id, 100) && nonEmpty(value.text, 300) &&
    typeof value.completed === 'boolean';
}
function isIsoDate(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

export function isValidTask(value: unknown): value is Task {
  if (!isRecord(value)) return false;
  return nonEmpty(value.id, 100) && nonEmpty(value.projectId, 100) &&
    nonEmpty(value.title, 120) && typeof value.description === 'string' && value.description.length <= 2000 &&
    STATUSES.includes(value.status as TaskStatus) && PRIORITIES.includes(value.priority as TaskPriority) &&
    Array.isArray(value.assignees) && value.assignees.length <= 50 && value.assignees.every(isUser) &&
    Array.isArray(value.tags) && value.tags.length <= 30 && value.tags.every((tag) => nonEmpty(tag, 40)) &&
    isIsoDate(value.dueDate) && Array.isArray(value.checklist) && value.checklist.length <= 100 &&
    value.checklist.every(isChecklistItem) && isIsoDate(value.createdAt) && isIsoDate(value.updatedAt) &&
    Number.isInteger(value.position) && (value.position as number) >= 0 &&
    (value.activeEditingUser === undefined || value.activeEditingUser === null || isRecord(value.activeEditingUser));
}

export function isValidProject(value: unknown): value is Project {
  if (!isRecord(value)) return false;
  return nonEmpty(value.id, 100) && nonEmpty(value.name, 100) &&
    typeof value.description === 'string' && value.description.length <= 1000 &&
    nonEmpty(value.icon, 80) && typeof value.color === 'string' &&
    Array.isArray(value.members) && value.members.length <= 100 && value.members.every(isUser) &&
    isIsoDate(value.createdAt);
}

export function isValidComment(value: unknown): value is Comment {
  if (!isRecord(value)) return false;
  return nonEmpty(value.id, 100) && nonEmpty(value.taskId, 100) &&
    nonEmpty(value.content, 2000) && nonEmpty(value.userId, 100) &&
    nonEmpty(value.userName, 80) && typeof value.userAvatar === 'string' &&
    isIsoDate(value.createdAt);
}

export function isValidTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === 'string' && STATUSES.includes(value as TaskStatus);
}
