import React from 'react';
import {
  Kanban,
  ListFilter,
  Calendar,
  Grid2X2,
  Activity,
  CheckCircle2,
  Tag,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Task } from '../types';

export type ViewMode = 'kanban' | 'list' | 'calendar' | 'matrix' | 'activity';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  tasks: Task[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  selectedPriority: string | null;
  onSelectPriority: (p: string | null) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  tasks,
  selectedTag,
  onSelectTag,
  selectedPriority,
  onSelectPriority,
}) => {
  // Compute tag stats
  const allTags = Array.from(new Set(tasks.flatMap((t) => t.tags || [])));
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/60 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Navigation Views */}
        <div>
          <div className="px-2 text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">
            Workspace Views
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => onViewChange('kanban')}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                currentView === 'kanban'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <Kanban className="h-4 w-4" />
              <span>Kanban Board</span>
            </button>

            <button
              onClick={() => onViewChange('list')}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                currentView === 'list'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <ListFilter className="h-4 w-4" />
              <span>List View</span>
            </button>

            <button
              onClick={() => onViewChange('calendar')}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                currentView === 'calendar'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Calendar</span>
            </button>

            <button
              onClick={() => onViewChange('matrix')}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                currentView === 'matrix'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <Grid2X2 className="h-4 w-4" />
              <span>Eisenhower Matrix</span>
            </button>

            <button
              onClick={() => onViewChange('activity')}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                currentView === 'activity'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <Activity className="h-4 w-4 text-emerald-500" />
              <div className="flex w-full items-center justify-between">
                <span>Live Activity</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </button>
          </nav>
        </div>

        {/* Filters section */}
        <div>
          <div className="flex items-center justify-between px-2 text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">
            <span>Filter Tags</span>
            {selectedTag && (
              <button
                onClick={() => onSelectTag(null)}
                className="text-xs text-blue-500 hover:underline capitalize"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 px-1">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onSelectTag(selectedTag === tag ? null : tag)}
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition ${
                  selectedTag === tag
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
                    : 'bg-white text-slate-600 hover:bg-slate-200/70 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <Tag className="h-3 w-3 text-slate-400" />
                <span>{tag}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <div className="flex items-center justify-between px-2 text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">
            <span>Priority Filter</span>
            {selectedPriority && (
              <button
                onClick={() => onSelectPriority(null)}
                className="text-xs text-blue-500 hover:underline capitalize"
              >
                Clear
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-1.5 px-1">
            {['urgent', 'high', 'medium', 'low'].map((p) => (
              <button
                key={p}
                onClick={() => onSelectPriority(selectedPriority === p ? null : p)}
                className={`rounded-md px-2 py-1 text-xs font-semibold capitalize transition ${
                  selectedPriority === p
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-white text-slate-600 hover:bg-slate-200/70 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom section: Progress Widget */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-800/80">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Project Velocity
          </span>
          <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
            {progressPercent}%
          </span>
        </div>
        <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          {completedTasks} of {tasks.length} tasks completed
        </div>
      </div>
    </aside>
  );
};
