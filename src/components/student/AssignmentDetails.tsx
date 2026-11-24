import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  BookOpen,
  Award,
  FileText,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  CheckCircle,
  HelpCircle,
  Share2,
} from 'lucide-react';

export const AssignmentDetails: React.FC = () => {
  const {
    selectedAssignmentId,
    assignments,
    submissions,
    currentUser,
    setActivePage,
    setSelectedAssignmentId,
    getDaysRemaining,
    isDeadlinePassed,
    addToast,
  } = useApp();

  const assignment = assignments.find((a) => a.id === selectedAssignmentId) || assignments[0];

  if (!currentUser || !assignment) return null;

  const isTeacher = currentUser.role === 'teacher';
  const mySubmission = submissions.find(
    (s) => s.assignmentId === assignment.id && s.studentId === currentUser.id
  );
  const rem = getDaysRemaining(assignment.dueDate);
  const isPast = isDeadlinePassed(assignment.dueDate);

  const handleDownloadResource = (resourceName: string) => {
    addToast(`Downloading ${resourceName} to local system...`, 'info');
  };

  const handleGoSubmit = () => {
    setSelectedAssignmentId(assignment.id);
    setActivePage('assignment-submit');
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => setActivePage(isTeacher ? 'manage-assignments' : 'assignments')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {isTeacher ? 'Manage Assignments' : 'All Assignments'}</span>
        </button>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {!isTeacher && !mySubmission && (
            <button
              onClick={handleGoSubmit}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>Submit Assignment</span>
            </button>
          )}

          {!isTeacher && mySubmission && (
            <button
              onClick={() => setActivePage('my-submissions')}
              className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>View Submitted Work</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Assignment Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header Tags & Code */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-lg">
              {assignment.code}
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-semibold text-slate-700">{assignment.subject}</span>
          </div>

          {/* Deadline Countdown Pill */}
          <div
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border tabular-nums ${
              mySubmission
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : isPast
                ? 'bg-red-50 text-red-700 border-red-200'
                : rem.urgent
                ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>
              {mySubmission
                ? 'Assignment Submitted'
                : isPast
                ? `Deadline Passed (${rem.text})`
                : `Deadline: ${rem.text}`}
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {assignment.title}
        </h1>

        {/* Meta Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">Faculty In-charge</span>
            <span className="font-bold text-slate-800">{assignment.teacherName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">Assigned Date</span>
            <span className="font-bold text-slate-800">{new Date(assignment.assignedDate).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">Final Submission Due</span>
            <span className="font-bold text-slate-800">
              {new Date(assignment.dueDate).toLocaleDateString()} at{' '}
              {new Date(assignment.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">Evaluation Rubric</span>
            <span className="font-extrabold text-indigo-600 text-sm tabular-nums">
              {assignment.maxMarks} Maximum Marks
            </span>
          </div>
        </div>

        {/* Existing Submission Status Callout if present */}
        {mySubmission && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-900 flex items-center gap-1.5 text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                You have already submitted this assignment
              </span>
              <span className="text-slate-500 text-[11px]">
                Submitted on {new Date(mySubmission.submittedAt).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-4 text-blue-800">
              <span>File: <strong>{mySubmission.fileName}</strong> ({mySubmission.fileSize})</span>
              {mySubmission.marksObtained !== undefined && (
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  Score: {mySubmission.marksObtained} / {assignment.maxMarks}
                </span>
              )}
            </div>
            {mySubmission.teacherFeedback && (
              <p className="text-slate-700 bg-white/80 p-2.5 rounded-xl border border-blue-100 italic">
                Faculty Feedback: "{mySubmission.teacherFeedback}"
              </p>
            )}
          </div>
        )}

        {/* Description */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Problem Overview</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            {assignment.description}
          </p>
        </div>

        {/* Tasks Breakdown */}
        {assignment.tasks && assignment.tasks.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Tasks & Evaluation Points</h2>
            <div className="space-y-2">
              {assignment.tasks.map((task, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200/80 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">{task}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Guidelines */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Instructions & Guidelines</h2>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
            {assignment.instructions.map((inst, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 mt-2" />
                <span className="leading-relaxed">{inst}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* File Format & Size Limits */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-slate-800 block">Accepted File Formats:</span>
            <div className="flex items-center gap-1.5 mt-1">
              {assignment.acceptedFormats.map((fmt) => (
                <span key={fmt} className="px-2 py-0.5 rounded bg-white text-slate-700 font-mono font-bold text-[11px] border border-slate-200">
                  .{fmt.toLowerCase()}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-slate-500">Maximum Upload Limit:</span>
            <span className="font-bold text-slate-800 ml-1.5 tabular-nums">{assignment.maxFileSizeMB} MB</span>
          </div>
        </div>

        {/* Reference Materials */}
        {assignment.resources && assignment.resources.length > 0 && (
          <div className="space-y-3 pt-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Reference Materials & Code Starters</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {assignment.resources.map((res) => (
                <div
                  key={res.id}
                  className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      {res.type}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{res.name}</div>
                      <div className="text-[11px] text-slate-400 tabular-nums">{res.size}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadResource(res.name)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"
                    title="Download Resource"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Submission Action CTA */}
        {!isTeacher && (
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Need assistance? Contact <strong className="text-slate-700">{assignment.teacherName}</strong> during office hours.
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setActivePage('assignments')}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors text-center"
              >
                Back to All
              </button>
              <button
                onClick={handleGoSubmit}
                className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-colors text-center flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>{mySubmission ? 'Resubmit / Update File' : 'Proceed to Submission'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
