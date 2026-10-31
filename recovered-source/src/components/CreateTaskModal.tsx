import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority, User } from '../types';
import { PRESET_USERS, COLUMNS } from '../lib/constants';
import { X, Plus, Calendar } from 'lucide-react';

interface CreateTaskModalProps {
  initialStatus?: TaskStatus;
  currentUser: User;
  onClose: () => void;
  onCreateTask: (task: Partial<Task>) => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  initialStatus = 'todo',
  currentUser,
  onClose,
  onCreateTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(initialStatus);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [selectedAssignees, setSelectedAssignees] = useState<User[]>([currentUser]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Frontend']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateTask({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assignees: selectedAssignees,
      tags,
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    });
    onClose();
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Create New Task
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Task Title</label>
            <input
              type="text"
              required
              placeholder="e.g., Set up Redis Caching Layer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
            <textarea
              rows={3}
              placeholder="Describe the task specifications..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Column Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 outline-none"
              >
                {COLUMNS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 outline-none capitalize"
              >
                {['low', 'medium', 'high', 'urgent'].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Assignees */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Assign Team Members</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_USERS.map((u) => {
                const isSelected = selectedAssignees.some((a) => a.id === u.id);
                return (
                  <button
                    type="button"
                    key={u.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedAssignees(selectedAssignees.filter((a) => a.id !== u.id));
                      } else {
                        setSelectedAssignees([...selectedAssignees, u]);
                      }
                    }}
                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <img src={u.avatar} alt={u.name} className="h-4 w-4 rounded-full object-cover" />
                    <span>{u.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
