import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI } from '@google/genai';
import {
  Task,
  Project,
  Comment,
  ActivityLog,
  PresenceUser,
  WSEvent,
  User,
} from './src/types.js';

// Pre-defined initial users for quick simulation
const PRESET_USERS: User[] = [
  {
    id: 'user_alex',
    name: 'Alex Morgan',
    email: 'alex@company.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    color: '#3b82f6', // blue
    role: 'Product Lead',
    status: 'online',
  },
  {
    id: 'user_sarah',
    name: 'Sarah Chen',
    email: 'sarah@company.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    color: '#ec4899', // pink
    role: 'Senior Designer',
    status: 'online',
  },
  {
    id: 'user_jordan',
    name: 'Jordan Miller',
    email: 'jordan@company.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    color: '#10b981', // emerald
    role: 'Fullstack Dev',
    status: 'online',
  },
  {
    id: 'user_elena',
    name: 'Elena Rostova',
    email: 'elena@company.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    color: '#8b5cf6', // purple
    role: 'QA Specialist',
    status: 'idle',
  },
];

// Initial Projects Seed
const initialProjects: Project[] = [
  {
    id: 'proj_launch',
    name: '🚀 Product v2.0 Launch',
    description: 'Quarterly release planning, feature delivery, and real-time release synchronization.',
    icon: 'Rocket',
    color: '#3b82f6',
    members: PRESET_USERS,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'proj_design',
    name: '🎨 Design System Redesign',
    description: 'Modernizing core component libraries, token palettes, and accessibility guidelines.',
    icon: 'Palette',
    color: '#ec4899',
    members: [PRESET_USERS[1], PRESET_USERS[0]],
    createdAt: new Date().toISOString(),
  },
];

// Initial Tasks Seed
const initialTasks: Task[] = [
  {
    id: 'task_1',
    projectId: 'proj_launch',
    title: 'Implement Real-time WebSocket Gateway',
    description: 'Set up Express + WS server with room isolation, presence state tracking, and optimistic client synchronization.',
    status: 'done',
    priority: 'urgent',
    assignees: [PRESET_USERS[2], PRESET_USERS[0]],
    tags: ['Backend', 'WebSockets', 'Architecture'],
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    checklist: [
      { id: 'c1', text: 'Configure WS server on port 3000', completed: true },
      { id: 'c2', text: 'Add presence broadcast handler', completed: true },
      { id: 'c3', text: 'Test reconnect & auto sync', completed: true },
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
    position: 0,
  },
  {
    id: 'task_2',
    projectId: 'proj_launch',
    title: 'Design Live Collaborative Kanban Board',
    description: 'Create multi-column Kanban UI with active drag & drop cards, editing locks, and user avatar badges on active cards.',
    status: 'in_progress',
    priority: 'high',
    assignees: [PRESET_USERS[1]],
    tags: ['UI/UX', 'Frontend', 'Motion'],
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    checklist: [
      { id: 'c2_1', text: 'Build column drag targets', completed: true },
      { id: 'c2_2', text: 'Add live card edit locks', completed: false },
      { id: 'c2_3', text: 'Add dark/light responsive styling', completed: true },
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
    position: 0,
    activeEditingUser: {
      id: PRESET_USERS[1].id,
      name: PRESET_USERS[1].name,
      avatar: PRESET_USERS[1].avatar,
      color: PRESET_USERS[1].color,
    },
  },
  {
    id: 'task_3',
    projectId: 'proj_launch',
    title: 'AI Smart Subtask Generator',
    description: 'Leverage Gemini model to automatically break down complex task descriptions into actionable checklists.',
    status: 'in_review',
    priority: 'medium',
    assignees: [PRESET_USERS[0]],
    tags: ['AI', 'Gemini API', 'Feature'],
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    checklist: [
      { id: 'c3_1', text: 'Integrate Google Gen AI SDK server side', completed: true },
      { id: 'c3_2', text: 'Build client modal trigger button', completed: true },
      { id: 'c3_3', text: 'Add streaming response UX', completed: false },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    position: 0,
  },
  {
    id: 'task_4',
    projectId: 'proj_launch',
    title: 'Security Audit & Rate Limiting',
    description: 'Perform penetration testing and configure CORS, helmet, and connection rate limits.',
    status: 'todo',
    priority: 'high',
    assignees: [PRESET_USERS[3]],
    tags: ['Security', 'DevOps'],
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    checklist: [
      { id: 'c4_1', text: 'Review WebSocket frame size limits', completed: false },
      { id: 'c4_2', text: 'Sanitize user markdown comments', completed: false },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    position: 0,
  },
  {
    id: 'task_5',
    projectId: 'proj_launch',
    title: 'User Onboarding & Demo Walkthrough',
    description: 'Prepare interactive guide highlighting multi-tab testing, user identity switching, and live sync features.',
    status: 'backlog',
    priority: 'low',
    assignees: [PRESET_USERS[0], PRESET_USERS[1]],
    tags: ['Docs', 'Onboarding'],
    dueDate: new Date(Date.now() + 86400000 * 10).toISOString(),
    checklist: [
      { id: 'c5_1', text: 'Write user documentation', completed: false },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    position: 0,
  },
];

const initialComments: Comment[] = [
  {
    id: 'comm_1',
    taskId: 'task_2',
    userId: PRESET_USERS[1].id,
    userName: PRESET_USERS[1].name,
    userAvatar: PRESET_USERS[1].avatar,
    content: 'Added live avatar badges to active cards so everyone sees who is editing what! 🎨',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'comm_2',
    taskId: 'task_2',
    userId: PRESET_USERS[0].id,
    userName: PRESET_USERS[0].name,
    userAvatar: PRESET_USERS[0].avatar,
    content: 'Awesome work Sarah! The motion transitions look super smooth.',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

const initialActivities: ActivityLog[] = [
  {
    id: 'act_1',
    projectId: 'proj_launch',
    taskId: 'task_1',
    taskTitle: 'Implement Real-time WebSocket Gateway',
    userId: PRESET_USERS[2].id,
    userName: PRESET_USERS[2].name,
    userAvatar: PRESET_USERS[2].avatar,
    action: 'status_change',
    details: 'moved task from In Progress to Done',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'act_2',
    projectId: 'proj_launch',
    taskId: 'task_2',
    taskTitle: 'Design Live Collaborative Kanban Board',
    userId: PRESET_USERS[1].id,
    userName: PRESET_USERS[1].name,
    userAvatar: PRESET_USERS[1].avatar,
    action: 'comment_add',
    details: 'added a new comment',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
  },
];

// Server state store
let state = {
  projects: [...initialProjects],
  tasks: [...initialTasks],
  comments: [...initialComments],
  activities: [...initialActivities],
};

// WebSocket client session mapping
interface ExtendedWebSocket extends WebSocket {
  isAlive?: boolean;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  userColor?: string;
  projectId?: string;
  activeTaskId?: string | null;
}

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Lazy Gemini AI assistant helper route
let aiInstance: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== 'MY_GEMINI_API_KEY') {
      aiInstance = new GoogleGenAI({ apiKey: key });
    }
  }
  return aiInstance;
}

app.post('/api/ai/breakdown', async (req, res) => {
  try {
    const { title, description } = req.body;
    const ai = getAI();

    if (!ai) {
      // Fallback response if Gemini key isn't provided
      return res.json({
        subtasks: [
          'Initial research and requirements breakdown',
          'Create draft architecture & design mockups',
          'Implement core functional module',
          'Perform testing and edge case review',
          'Document usage and deployment guidelines',
        ],
        summary: `Action plan generated for "${title}".`,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert Agile product manager.
Task Title: "${title}"
Description: "${description}"

Generate 4 to 6 concise, actionable checklist items (subtasks) for this task. Return JSON in this format:
{
  "subtasks": ["subtask 1", "subtask 2", "subtask 3"],
  "summary": "Brief 1-sentence execution approach"
}`,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('AI Breakdown error:', err);
    res.status(500).json({
      subtasks: [
        'Analyze requirement scope',
        'Draft solution strategy',
        'Execute implementation code',
        'Conduct quality assurance',
      ],
      summary: 'Standard task breakdown generated.',
    });
  }
});

app.post('/api/ai/project-summary', async (req, res) => {
  try {
    const { projectId } = req.body;
    const projectTasks = state.tasks.filter((t) => t.projectId === projectId);
    const done = projectTasks.filter((t) => t.status === 'done').length;
    const inProgress = projectTasks.filter((t) => t.status === 'in_progress').length;
    const todo = projectTasks.filter((t) => t.status === 'todo').length;
    const urgent = projectTasks.filter((t) => t.priority === 'urgent' && t.status !== 'done').length;

    const ai = getAI();
    if (!ai) {
      return res.json({
        summary: `Project currently has ${projectTasks.length} tasks (${done} completed, ${inProgress} in progress, ${urgent} urgent pending). Focus on delivering active in-progress items.`,
        recommendations: [
          'Prioritize resolving urgent open tasks',
          'Ensure team members have clear assignees on in-progress cards',
          'Hold quick sync on pending code reviews',
        ],
      });
    }

    const taskTitles = projectTasks.map((t) => `[${t.status.toUpperCase()}] (${t.priority}): ${t.title}`).join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an AI Executive Project Lead.
Tasks in Project:
${taskTitles}

Provide a concise executive summary of project health, potential bottlenecks, and 3 high-impact recommendations.
Return JSON format:
{
  "summary": "Concise 2-sentence health overview",
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
}`,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err) {
    console.error('AI Summary error:', err);
    res.status(500).json({ error: 'Failed to generate project summary' });
  }
});

// Create HTTP Server
const server = http.createServer(app);

// Initialize WebSocket Server
const wss = new WebSocketServer({ server });

function getPresenceList(projectId?: string): PresenceUser[] {
  const presenceMap = new Map<string, PresenceUser>();
  wss.clients.forEach((c) => {
    const client = c as ExtendedWebSocket;
    if (client.readyState === WebSocket.OPEN && client.userId) {
      if (!projectId || client.projectId === projectId) {
        presenceMap.set(client.userId, {
          id: client.userId,
          name: client.userName || 'Anonymous',
          avatar: client.userAvatar || '',
          color: client.userColor || '#3b82f6',
          activeTaskId: client.activeTaskId || null,
          lastActive: new Date().toISOString(),
        });
      }
    }
  });
  return Array.from(presenceMap.values());
}

function broadcast(event: WSEvent, targetProjectId?: string, skipClient?: WebSocket) {
  const payloadStr = JSON.stringify(event);
  wss.clients.forEach((c) => {
    const client = c as ExtendedWebSocket;
    if (
      client.readyState === WebSocket.OPEN &&
      client !== skipClient &&
      (!targetProjectId || client.projectId === targetProjectId)
    ) {
      client.send(payloadStr);
    }
  });
}

wss.on('connection', (ws: ExtendedWebSocket) => {
  ws.isAlive = true;

  ws.on('pong', () => {
    ws.isAlive = true;
  });

  ws.on('message', (message: string) => {
    try {
      const data: WSEvent = JSON.parse(message.toString());

      switch (data.type) {
        case 'JOIN_PROJECT': {
          const { user, projectId } = data.payload;
          ws.userId = user.id;
          ws.userName = user.name;
          ws.userAvatar = user.avatar;
          ws.userColor = user.color || '#3b82f6';
          ws.projectId = projectId || 'proj_launch';

          // Send full current state to newly joined client
          ws.send(
            JSON.stringify({
              type: 'INIT_STATE',
              payload: {
                projects: state.projects,
                tasks: state.tasks.filter((t) => t.projectId === ws.projectId),
                comments: state.comments,
                activities: state.activities.filter((a) => a.projectId === ws.projectId),
                presence: getPresenceList(ws.projectId),
              },
            })
          );

          // Broadcast presence update to others in project
          broadcast(
            {
              type: 'PRESENCE_UPDATE',
              projectId: ws.projectId,
              payload: { presence: getPresenceList(ws.projectId) },
            },
            ws.projectId
          );
          break;
        }

        case 'TASK_CREATED': {
          const newTask: Task = data.payload.task;
          // Guard against duplicates
          if (!state.tasks.some((t) => t.id === newTask.id)) {
            state.tasks.unshift(newTask);

            // Log activity
            const activity: ActivityLog = {
              id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
              projectId: newTask.projectId,
              taskId: newTask.id,
              taskTitle: newTask.title,
              userId: data.senderId || ws.userId || 'system',
              userName: ws.userName || 'Someone',
              userAvatar: ws.userAvatar || '',
              action: 'created_task',
              details: `created task "${newTask.title}"`,
              timestamp: new Date().toISOString(),
            };
            state.activities.unshift(activity);

            broadcast({ type: 'TASK_CREATED', projectId: newTask.projectId, payload: { task: newTask, activity } }, newTask.projectId);
          }
          break;
        }

        case 'TASK_UPDATED': {
          const updatedTask: Task = data.payload.task;
          const idx = state.tasks.findIndex((t) => t.id === updatedTask.id);
          if (idx !== -1) {
            state.tasks[idx] = { ...updatedTask, updatedAt: new Date().toISOString() };

            broadcast({ type: 'TASK_UPDATED', projectId: updatedTask.projectId, payload: { task: state.tasks[idx] } }, updatedTask.projectId);
          }
          break;
        }

        case 'TASK_MOVED': {
          const { taskId, newStatus, newPosition } = data.payload;
          const task = state.tasks.find((t) => t.id === taskId);
          if (task) {
            const oldStatus = task.status;
            task.status = newStatus;
            task.position = newPosition;
            task.updatedAt = new Date().toISOString();

            const activity: ActivityLog = {
              id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
              projectId: task.projectId,
              taskId: task.id,
              taskTitle: task.title,
              userId: ws.userId || 'system',
              userName: ws.userName || 'Someone',
              userAvatar: ws.userAvatar || '',
              action: 'moved_task',
              details: `moved "${task.title}" to ${newStatus.replace('_', ' ').toUpperCase()}`,
              timestamp: new Date().toISOString(),
            };
            state.activities.unshift(activity);

            broadcast({ type: 'TASK_MOVED', projectId: task.projectId, payload: { task, oldStatus, newStatus, activity } }, task.projectId);
          }
          break;
        }

        case 'TASK_DELETED': {
          const { taskId, projectId } = data.payload;
          const task = state.tasks.find((t) => t.id === taskId);
          if (task) {
            state.tasks = state.tasks.filter((t) => t.id !== taskId);
            const activity: ActivityLog = {
              id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
              projectId,
              taskId,
              taskTitle: task.title,
              userId: ws.userId || 'system',
              userName: ws.userName || 'Someone',
              userAvatar: ws.userAvatar || '',
              action: 'deleted_task',
              details: `deleted task "${task.title}"`,
              timestamp: new Date().toISOString(),
            };
            state.activities.unshift(activity);

            broadcast({ type: 'TASK_DELETED', projectId, payload: { taskId, activity } }, projectId);
          }
          break;
        }

        case 'COMMENT_ADDED': {
          const newComment: Comment = data.payload.comment;
          if (!state.comments.some((c) => c.id === newComment.id)) {
            state.comments.push(newComment);

            const task = state.tasks.find((t) => t.id === newComment.taskId);
            let activity: ActivityLog | null = null;
            if (task) {
              activity = {
                id: `act_${Date.now()}`,
                projectId: task.projectId,
                taskId: task.id,
                taskTitle: task.title,
                userId: newComment.userId,
                userName: newComment.userName,
                userAvatar: newComment.userAvatar,
                action: 'added_comment',
                details: `commented on "${task.title}"`,
                timestamp: new Date().toISOString(),
              };
              state.activities.unshift(activity);
            }

            broadcast({ type: 'COMMENT_ADDED', projectId: ws.projectId, payload: { comment: newComment, activity } }, ws.projectId);
          }
          break;
        }

        case 'TASK_LOCK': {
          const { taskId, isLocked } = data.payload;
          ws.activeTaskId = isLocked ? taskId : null;
          const task = state.tasks.find((t) => t.id === taskId);
          if (task) {
            task.activeEditingUser = isLocked
              ? {
                  id: ws.userId || 'anon',
                  name: ws.userName || 'Someone',
                  avatar: ws.userAvatar || '',
                  color: ws.userColor || '#3b82f6',
                }
              : null;

            broadcast({ type: 'TASK_LOCK', projectId: task.projectId, payload: { taskId, activeEditingUser: task.activeEditingUser } }, task.projectId);
            broadcast({ type: 'PRESENCE_UPDATE', projectId: ws.projectId, payload: { presence: getPresenceList(ws.projectId) } }, ws.projectId);
          }
          break;
        }

        case 'PROJECT_CREATED': {
          const newProj: Project = data.payload.project;
          if (!state.projects.some((p) => p.id === newProj.id)) {
            state.projects.push(newProj);
            broadcast({ type: 'PROJECT_CREATED', payload: { project: newProj } });
          }
          break;
        }
      }
    } catch (e) {
      console.error('Error handling WebSocket message:', e);
    }
  });

  ws.on('close', () => {
    if (ws.activeTaskId) {
      const task = state.tasks.find((t) => t.id === ws.activeTaskId);
      if (task) {
        task.activeEditingUser = null;
        broadcast({ type: 'TASK_LOCK', projectId: task.projectId, payload: { taskId: task.id, activeEditingUser: null } }, task.projectId);
      }
    }
    if (ws.projectId) {
      broadcast(
        {
          type: 'PRESENCE_UPDATE',
          projectId: ws.projectId,
          payload: { presence: getPresenceList(ws.projectId) },
        },
        ws.projectId
      );
    }
  });
});

// Heartbeat ping interval
const interval = setInterval(() => {
  wss.clients.forEach((c) => {
    const client = c as ExtendedWebSocket;
    if (client.isAlive === false) return client.terminate();
    client.isAlive = false;
    client.ping();
  });
}, 30000);

wss.on('close', () => {
  clearInterval(interval);
});

// Vite middleware in development
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Task Collaboration Server running at http://0.0.0.0:${PORT}`);
  });
}

setupServer();
