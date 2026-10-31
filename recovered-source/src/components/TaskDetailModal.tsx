import React, { useState, useEffect } from 'react';
import { Task, Comment, User, TaskStatus, TaskPriority } from '../types';
import { PRESET_USERS, COLUMNS, PRIORITY_CONFIG } from '../lib/constants';
import {
  X,
  Sparkles,
  Plus,
  Trash2,
  Send,
  Calendar,
  User as UserIcon,
  Tag as TagIcon,
  CheckSquare,
  Lock,
  MessageSquare,
} from 'lucide-react';

interface TaskDetailModalProps {
  task: Task;
  comments: Comment[];
  currentUser: User;
  onClose: () => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddComment: (taskId: string, content: string) => void;
  onLockTask: (taskId: string, isLocked: boolean) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  comments,
  currentUser,
  onClose,
  onUpdateTask,
  onDeleteTask,
  onAddComment,
  onLockTask,
}) => {
  const [editedTask, setEditedTask] = useState<Task>({ ...task });
  const [newChecklistText, setNewChecklistText] = useState('');
  const [newTagText, setNewTagText] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Send edit lock notification when modal opens & unlock on unmount
  useEffect(() => {
    onLockTask(task.id, true);
    return () => {
      onLockTask(task.id, false);
    };
  }, [task.id, onLockTask]);

  const handleSave = () => {
    onUpdateTask(editedTask);
    onClose();
  };

  const handleAddChecklist = () => {
    if (!newChecklistText.trim()) return;
    const newItem = {
      id: `c_${Date.now()}`,
      text: newChecklistText.trim(),
      completed: false,
    };
    const updated = {
      ...editedTask,
      checklist: [...(editedTask.checklist || []), newItem],
    };
    setEditedTask(updated);
    onUpdateTask(updated);
    setNewChecklistText('');
  };

  const toggleChecklist = (id: string) => {
    const updatedChecklist = editedTask.checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    const updated = { ...editedTask, checklist: updatedChecklist };
    setEditedTask(updated);
    onUpdateTask(updated);
  };

  const deleteChecklist = (id: string) => {
    const updatedChecklist = editedTask.checklist.filter((item) => item.id !== id);
    const updated = { ...editedTask, checklist: updatedChecklist };
    setEditedTask(updated);
    onUpdateTask(updated);
  };

  const handleAddTag = () => {
    if (!newTagText.trim()) return;
    if (!editedTask.tags.includes(newTagText.trim())) {
      const updated = { ...editedTask, tags: [...editedTask.tags, newTagText.trim()] };
      setEditedTask(updated);
      onUpdateTask(updated);
    }
    setNewTagText('');
  };

  const handleGenerateAiSubtasks = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editedTask.title,
          description: editedTask.description,
        }),
      });
      const data = await res.json();
      if (data.subtasks && Array.isArray(data.subtasks)) {
        const newItems = data.subtasks.map((st: string, idx: number) => ({
          id: `ai_${Date.now()}_${idx}`,
          text: st,
          completed: false,
        }));
        const updated = {
          ...editedTask,
          checklist: [...(editedTask.checklist || []), ...newItems],
        };
        setEditedTask(updated);
        onUpdateTask(updated);
      }
    } catch (e) {
      console.error('Failed to generate AI subtasks:', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    onAddComment(task.id, commentContent.trim());
    setCommentContent('');
  };

  const taskComments = comments.filter((c) => c.taskId === task.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="flex h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-slate-200/80 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 font-bold text-xs">
              TSK
            </span>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Task Workspace
              </span>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {task.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onDeleteTask(task.id);
                onClose();
              }}
              className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 transition"
              title="Delete Task"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Grid */}
        <div className="grid flex-1 grid-cols-1 md:grid-cols-3 overflow-hidden">
          {/* Main Details (Left 2 Columns) */}
          <div className="col-span-2 space-y-6 overflow-y-auto p-6 border-r border-slate-100 dark:border-slate-800">
            {/* Title */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">Task Title</label>
              <input
                type="text"
                value={editedTask.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                onBlur={handleSave}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 outline-none focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">Description</label>
              <textarea
                rows={4}
                value={editedTask.description}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                onBlur={handleSave}
                placeholder="Add detailed task instructions..."
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 outline-none focus:border-blue-500"
              />
            </div>

            {/* Subtask Checklist & AI Generator */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Subtask Checklist ({editedTask.checklist?.filter((c) => c.completed).length || 0}/
                    {editedTask.checklist?.length || 0})
                  </span>
                </div>

                <button
                  onClick={handleGenerateAiSubtasks}
                  disabled={isAiLoading}
                  className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300 transition"
                >
                  <Sparkles className="h-3 w-3 text-indigo-500" />
                  <span>{isAiLoading ? 'Generating...' : 'AI Subtasks'}</span>
                </button>
              </div>

              {/* Add Subtask Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a new subtask item..."
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddChecklist()}
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                <button
                  onClick={handleAddChecklist}
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Add
                </button>
              </div>

              {/* Checklist items list */}
              <div className="mt-3 space-y-1.5">
                {editedTask.checklist?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleChecklist(item.id)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span
                        className={
                          item.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-200 font-medium'
                        }
                      >
                        {item.text}
                      </span>
                    </label>

                    <button
                      onClick={() => deleteChecklist(item.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments Thread */}
            <div className="border-t border-slate-200/80 pt-4 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                Live Discussion ({taskComments.length})
              </h3>

              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {taskComments.length === 0 ? (
                  <div className="text-xs text-slate-400 italic">No comments yet. Start the conversation!</div>
                ) : (
                  taskComments.map((c) => (
                    <div key={c.id} className="flex gap-2.5 text-xs">
                      <img src={c.userAvatar} alt={c.userName} className="h-6 w-6 rounded-full object-cover" />
                      <div className="flex-1 rounded-xl bg-slate-100 p-2.5 dark:bg-slate-800">
                        <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                          <span>{c.userName}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {new Date(c.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="mt-1 text-slate-700 dark:text-slate-300">{c.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Comment Input */}
              <form onSubmit={handleSendComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a comment..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Task Metadata Side Panel (Right Column) */}
          <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 space-y-6">
            {/* Status Select */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">Status</label>
              <select
                value={editedTask.status}
                onChange={(e) => {
                  const updated = { ...editedTask, status: e.target.value as TaskStatus };
                  setEditedTask(updated);
                  onUpdateTask(updated);
                }}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 outline-none"
              >
                {COLUMNS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Select */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">Priority</label>
              <select
                value={editedTask.priority}
                onChange={(e) => {
                  const updated = { ...editedTask, priority: e.target.value as TaskPriority };
                  setEditedTask(updated);
                  onUpdateTask(updated);
                }}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 outline-none capitalize"
              >
                {['low', 'medium', 'high', 'urgent'].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">Due Date</label>
              <input
                type="date"
                value={editedTask.dueDate ? editedTask.dueDate.split('T')[0] : ''}
                onChange={(e) => {
                  const updated = { ...editedTask, dueDate: new Date(e.target.value).toISOString() };
                  setEditedTask(updated);
                  onUpdateTask(updated);
                }}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 outline-none"
              />
            </div>

            {/* Assignees */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase mb-1 block">Assignees</label>
              <div className="space-y-1.5">
                {PRESET_USERS.map((u) => {
                  const isAssigned = editedTask.assignees?.some((a) => a.id === u.id);
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        const newAssignees = isAssigned
                          ? editedTask.assignees.filter((a) => a.id !== u.id)
                          : [...(editedTask.assignees || []), u];
                        const updated = { ...editedTask, assignees: newAssignees };
                        setEditedTask(updated);
                        onUpdateTask(updated);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg p-2 text-xs font-medium transition ${
                        isAssigned
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={u.avatar} alt={u.name} className="h-5 w-5 rounded-full object-cover" />
                        <span>{u.name}</span>
                      </div>
                      {isAssigned && <span className="font-bold">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase mb-1 block">Tags</label>
              <div className="flex flex-wrap gap-1 mb-2">
                {editedTask.tags?.map((t) => (
                  <span key={t} className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    #{t}
                  </span>
                ))}
              </div>
              <div className="flex gap-1">
                <input
                  type="text"
                  placeholder="New tag..."
                  value={newTagText}
                  onChange={(e) => setNewTagText(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-200 px-2 py-1 text-xs outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                <button onClick={handleAddTag} className="rounded bg-slate-800 px-2.5 py-1 text-xs font-bold text-white dark:bg-slate-200 dark:text-slate-900">
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
