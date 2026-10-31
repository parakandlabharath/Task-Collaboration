import React, { useState, useMemo } from 'react';
import { useRealtimeSession } from './hooks/useRealtimeSession';
import { Navbar } from './components/Navbar';
import { Sidebar, ViewMode } from './components/Sidebar';
import { KanbanBoard } from './components/KanbanBoard';
import { ListView } from './components/ListView';
import { CalendarView } from './components/CalendarView';
import { MatrixView } from './components/MatrixView';
import { ActivityFeed } from './components/ActivityFeed';
import { TaskDetailModal } from './components/TaskDetailModal';
import { CreateTaskModal } from './components/CreateTaskModal';
import { AIModal } from './components/AIModal';
import { UserSwitcherModal } from './components/UserSwitcherModal';
import { CreateProjectModal } from './components/CreateProjectModal';
import { Task, TaskStatus } from './types';
import { Info } from 'lucide-react';

export default function App() {
  const {
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
  } = useRealtimeSession();

  const [currentView, setCurrentView] = useState<ViewMode>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  // Modals state
  const [activeTaskModal, setActiveTaskModal] = useState<Task | null>(null);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [createTaskInitialStatus, setCreateTaskInitialStatus] = useState<TaskStatus>('todo');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (task.projectId !== currentProjectId) return false;

      // Tag filter
      if (selectedTag && (!task.tags || !task.tags.includes(selectedTag))) {
        return false;
      }

      // Priority filter
      if (selectedPriority && task.priority !== selectedPriority) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesDesc = task.description.toLowerCase().includes(q);
        const matchesTags = task.tags?.some((t) => t.toLowerCase().includes(q));
        const matchesAssignees = task.assignees?.some((a) => a.name.toLowerCase().includes(q));
        return matchesTitle || matchesDesc || matchesTags || matchesAssignees;
      }

      return true;
    });
  }, [tasks, currentProjectId, selectedTag, selectedPriority, searchQuery]);

  return (
    <div className="flex h-screen w-screen flex-col bg-slate-100 text-slate-900 font-sans dark:bg-slate-950 dark:text-slate-100 antialiased overflow-hidden select-none">
      {/* Top Navbar */}
      <Navbar
        projects={projects}
        currentProjectId={currentProjectId}
        onSelectProject={switchProject}
        currentUser={currentUser}
        onOpenUserSwitcher={() => setIsUserSwitcherOpen(true)}
        onOpenCreateTask={() => {
          setCreateTaskInitialStatus('todo');
          setIsCreateTaskOpen(true);
        }}
        onOpenAIModal={() => setIsAiModalOpen(true)}
        onOpenCreateProject={() => setIsCreateProjectOpen(true)}
        presence={presence}
        isConnected={isConnected}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Realtime Sync Toast Notification */}
      {latestToast && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl border border-blue-200 bg-white/95 px-4 py-2.5 text-xs font-bold text-slate-800 shadow-xl backdrop-blur-md dark:border-blue-900/60 dark:bg-slate-900 dark:text-slate-100">
          <Info className="h-4 w-4 text-blue-500 animate-bounce" />
          <span>{latestToast.message}</span>
        </div>
      )}

      {/* Main App Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          tasks={tasks.filter((t) => t.projectId === currentProjectId)}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
          selectedPriority={selectedPriority}
          onSelectPriority={setSelectedPriority}
        />

        {/* Dynamic View Panel */}
        <main className="flex flex-1 flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-950/50">
          {currentView === 'kanban' && (
            <KanbanBoard
              tasks={filteredTasks}
              onTaskClick={(t) => setActiveTaskModal(t)}
              onMoveTask={moveTask}
              onDeleteTask={deleteTask}
              onOpenCreateTask={(status) => {
                if (status) setCreateTaskInitialStatus(status);
                setIsCreateTaskOpen(true);
              }}
            />
          )}

          {currentView === 'list' && (
            <ListView
              tasks={filteredTasks}
              onTaskClick={(t) => setActiveTaskModal(t)}
              onMoveTask={moveTask}
              onDeleteTask={deleteTask}
            />
          )}

          {currentView === 'calendar' && (
            <CalendarView
              tasks={filteredTasks}
              onTaskClick={(t) => setActiveTaskModal(t)}
            />
          )}

          {currentView === 'matrix' && (
            <MatrixView
              tasks={filteredTasks}
              onTaskClick={(t) => setActiveTaskModal(t)}
            />
          )}

          {currentView === 'activity' && (
            <ActivityFeed activities={activities.filter((a) => a.projectId === currentProjectId)} />
          )}
        </main>
      </div>

      {/* Modals */}
      {activeTaskModal && (
        <TaskDetailModal
          task={activeTaskModal}
          comments={comments}
          currentUser={currentUser}
          onClose={() => setActiveTaskModal(null)}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          onAddComment={addComment}
          onLockTask={lockTask}
        />
      )}

      {isCreateTaskOpen && (
        <CreateTaskModal
          initialStatus={createTaskInitialStatus}
          currentUser={currentUser}
          onClose={() => setIsCreateTaskOpen(false)}
          onCreateTask={createTask}
        />
      )}

      {isAiModalOpen && (
        <AIModal
          projectId={currentProjectId}
          onClose={() => setIsAiModalOpen(false)}
        />
      )}

      {isUserSwitcherOpen && (
        <UserSwitcherModal
          currentUser={currentUser}
          onSelectUser={switchUserIdentity}
          onClose={() => setIsUserSwitcherOpen(false)}
        />
      )}

      {isCreateProjectOpen && (
        <CreateProjectModal
          onClose={() => setIsCreateProjectOpen(false)}
          onCreateProject={createProject}
        />
      )}
    </div>
  );
}
