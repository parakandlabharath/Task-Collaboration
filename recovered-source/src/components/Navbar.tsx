import React, { useState } from 'react';
import {
  Kanban,
  Sparkles,
  Plus,
  Search,
  Wifi,
  WifiOff,
  UserCheck,
  Share2,
  FolderPlus,
  ChevronDown,
} from 'lucide-react';
import { Project, PresenceUser, User } from '../types';
import { PRESET_USERS } from '../lib/constants';

interface NavbarProps {
  projects: Project[];
  currentProjectId: string;
  onSelectProject: (id: string) => void;
  currentUser: User;
  onOpenUserSwitcher: () => void;
  onOpenCreateTask: () => void;
  onOpenAIModal: () => void;
  onOpenCreateProject: () => void;
  presence: PresenceUser[];
  isConnected: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  projects,
  currentProjectId,
  onSelectProject,
  currentUser,
  onOpenUserSwitcher,
  onOpenCreateTask,
  onOpenAIModal,
  onOpenCreateProject,
  presence,
  isConnected,
  searchQuery,
  onSearchChange,}) => {
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const currentProject = projects.find((p) => p.id === currentProjectId) || projects[0];

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Share URL copied to clipboard! Open in another tab or send to a teammate to test live collaboration.');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
      {/* Left section: Logo & Project selector */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-blue-500/20">
          <Kanban className="h-5 w-5" />
        </div>

        <div className="relative">
          <button
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-slate-50/50 px-3 py-1.5 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: currentProject?.color || '#3b82f6' }}
            />
            <span className="max-w-[140px] truncate sm:max-w-[200px]">
              {currentProject?.name || 'Select Project'}
            </span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {projectDropdownOpen && (
            <div
              className="absolute left-0 top-full mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900"
              onClick={() => setProjectDropdownOpen(false)}
            >
              <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Workspaces & Projects
              </div>
              <div className="mt-1 space-y-1">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onSelectProject(p.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition ${
                      p.id === currentProjectId
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: p.color }}
                      />
                      {p.name}
                    </span>
                    {p.id === currentProjectId && <span className="text-xs font-bold">✓</span>}
                  </button>
                ))}
              </div>
              <div className="mt-2 border-t border-slate-100 pt-2 dark:border-slate-800">
                <button
                  onClick={onOpenCreateProject}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40"
                >
                  <FolderPlus className="h-3.5 w-3.5" />
                  Create New Project
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Realtime Status Badge */}
        <div className="hidden items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300 md:flex">
          {isConnected ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <Wifi className="h-3 w-3 text-emerald-500" />
              <span>Live Sync Active</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3 text-amber-500" />
              <span>Connecting...</span>
            </>
          )}
        </div>
      </div>

      {/* Middle section: Search bar */}
      <div className="hidden max-w-xs flex-1 px-4 lg:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks, tags, assignees..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200/80 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:bg-slate-900"
          />
        </div>
      </div>

      {/* Right section: Online collaborators, AI Insights, User switcher, New Task */}
      <div className="flex items-center gap-2">
        {/* Active Collaborators list */}
        <div className="hidden items-center -space-x-2 sm:flex">
          {presence.slice(0, 4).map((p) => (
            <div
              key={p.id}
              className="group relative"
              title={`${p.name} (Online)`}
            >
              <img
                src={p.avatar}
                alt={p.name}
                className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-slate-900"
              />
              <span
                className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white bg-emerald-500 dark:border-slate-900"
              />
            </div>
          ))}
          {presence.length > 4 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-xs font-bold text-slate-700 dark:border-slate-900 dark:bg-slate-800 dark:text-slate-300">
              +{presence.length - 4}
            </div>
          )}
        </div>

        {/* Share Button */}
        <button
          onClick={copyShareLink}
          title="Share Project URL"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Share2 className="h-4 w-4" />
        </button>

        {/* AI Assistant Button */}
        <button
          onClick={onOpenAIModal}
          className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900/60"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          <span className="hidden sm:inline">AI Insights</span>
        </button>

        {/* Current Identity Switcher */}
        <button
          onClick={onOpenUserSwitcher}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="h-5 w-5 rounded-full object-cover"
          />
          <span className="hidden max-w-[90px] truncate md:inline">
            {currentUser.name.split(' ')[0]}
          </span>
          <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
        </button>

        {/* Create Task Button */}
        <button
          onClick={onOpenCreateTask}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};
