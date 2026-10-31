export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  color: string;
  role: string;
  status: 'online' | 'idle' | 'offline';
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  projectId: string;
  taskId?: string;
  taskTitle?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignees: User[];
  tags: string[];
  dueDate: string;
  checklist: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
  position: number;
  activeEditingUser?: {
    id: string;
    name: string;
    avatar: string;
    color: string;
  } | null;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  members: User[];
  createdAt: string;
}

export interface PresenceUser {
  id: string;
  name: string;
  avatar: string;
  color: string;
  activeTaskId?: string | null;
  activeView?: string;
  lastActive: string;
}

// WebSocket Event Payloads
export type WSEventType =
  | 'INIT_STATE'
  | 'JOIN_PROJECT'
  | 'PRESENCE_UPDATE'
  | 'TASK_CREATED'
  | 'TASK_UPDATED'
  | 'TASK_MOVED'
  | 'TASK_DELETED'
  | 'COMMENT_ADDED'
  | 'COMMENT_DELETED'
  | 'ACTIVITY_LOGGED'
  | 'PROJECT_CREATED'
  | 'USER_TYPING'
  | 'TASK_LOCK';

export interface WSEvent {
  type: WSEventType;
  projectId?: string;
  payload: any;
  senderId?: string;
  timestamp?: string;
}

export interface WorkspaceState {
  projects: Project[];
  tasks: Task[];
  comments: Comment[];
  activities: ActivityLog[];
  presence: PresenceUser[];
}
