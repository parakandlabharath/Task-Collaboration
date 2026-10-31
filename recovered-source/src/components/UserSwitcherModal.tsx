import React from 'react';
import { User } from '../types';
import { PRESET_USERS } from '../lib/constants';
import { X, UserCheck, ShieldCheck } from 'lucide-react';

interface UserSwitcherModalProps {
  currentUser: User;
  onSelectUser: (user: User) => void;
  onClose: () => void;
}

export const UserSwitcherModal: React.FC<UserSwitcherModalProps> = ({
  currentUser,
  onSelectUser,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Switch Live User Session
            </h2>
            <p className="text-xs text-slate-400">
              Test multi-user real-time sync by switching identities
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {PRESET_USERS.map((user) => {
            const isActive = user.id === currentUser.id;
            return (
              <button
                key={user.id}
                onClick={() => {
                  onSelectUser(user);
                  onClose();
                }}
                className={`flex w-full items-center justify-between rounded-xl border p-3 transition ${
                  isActive
                    ? 'border-blue-500 bg-blue-50/60 text-blue-900 dark:bg-blue-950/40 dark:text-blue-100'
                    : 'border-slate-200/80 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/80 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                    <span
                      className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white"
                      style={{ backgroundColor: user.color }}
                    />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{user.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{user.role}</div>
                  </div>
                </div>

                {isActive && (
                  <span className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                    <UserCheck className="h-4 w-4" /> Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
