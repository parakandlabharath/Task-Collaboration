import React from 'react';
import { Task } from '../types';
import { PRIORITY_CONFIG } from '../lib/constants';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onTaskClick }) => {
  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Generate simple 28-day calendar grid
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-blue-500" />
          {currentMonth}
        </h2>
        <div className="flex items-center gap-1">
          <button className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="text-center text-xs font-bold text-slate-400 uppercase py-1">
            {d}
          </div>
        ))}

        {days.map((day) => {
          const isToday = day === today.getDate();
          // Find tasks due on this day in current month
          const dayTasks = tasks.filter((t) => {
            const date = new Date(t.dueDate);
            return date.getDate() === day;
          });

          return (
            <div
              key={day}
              className={`min-h-[100px] rounded-xl border p-2 flex flex-col justify-between transition ${
                isToday
                  ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/20'
                  : 'border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold ${
                    isToday
                      ? 'flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {day}
                </span>
                {dayTasks.length > 0 && (
                  <span className="text-[10px] font-extrabold text-slate-400">
                    {dayTasks.length} task{dayTasks.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <div className="mt-1 space-y-1 overflow-y-auto max-h-16">
                {dayTasks.map((t) => {
                  const priority = PRIORITY_CONFIG[t.priority] || PRIORITY_CONFIG.medium;
                  return (
                    <div
                      key={t.id}
                      onClick={() => onTaskClick(t)}
                      className={`cursor-pointer rounded px-1.5 py-1 text-[10px] font-bold truncate transition hover:opacity-80 ${priority.badgeBg}`}
                      title={t.title}
                    >
                      {t.title}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
