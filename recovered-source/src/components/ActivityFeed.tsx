import React from 'react';
import { ActivityLog } from '../types';
import { Activity, Clock } from 'lucide-react';

interface ActivityFeedProps {
  activities: ActivityLog[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
          <Activity className="h-5 w-5 text-emerald-500" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Real-time Collaboration Activity Log
          </h2>
        </div>

        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="py-12 text-center text-xs font-medium text-slate-400">
              No recent activity logs recorded yet.
            </div>
          ) : (
            activities.map((act) => (
              <div
                key={act.id}
                className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <img
                  src={act.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={act.userName}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {act.userName}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                      <Clock className="h-3 w-3" />
                      {new Date(act.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                    {act.details}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
