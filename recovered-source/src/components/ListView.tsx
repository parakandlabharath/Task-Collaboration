import React from 'react';
import { Task, TaskStatus } from '../types';
import { COLUMNS, PRIORITY_CONFIG } from '../lib/constants';
import { CheckSquare, MessageSquare, Trash2, Calendar } from 'lucide-react';

interface ListViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onMoveTask: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
}

export const ListView: React.FC<ListViewProps> = ({
  tasks,
  onTaskClick,
  onMoveTask,
  onDeleteTask,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/80 dark:bg-slate-800/50 dark:border-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Task Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Assignees</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Checklist</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400 font-medium">
                    No tasks match the current filter criteria.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => {
                  const column = COLUMNS.find((c) => c.id === task.status) || COLUMNS[0];
                  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
                  const completedChecklist = task.checklist ? task.checklist.filter((c) => c.completed).length : 0;
                  const totalChecklist = task.checklist ? task.checklist.length : 0;

                  return (
                    <tr
                      key={task.id}
                      onClick={() => onTaskClick(task)}
                      className="cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-2">
                          {task.activeEditingUser && (
                            <span
                              className="h-2 w-2 rounded-full animate-ping"
                              style={{ backgroundColor: task.activeEditingUser.color }}
                              title={`${task.activeEditingUser.name} is currently editing`}
                            />
                          )}
                          <span>{task.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <select
                          value={task.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => onMoveTask(task.id, e.target.value as TaskStatus)}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 outline-none"
                        >
                          {COLUMNS.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${priority.badgeBg}`}>
                          {priority.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center -space-x-1">
                          {task.assignees?.map((a) => (
                            <img
                              key={a.id}
                              src={a.avatar}
                              alt={a.name}
                              className="h-5 w-5 rounded-full border border-white object-cover dark:border-slate-800"
                              title={a.name}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400">
                        {totalChecklist > 0 ? (
                          <span className="flex items-center gap-1 font-semibold">
                            <CheckSquare className="h-3.5 w-3.5 text-slate-400" />
                            {completedChecklist}/{totalChecklist}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteTask(task.id);
                          }}
                          className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
