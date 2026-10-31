import React, { useState, useEffect } from 'react';
import { Sparkles, X, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';

interface AIModalProps {
  projectId: string;
  onClose: () => void;
}

export const AIModal: React.FC<AIModalProps> = ({ projectId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState<{ summary?: string; recommendations?: string[] }>({});

  useEffect(() => {
    async function fetchAiSummary() {
      setLoading(true);
      try {
        const res = await fetch('/api/ai/project-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId }),
        });
        const data = await res.json();
        setSummaryData(data);
      } catch (e) {
        console.error('Failed to load AI summary', e);
      } finally {
        setLoading(false);
      }
    }
    fetchAiSummary();
  }, [projectId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl border border-indigo-100 bg-white p-6 shadow-2xl dark:border-indigo-900 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Gemini AI Project Insights
            </h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <Sparkles className="h-8 w-8 text-indigo-500 animate-spin" />
            <p className="text-xs font-semibold text-slate-500">
              Analyzing project tasks, velocity, and priority bottlenecks...
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {/* Health Summary */}
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/20">
              <span className="text-[10px] font-extrabold uppercase text-indigo-500 tracking-wide">
                Executive Health Overview
              </span>
              <p className="mt-1 text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                {summaryData.summary || 'Project is progressing well with low block risk.'}
              </p>
            </div>

            {/* Recommendations */}
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                AI Priority Recommendations
              </span>
              <ul className="space-y-2">
                {summaryData.recommendations?.map((rec, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 font-medium"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700"
              >
                Close Insights
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
