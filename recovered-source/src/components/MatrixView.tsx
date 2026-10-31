import React from 'react';
import { Task } from '../types';
import { Flame, Zap, Clock, ShieldAlert } from 'lucide-react';

interface MatrixViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export const MatrixView: React.FC<MatrixViewProps> = ({ tasks, onTaskClick }) => {
  const urgentHigh = tasks.filter((t) => t.priority === 'urgent');
  const highPriority = tasks.filter((t) => t.priority === 'high');
  const mediumPriority = tasks.filter((t) => t.priority === 'medium');
  const lowPriority = tasks.filter((t) => t.priority === 'low');

  const quadrants = [
    {
      title: 'Do First (Urgent & Critical)',
      icon: Flame,
      color: 'border-rose-300 bg-rose-50/40 dark:border-rose-900/60 dark:bg-rose-950/20',
      badge: 'bg-rose-500 text-white',
      tasks: urgentHigh,
    },
    {
      title: 'Schedule (High Value & Important)',
      icon: Zap,
      color: 'border-amber-300 bg-amber-50/40 dark:border-amber-900/60 dark:bg-amber-950/20',
      badge: 'bg-amber-500 text-white',
      tasks: highPriority,
    },
    {
      title: 'Delegate (Routine & Medium)',
      icon: Clock,
      color: 'border-blue-300 bg-blue-50/40 dark:border-blue-900/60 dark:bg-blue-950/20',
      badge: 'bg-blue-500 text-white',
      tasks: mediumPriority,
    },
    {
      title: 'Eliminate or Backlog (Low)',
      icon: ShieldAlert,
      color: 'border-slate-300 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-900/40',
      badge: 'bg-slate-500 text-white',
      tasks: lowPriority,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="grid h-full grid-cols-1 md:grid-cols-2 gap-4">
        {quadrants.map((q) => {
          const Icon = q.icon;
          return (
            <div
              key={q.title}
              className={`flex flex-col rounded-2xl border p-4 shadow-sm transition ${q.color}`}
            >
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${q.badge}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide dark:text-slate-200">
                    {q.title}
                  </h3>
                </div>
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {q.tasks.length}
                </span>
              </div>

              <div className="mt-3 flex-1 space-y-2 overflow-y-auto max-h-[320px]">
                {q.tasks.length === 0 ? (
                  <div className="py-8 text-center text-xs font-medium text-slate-400">
                    No items in this quadrant
                  </div>
                ) : (
                  q.tasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => onTaskClick(t)}
                      className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3 shadow-xs hover:border-blue-400 transition dark:border-slate-800 dark:bg-slate-900"
                    >
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{t.title}</h4>
                      <p className="mt-1 text-[11px] text-slate-500 line-clamp-1 dark:text-slate-400">
                        {t.description || 'No description provided'}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
