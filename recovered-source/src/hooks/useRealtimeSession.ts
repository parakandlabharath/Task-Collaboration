import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Task,
  Project,
  Comment,
  ActivityLog,
  PresenceUser,
  User,
  WSEvent,
  TaskStatus,
} from '../types';
import { PRESET_USERS } from '../lib/constants';

export function useRealtimeSession(initialUser: User = PRESET_USERS[0], initialProjectId: string = 'proj_launch') {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('task_collab_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return initialUser;
  });

  const [currentProjectId, setCurrentProjectId] = useState<string>(initialProjectId);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [presence, setPresence] = useState<PresenceUser[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [latestToast, setLatestToast] = useState<{ id: string; message: string; type: 'info' | 'success' | 'warn' } | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<any>(null);

  // Save current user selection to localStorage
  useEffect(() => {
    localStorage.setItem('task_collab_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'warn' = 'info') => {
    setLatestToast({ id: `toast_${Date.now()}`, message, type });
  }, []);

  const connectWebSocket = useCallback(() => {
    if (socketRef.current && (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      // Send join project payload
      ws.send(
        JSON.stringify({
          type: 'JOIN_PROJECT',
          payload: { user: currentUser, projectId: currentProjectId },
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const data: WSEvent = JSON.parse(event.data);

        switch (data.type) {
          case 'INIT_STATE': {
            const { projects, tasks, comments, activities, presence } = data.payload;
            if (projects) setProjects(projects);
            if (tasks) setTasks(tasks);
            if (comments) setComments(comments);
            if (activities) setActivities(activities);
            if (presence) setPresence(presence);
            break;
          }

          case 'PRESENCE_UPDATE': {
            if (data.payload.presence) {
              setPresence(data.payload.presence);
            }
            break;
          }

          case 'TASK_CREATED': {
            const { task, activity } = data.payload;
            setTasks((prev) => {
              if (prev.some((t) => t.id === task.id)) return prev;
              return [task, ...prev];
            });
            if (activity) {
              setActivities((prev) => [activity, ...prev]);
              if (activity.userId !== currentUser.id) {
                showToast(`${activity.userName} created task "${task.title}"`, 'info');
              }
            }
            break;
          }

          case 'TASK_UPDATED': {
            const { task } = data.payload;
            setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
            break;
          }

          case 'TASK_MOVED': {
            const { task, oldStatus, newStatus, activity } = data.payload;
            setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
            if (activity) {
              setActivities((prev) => [activity, ...prev]);
              if (activity.userId !== currentUser.id) {
                showToast(`${activity.userName} moved "${task.title}" to ${newStatus.replace('_', ' ').toUpperCase()}`, 'info');
              }
            }
            break;
          }

          case 'TASK_DELETED': {
            const { taskId, activity } = data.payload;
            setTasks((prev) => prev.filter((t) => t.id !== taskId));
            if (activity) {
              setActivities((prev) => [activity, ...prev]);
              if (activity.userId !== currentUser.id) {
                showToast(`${activity.userName} deleted a task`, 'warn');
              }
            }
            break;
          }

          case 'COMMENT_ADDED': {
            const { comment, activity } = data.payload;
            setComments((prev) => {
              if (prev.some((c) => c.id === comment.id)) return prev;
              return [...prev, comment];
            });
            if (activity) {
              setActivities((prev) => [activity, ...prev]);
              if (activity.userId !== currentUser.id) {
                showToast(`${comment.userName} added a comment`, 'info');
              }
            }
            break;
          }

          case 'TASK_LOCK': {
            const { taskId, activeEditingUser } = data.payload;
            setTasks((prev) =>
              prev.map((t) => (t.id === taskId ? { ...t, activeEditingUser } : t))
            );
            break;
          }

          case 'PROJECT_CREATED': {
            const { project } = data.payload;
            setProjects((prev) => {
              if (prev.some((p) => p.id === project.id)) return prev;
              return [...prev, project];
            });
            showToast(`New project created: ${project.name}`, 'success');
            break;
          }
        }
      } catch (e) {
        console.error('Error handling WebSocket message:', e);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      socketRef.current = null;
      // Auto reconnect after 3s
      reconnectTimerRef.current = setTimeout(() => {
        connectWebSocket();
      }, 3000);
    };

    ws.onerror = (err) => {
      console.error('WebSocket connection error:', err);
    };
  }, [currentUser, currentProjectId, showToast]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connectWebSocket]);

  // Handle identity or project switch
  const switchProject = (projectId: string) => {
    setCurrentProjectId(projectId);
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'JOIN_PROJECT',
          payload: { user: currentUser, projectId },
        })
      );
    }
  };

  const switchUserIdentity = (newUser: User) => {
    setCurrentUser(newUser);
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'JOIN_PROJECT',
          payload: { user: newUser, projectId: currentProjectId },
        })
      );
    }
  };

  // Dispatchers
  const createTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      projectId: currentProjectId,
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      assignees: taskData.assignees || [currentUser],
      tags: taskData.tags || [],
      dueDate: taskData.dueDate || new Date(Date.now() + 86400000 * 7).toISOString(),
      checklist: taskData.checklist || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      position: tasks.filter((t) => t.status === (taskData.status || 'todo')).length,
    };

    // Optimistic local add
    setTasks((prev) => [newTask, ...prev]);

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'TASK_CREATED',
          projectId: currentProjectId,
          senderId: currentUser.id,
          payload: { task: newTask },
        })
      );
    }
  };

  const updateTask = (updatedTask: Task) => {
    // Optimistic update
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'TASK_UPDATED',
          projectId: currentProjectId,
          senderId: currentUser.id,
          payload: { task: updatedTask },
        })
      );
    }
  };

  const moveTask = (taskId: string, newStatus: TaskStatus, newPosition: number = 0) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    const updatedTask = { ...targetTask, status: newStatus, position: newPosition, updatedAt: new Date().toISOString() };
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'TASK_MOVED',
          projectId: currentProjectId,
          senderId: currentUser.id,
          payload: { taskId, newStatus, newPosition },
        })
      );
    }
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'TASK_DELETED',
          projectId: currentProjectId,
          senderId: currentUser.id,
          payload: { taskId, projectId: currentProjectId },
        })
      );
    }
  };

  const addComment = (taskId: string, content: string) => {
    if (!content.trim()) return;

    const newComment: Comment = {
      id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      taskId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [...prev, newComment]);

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'COMMENT_ADDED',
          projectId: currentProjectId,
          senderId: currentUser.id,
          payload: { comment: newComment },
        })
      );
    }
  };

  const lockTask = (taskId: string, isLocked: boolean) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'TASK_LOCK',
          projectId: currentProjectId,
          senderId: currentUser.id,
          payload: { taskId, isLocked },
        })
      );
    }
  };

  const createProject = (name: string, description: string, color: string = '#3b82f6') => {
    const newProj: Project = {
      id: `proj_${Date.now()}`,
      name,
      description,
      icon: 'Folder',
      color,
      members: PRESET_USERS,
      createdAt: new Date().toISOString(),
    };

    setProjects((prev) => [...prev, newProj]);
    setCurrentProjectId(newProj.id);

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'PROJECT_CREATED',
          payload: { project: newProj },
        })
      );
    }
  };

  return {
    currentUser,
    currentProjectId,
    projects,
    tasks,
    comments,
    activities,
    presence,
    isConnected,
    latestToast,
    switchProject,
    switchUserIdentity,
    createTask,
    updateTask,
    moveTask,
    deleteTask,
    addComment,
    lockTask,
    createProject,
  };
}
