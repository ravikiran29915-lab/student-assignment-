import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Upload,
  Calendar,
  Award,
  ChevronRight,
  TrendingUp,
  FileText,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    assignments,
    submissions,
    notifications,
    setActivePage,
    setSelectedAssignmentId,
    getDaysRemaining,
    isDeadlinePassed,
  } = useApp();

  if (!currentUser) return null;

  const publishedAssignments = assignments.filter((a) => a.status === 'published');
  const mySubmissions = submissions.filter((s) => s.studentId === currentUser.id);

  // Stats calculation
  const totalAssignments = publishedAssignments.length;
  const submittedIds = new Set(mySubmissions.map((s) => s.assignmentId));
  const totalSubmitted = mySubmissions.length;

  const pendingAssignments = publishedAssignments.filter(
    (a) => !submittedIds.has(a.id) && !isDeadlinePassed(a.dueDate)
  );

  const overdueAssignments = publishedAssignments.filter(
    (a) => !submittedIds.has(a.id) && isDeadlinePassed(a.dueDate)
  );

  const evaluatedSubmissions = mySubmissions.filter((s) => s.status === 'evaluated' || s.status === 'late');
  const avgScore =
    evaluatedSubmissions.length > 0
      ? Math.round(
          (evaluatedSubmissions.reduce((acc, s) => acc + (s.marksObtained || 0), 0) /
            evaluatedSubmissions.reduce((acc, s) => {
              const asg = assignments.find((a) => a.id === s.assignmentId);
              return acc + (asg?.maxMarks || 25);
            }, 0)) *
            100
        )
      : 88;

  const completionRate =
    totalAssignments > 0 ? Math.round((totalSubmitted / totalAssignments) * 100) : 0;

  // Upcoming deadlines (next 3 sorted by closest deadline)
  const upcomingList = [...publishedAssignments]
    .filter((a) => !isDeadlinePassed(a.dueDate))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  // Recent announcements / notifications for students
  const recentAnnouncements = notifications
    .filter((n) => !n.targetRole || n.targetRole === 'all' || n.targetRole === 'student')
    .slice(0, 3);

  const handleOpenAssignment = (id: string) => {
    setSelectedAssignmentId(id);
    setActivePage('assignment-details');
  };

  const handleOpenSubmit = (id: string) => {
    setSelectedAssignmentId(id);
    setActivePage('assignment-submit');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 border border-slate-800 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {currentUser.course || 'MCA Program'}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-400 font-mono">{currentUser.registerNumber}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              You have <strong className="text-amber-400">{pendingAssignments.length} pending assignments</strong> requiring your attention this week. Review instructions and keep submissions on track.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActivePage('assignments')}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>View Assignments</span>
            </button>
            <button
              onClick={() => setActivePage('my-submissions')}
              className="px-4 py-2.5 bg-slate-800/90 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-emerald-400" />
              <span>My Grades</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Total Assignments</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">{totalAssignments}</div>
          <div className="text-[11px] text-slate-500 mt-1">Active semester modules</div>
        </div>

        {/* Pending */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-amber-200/90 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-700">Pending</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 tabular-nums">
            {pendingAssignments.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Awaiting your submission</div>
        </div>

        {/* Submitted */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-blue-200/90 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-blue-700">Submitted</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 tabular-nums">{totalSubmitted}</div>
          <div className="text-[11px] text-slate-500 mt-1">{evaluatedSubmissions.length} evaluated & graded</div>
        </div>

        {/* Overdue */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-red-200/90 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-red-700">Overdue</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-600 tabular-nums">
            {overdueAssignments.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {overdueAssignments.length > 0 ? 'Requires late submission' : 'All deadlines on track'}
          </div>
        </div>
      </div>

      {/* Main Grid: Progress & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Upcoming Deadlines & Recent Assignments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Upcoming Deadlines</h2>
                <p className="text-xs text-slate-500">Track countdowns and prepare your deliverables</p>
              </div>
              <button
                onClick={() => setActivePage('deadlines')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
              >
                <span>View Timeline</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {upcomingList.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No upcoming deadlines right now. All caught up!
                </div>
              ) : (
                upcomingList.map((asg) => {
                  const rem = getDaysRemaining(asg.dueDate);
                  const isSubmitted = submittedIds.has(asg.id);

                  return (
                    <div
                      key={asg.id}
                      className="p-3.5 sm:p-4 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            {asg.subjectCode}
                          </span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-xs text-slate-600 font-medium">{asg.subject}</span>
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {asg.title}
                        </h3>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            Due: {new Date(asg.dueDate).toLocaleDateString()} at{' '}
                            {new Date(asg.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span>·</span>
                          <span>Max Marks: {asg.maxMarks}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isSubmitted ? (
                          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Submitted
                          </span>
                        ) : (
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1 tabular-nums ${
                              rem.urgent
                                ? 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            {rem.text}
                          </span>
                        )}

                        <button
                          onClick={() => handleOpenAssignment(asg.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-white bg-slate-100 hover:bg-slate-800 transition-colors"
                        >
                          Details
                        </button>
                        {!isSubmitted && (
                          <button
                            onClick={() => handleOpenSubmit(asg.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                          >
                            Submit
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Submissions Feed */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Recent Submissions</h2>
                <p className="text-xs text-slate-500">Your uploaded files and faculty evaluations</p>
              </div>
              <button
                onClick={() => setActivePage('my-submissions')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
              >
                <span>View All Submissions</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {mySubmissions.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  You haven't submitted any assignments yet.
                </div>
              ) : (
                mySubmissions.map((sub) => {
                  const asg = assignments.find((a) => a.id === sub.assignmentId);
                  const isEvaluated = sub.status === 'evaluated' || (sub.status === 'late' && sub.marksObtained !== undefined);

                  return (
                    <div key={sub.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {asg?.subjectCode || 'MCA'}
                          </span>
                          <span className="text-xs font-semibold text-slate-900">{asg?.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[200px] sm:max-w-xs">{sub.fileName}</span>
                          <span>·</span>
                          <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                        </div>
                        {sub.teacherFeedback && (
                          <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200/60 p-2 rounded-lg mt-1.5 italic">
                            "{sub.teacherFeedback}"
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        {isEvaluated ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Evaluated
                            </span>
                            <div className="text-xs font-bold text-slate-900 tabular-nums">
                              Marks: <span className="text-emerald-600 text-sm">{sub.marksObtained}</span> / {asg?.maxMarks || 25}
                            </div>
                          </div>
                        ) : sub.status === 'late' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Late Submission
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            Pending Review
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Progress Chart, Notifications & Quick Tips */}
        <div className="space-y-6">
          {/* Progress Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-1">Semester Progress</h2>
            <p className="text-xs text-slate-500 mb-4">Completion statistics & score average</p>

            {/* Circular Progress & KPI */}
            <div className="flex items-center justify-center p-4 bg-slate-50 rounded-xl mb-4">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Track */}
                  <path
                    className="text-slate-200"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Fill */}
                  <path
                    className="text-indigo-600 transition-all duration-1000 ease-out"
                    strokeDasharray={`${completionRate}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-slate-900 tabular-nums">{completionRate}%</span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Submitted</span>
                </div>
              </div>
            </div>

            {/* Mini Stat rows */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Average Performance</span>
                <span className="font-bold text-slate-900 tabular-nums">{avgScore}% Grade A</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Assignments Completed</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {totalSubmitted} of {totalAssignments}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Current Semester</span>
                <span className="font-bold text-slate-900">MCA Sem III</span>
              </div>
            </div>
          </div>

          {/* Department Announcements */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">Announcements</h2>
              <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">Live</span>
            </div>

            <div className="space-y-3">
              {recentAnnouncements.map((notif) => (
                <div key={notif.id} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                  <div className="font-semibold text-slate-900 flex items-center justify-between">
                    <span>{notif.title}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {new Date(notif.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] line-clamp-2">
                    {notif.message}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActivePage('notifications')}
              className="w-full mt-3 py-2 text-xs font-semibold text-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
            >
              Go to Notification Center
            </button>
          </div>

          {/* Submission Guidelines Note */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 text-xs text-indigo-950 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Submission Guidelines</span>
            </div>
            <p className="text-[11px] text-indigo-800 leading-relaxed">
              Always name your submission files with your roll number and subject code (e.g. <code className="bg-white/80 px-1 py-0.5 rounded text-indigo-900">MCA2024-042_MCA301.pdf</code>). Late submissions are capped at 80% maximum rubric weight.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
