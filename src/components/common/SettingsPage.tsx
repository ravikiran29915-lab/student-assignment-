import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Bell,
  Shield,
  RotateCcw,
  Download,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Info,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { resetDemoData, assignments, submissions, students, currentUser, addToast } = useApp();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [deadlineReminders, setDeadlineReminders] = useState(true);
  const [evaluationReceipts, setEvaluationReceipts] = useState(true);
  const [autoSaveDrafts, setAutoSaveDrafts] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleExportData = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      user: currentUser,
      assignmentsCount: assignments.length,
      submissionsCount: submissions.length,
      studentsCount: students.length,
      assignments,
      submissions,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Student_Assignment_Manager_Export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Academic state exported successfully as JSON file!', 'success');
  };

  const handleReset = () => {
    resetDemoData();
    setShowResetConfirm(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Preferences</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure notification dispatch, assignment alert triggers, and demonstration data controls
        </p>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Notification Alerts & Dispatches</h2>
            <p className="text-xs text-slate-500">Customize how and when you receive critical academic alerts</p>
          </div>
        </div>

        <div className="space-y-4 divide-y divide-slate-100 text-xs">
          <div className="flex items-center justify-between pt-3 first:pt-0">
            <div>
              <span className="font-bold text-slate-800 block text-sm">Institutional Email Notifications</span>
              <p className="text-slate-500 mt-0.5">
                Receive email alerts whenever new assignments or evaluations are published.
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => {
                setEmailAlerts(e.target.checked);
                addToast(`Email alerts ${e.target.checked ? 'enabled' : 'disabled'}.`, 'info');
              }}
              className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="font-bold text-slate-800 block text-sm">Deadline Urgency Warnings (24 Hours Prior)</span>
              <p className="text-slate-500 mt-0.5">
                Send a notification alert 24 hours before any assignment cutoff date.
              </p>
            </div>
            <input
              type="checkbox"
              checked={deadlineReminders}
              onChange={(e) => {
                setDeadlineReminders(e.target.checked);
                addToast(`Deadline reminders ${e.target.checked ? 'enabled' : 'disabled'}.`, 'info');
              }}
              className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="font-bold text-slate-800 block text-sm">Instant Turn-in & Evaluation Receipts</span>
              <p className="text-slate-500 mt-0.5">
                Generate signed submission receipts and notify immediately upon faculty grading.
              </p>
            </div>
            <input
              type="checkbox"
              checked={evaluationReceipts}
              onChange={(e) => {
                setEvaluationReceipts(e.target.checked);
                addToast(`Turn-in receipts ${e.target.checked ? 'enabled' : 'disabled'}.`, 'info');
              }}
              className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* College Mini Project Presentation Controls */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">MCA Project Demonstration Controls</h2>
            <p className="text-xs text-slate-500">Tools for viva presentation, testing, and state backup</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-xs font-bold text-slate-900">Export Academic State Backup</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Download current database records, assignments, grades, and student submissions as a formatted JSON document.
            </p>
            <button
              onClick={handleExportData}
              className="mt-2 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Export JSON Backup</span>
            </button>
          </div>

          {/* Reset */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
            <h3 className="text-xs font-bold text-amber-900">Reset Demo State</h3>
            <p className="text-xs text-amber-800/80 leading-relaxed">
              Restore default assignments, sample submissions, and student roster for a clean evaluation presentation.
            </p>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="mt-2 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Initial Dataset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Reset Demo Database?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                This will clear any newly submitted files or created assignments, returning the application to the original MCA sample cohort.
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm"
              >
                Yes, Reset Dataset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
