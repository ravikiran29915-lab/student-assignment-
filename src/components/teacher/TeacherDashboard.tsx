import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FolderKanban,
  Users,
  ClipboardCheck,
  Clock,
  PlusCircle,
  FileCheck2,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  FileText,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { EvaluateModal } from './EvaluateModal';
import { Submission } from '../../types';

export const TeacherDashboard: React.FC = () => {
  const {
    currentUser,
    assignments,
    submissions,
    students,
    setActivePage,
    setSelectedAssignmentId,
  } = useApp();

  const [evaluatingSub, setEvaluatingSub] = useState<Submission | null>(null);

  if (!currentUser) return null;

  const totalAssignments = assignments.length;
  const totalStudents = students.length;
  const totalSubmissions = submissions.length;

  const pendingEvaluations = submissions.filter(
    (s) => s.status === 'pending_evaluation' || s.status === 'submitted'
  );

  const evaluatedCount = submissions.filter(
    (s) => s.status === 'evaluated' || (s.status === 'late' && s.marksObtained !== undefined)
  ).length;

  const evaluationRate =
    totalSubmissions > 0 ? Math.round((evaluatedCount / totalSubmissions) * 100) : 0;

  // Active assignments
  const activeAssignments = assignments.slice(0, 4);

  // Submissions needing review (first 4)
  const queueSubmissions = pendingEvaluations.slice(0, 4);

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 border border-slate-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Faculty Portal
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-300 font-medium">{currentUser.department}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              You have <strong className="text-amber-400 font-bold">{pendingEvaluations.length} student submissions</strong> awaiting grading and evaluation. Keep curriculum progress monitored.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActivePage('create-assignment')}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Assignment</span>
            </button>
            <button
              onClick={() => setActivePage('student-submissions')}
              className="px-4 py-2.5 bg-slate-800/90 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            >
              <ClipboardCheck className="w-4 h-4 text-purple-400" />
              <span>Evaluate Queue</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Assignments */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Assignments Created</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">{totalAssignments}</div>
          <div className="text-[11px] text-slate-500 mt-1">Across active MCA courses</div>
        </div>

        {/* Enrolled Students */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Enrolled Students</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">{totalStudents}</div>
          <div className="text-[11px] text-slate-500 mt-1">Batch of 2024–2026</div>
        </div>

        {/* Total Submissions */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Total Submissions</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">{totalSubmissions}</div>
          <div className="text-[11px] text-slate-500 mt-1">Uploaded deliverables</div>
        </div>

        {/* Pending Evaluations */}
        <div className="p-5 rounded-2xl bg-white border border-amber-200/90 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-700">Pending Evaluation</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 tabular-nums">
            {pendingEvaluations.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Requires score & feedback</div>
        </div>
      </div>

      {/* Main Grid: Queue & Overview Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Evaluation Queue & Managed Assignments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Submissions Pending Evaluation */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Submissions Awaiting Evaluation ({pendingEvaluations.length})
                </h2>
                <p className="text-xs text-slate-500">Grade deliverables and publish student scores</p>
              </div>
              <button
                onClick={() => setActivePage('student-submissions')}
                className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 transition-colors"
              >
                <span>View Full Queue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {queueSubmissions.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  All submitted student assignments are evaluated! No pending submissions.
                </div>
              ) : (
                queueSubmissions.map((sub) => {
                  const asg = assignments.find((a) => a.id === sub.assignmentId);

                  return (
                    <div
                      key={sub.id}
                      className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">{sub.studentName}</span>
                          <span className="text-[11px] font-mono font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                            {sub.studentRegNo}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 font-medium">
                          {asg?.title} <span className="text-slate-400">({asg?.subjectCode})</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[220px]">{sub.fileName}</span>
                          <span>·</span>
                          <span>{new Date(sub.submittedAt).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {sub.status === 'late' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Late
                          </span>
                        )}
                        <button
                          onClick={() => setEvaluatingSub(sub)}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Evaluate Now</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Active Course Assignments */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Active Course Assignments</h2>
                <p className="text-xs text-slate-500">Modules published for current semester classes</p>
              </div>
              <button
                onClick={() => setActivePage('manage-assignments')}
                className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 transition-colors"
              >
                <span>Manage All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeAssignments.map((asg) => {
                const asgSubmissions = submissions.filter((s) => s.assignmentId === asg.id);
                const subRate =
                  totalStudents > 0 ? Math.round((asgSubmissions.length / totalStudents) * 100) : 0;

                return (
                  <div
                    key={asg.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-slate-50/50 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {asg.code}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          asg.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {asg.status.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                      {asg.title}
                    </h3>

                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span>Due: {new Date(asg.dueDate).toLocaleDateString()}</span>
                      <span className="font-semibold text-slate-700">{asg.maxMarks} Marks</span>
                    </div>

                    {/* Mini progress bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                        <span>Turn-in Progress</span>
                        <span className="font-bold text-slate-800 tabular-nums">
                          {asgSubmissions.length} / {totalStudents} Students ({subRate}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-purple-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${subRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Evaluation Metrics Chart & Quick Actions */}
        <div className="space-y-6">
          {/* Progress Chart Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-1">Evaluation Completion</h2>
            <p className="text-xs text-slate-500 mb-4">Grading turnaround across department</p>

            {/* Circular Chart */}
            <div className="flex items-center justify-center p-4 bg-slate-50 rounded-xl mb-4">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-purple-600 transition-all duration-1000 ease-out"
                    strokeDasharray={`${evaluationRate}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-slate-900 tabular-nums">{evaluationRate}%</span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Graded</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Graded Submissions</span>
                <span className="font-bold text-slate-900 tabular-nums">{evaluatedCount}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Pending Evaluation</span>
                <span className="font-bold text-amber-600 tabular-nums">{pendingEvaluations.length}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Total Enrolled Batch</span>
                <span className="font-bold text-slate-900 tabular-nums">{totalStudents} MCA Students</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Faculty Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => setActivePage('create-assignment')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-purple-50 text-purple-900 hover:bg-purple-100 transition-colors text-xs font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <PlusCircle className="w-4 h-4 text-purple-600" />
                  <span>Create New Assignment</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActivePage('manage-assignments')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 text-slate-800 hover:bg-slate-100 transition-colors text-xs font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <FolderKanban className="w-4 h-4 text-slate-600" />
                  <span>Manage Deadlines & Files</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActivePage('student-management')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 text-slate-800 hover:bg-slate-100 transition-colors text-xs font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-slate-600" />
                  <span>View Student Roster</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Academic Term Notice */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 text-xs text-purple-950 space-y-1.5">
            <div className="font-bold text-purple-900">MCA Evaluation Guidelines</div>
            <p className="text-[11px] text-purple-800 leading-relaxed">
              Standard grading rubrics require feedback on architectural design, code formatting, and test coverage before publishing marks to the university controller of examinations.
            </p>
          </div>
        </div>
      </div>

      {/* Evaluation Modal if clicked */}
      {evaluatingSub && (
        <EvaluateModal
          submission={evaluatingSub}
          assignment={
            assignments.find((a) => a.id === evaluatingSub.assignmentId) || assignments[0]
          }
          onClose={() => setEvaluatingSub(null)}
        />
      )}
    </div>
  );
};
