import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  CheckSquare,
  MessageSquare,
  Clock,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Lock,
} from 'lucide-react';
import { Task, TaskStatus } from '../types';
import { COLUMNS, PRIORITY_CONFIG } from '../lib/constants';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onMoveTask: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenCreateTask: (initialStatus?: TaskStatus) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onTaskClick,
  onMoveTask,
  onDeleteTask,
  onOpenCreateTask,
}) => {
  return (
    <div className="flex flex-1 gap-4 overflow-x-auto p-6 scrollbar-thin">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            className="flex w-72 flex-shrink-0 flex-col rounded-2xl border border-slate-200/80 bg-slate-100/60 p-3.5 dark:border-slate-800 dark:bg-slate-900/60"
          >
            {/* Column Header */}
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${col.dotColor}`} />
                <h3 className="text-xs font-bold tracking-wide text-slate-700 uppercase dark:text-slate-300">
                  {col.label}
                </h3>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[11px] font-extrabold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {colTasks.length}
                </span>
              </div>

              <button
                onClick={() => onOpenCreateTask(col.id)}
                className="flex h-6 w-6 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                title={`Add task to ${col.label}`}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Task Cards Column */}
            <div className="flex-1 space-y-3 overflow-y-auto pr-0.5">
              <AnimatePresence>
                {colTasks.length === 0 ? (
                  <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-slate-300 text-xs font-medium text-slate-400 dark:border-slate-800">
                    No tasks in {col.label}
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
                    const completedChecklist = task.checklist ? task.checklist.filter((c) => c.completed).length : 0;
                    const totalChecklist = task.checklist ? task.checklist.length : 0;

                    return (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.18 }}
                        onClick={() => onTaskClick(task)}
                        className={`group relative cursor-pointer rounded-xl border bg-white p-3.5 shadow-sm transition-all hover:border-blue-400 hover:shadow-md dark:bg-slate-800/90 dark:hover:border-blue-500 ${
                          task.activeEditingUser
                            ? 'border-indigo-400 ring-2 ring-indigo-500/20 dark:border-indigo-500'
                            : 'border-slate-200/80 dark:border-slate-700/80'
                        }`}
                      >
                        {/* Live Active Editing Lock Overlay Banner */}
                        {task.activeEditingUser && (
                          <div className="mb-2 flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
                            <span
                              className="h-2 w-2 rounded-full animate-ping"
                              style={{ backgroundColor: task.activeEditingUser.color }}
                            />
                            <Eye className="h-3 w-3 text-indigo-500" />
                            <span className="truncate">
                              {task.activeEditingUser.name} is viewing
                            </span>
                          </div>
                        )}

                        {/* Card Header: Priority & Quick Move Buttons */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${priority.badgeBg}`}
                          >
                            {priority.label}
                          </span>

                          <div className="opacity-0 transition-opacity group-hover:opacity-100 flex items-center gap-1">
                            {/* Column Shift Left */}
                            {col.id !== 'backlog' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const colIds: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'in_review', 'done'];
                                  const currentIdx = colIds.indexOf(col.id);
                                  if (currentIdx > 0) {
                                    onMoveTask(task.id, colIds[currentIdx - 1]);
                                  }
                                }}
                                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700"
                                title="Move Left"
                              >
                                <ChevronLeft className="h-3.5 w-3.5" />
                              </button>
                            )}

                            {/* Column Shift Right */}
                            {col.id !== 'done' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const colIds: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'in_review', 'done'];
                                  const currentIdx = colIds.indexOf(col.id);
                                  if (currentIdx < colIds.length - 1) {
                                    onMoveTask(task.id, colIds[currentIdx + 1]);
                                  }
                                }}
                                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700"
                                title="Move Right"
                              >
                                <ChevronRight className="h-3.5 w-3.5" />
                              </button>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteTask(task.id);
                              }}
                              className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50"
                              title="Delete Task"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Title & Description */}
                        <h4 className="mt-2 text-xs font-bold text-slate-800 line-clamp-2 dark:text-slate-100">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="mt-1 text-[11px] text-slate-500 line-clamp-2 dark:text-slate-400">
                            {task.description}
                          </p>
                        )}

                        {/* Tags */}
                        {task.tags && task.tags.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap gap-1">
                            {task.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Card Footer: Assignees, Checklist count, Comments count */}
                        <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-slate-700/60">
                          <div className="flex items-center -space-x-1.5">
                            {task.assignees && task.assignees.length > 0 ? (
                              task.assignees.map((a) => (
                                <img
                                  key={a.id}
                                  src={a.avatar}
                                  alt={a.name}
                                  className="h-5 w-5 rounded-full border border-white object-cover dark:border-slate-800"
                                  title={a.name}
                                />
                              ))
                            ) : (
                              <span className="text-[10px] text-slate-400">Unassigned</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2.5 text-[11px] text-slate-500 dark:text-slate-400">
                            {totalChecklist > 0 && (
                              <span
                                className={`flex items-center gap-1 font-medium ${
                                  completedChecklist === totalChecklist ? 'text-emerald-600 font-bold' : ''
                                }`}
                              >
                                <CheckSquare className="h-3 w-3" />
                                {completedChecklist}/{totalChecklist}
                              </span>
                            )}

                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
};
