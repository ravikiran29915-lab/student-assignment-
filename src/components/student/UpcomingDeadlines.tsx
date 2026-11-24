import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarClock,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Upload,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const UpcomingDeadlines: React.FC = () => {
  const {
    assignments,
    submissions,
    currentUser,
    setActivePage,
    setSelectedAssignmentId,
    getDaysRemaining,
    isDeadlinePassed,
  } = useApp();

  const [filterPendingOnly, setFilterPendingOnly] = useState(false);

  if (!currentUser) return null;

  const mySubmissions = submissions.filter((s) => s.studentId === currentUser.id);
  const submittedIds = new Set(mySubmissions.map((s) => s.assignmentId));

  // Sort by nearest deadline
  const sortedAssignments = [...assignments]
    .filter((a) => a.status === 'published')
    .filter((a) => (filterPendingOnly ? !submittedIds.has(a.id) : true))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Group by timeframe
  const urgentItems = sortedAssignments.filter((a) => {
    const diffHours = (new Date(a.dueDate).getTime() - Date.now()) / (1000 * 60 * 60);
    return diffHours >= 0 && diffHours <= 72;
  });

  const nextWeekItems = sortedAssignments.filter((a) => {
    const diffHours = (new Date(a.dueDate).getTime() - Date.now()) / (1000 * 60 * 60);
    return diffHours > 72 && diffHours <= 168;
  });

  const laterItems = sortedAssignments.filter((a) => {
    const diffHours = (new Date(a.dueDate).getTime() - Date.now()) / (1000 * 60 * 60);
    return diffHours > 168;
  });

  const pastItems = sortedAssignments.filter((a) => isDeadlinePassed(a.dueDate));

  const handleOpenAssignment = (id: string) => {
    setSelectedAssignmentId(id);
    setActivePage('assignment-details');
  };

  const handleOpenSubmit = (id: string) => {
    setSelectedAssignmentId(id);
    setActivePage('assignment-submit');
  };

  const renderAssignmentCard = (asg: any) => {
    const rem = getDaysRemaining(asg.dueDate);
    const isSubmitted = submittedIds.has(asg.id);
    const sub = mySubmissions.find((s) => s.assignmentId === asg.id);

    return (
      <div
        key={asg.id}
        className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isSubmitted
            ? 'bg-white border-slate-200/80'
            : rem.isPast
            ? 'bg-red-50/40 border-red-200'
            : rem.urgent
            ? 'bg-amber-50/40 border-amber-300 shadow-sm'
            : 'bg-white border-slate-200/80 shadow-sm'
        }`}
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              {asg.code}
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-600 font-semibold">{asg.subject}</span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-slate-900">{asg.title}</h3>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Due: {new Date(asg.dueDate).toLocaleDateString()} at{' '}
              {new Date(asg.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span>·</span>
            <span>Max: {asg.maxMarks} Marks</span>
            <span>·</span>
            <span className="text-slate-600">Faculty: {asg.teacherName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isSubmitted ? (
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Submitted</span>
            </span>
          ) : (
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 tabular-nums ${
                rem.isPast
                  ? 'bg-red-100 text-red-800 border-red-200'
                  : rem.urgent
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{rem.text}</span>
            </span>
          )}

          <button
            onClick={() => handleOpenAssignment(asg.id)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            Details
          </button>

          {!isSubmitted && (
            <button
              onClick={() => handleOpenSubmit(asg.id)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-1"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Submit</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Upcoming Deadlines Timeline</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Chronological calendar of course deliverables and submission cutoffs
          </p>
        </div>

        {/* Toggle pending only */}
        <button
          onClick={() => setFilterPendingOnly(!filterPendingOnly)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors self-start sm:self-auto ${
            filterPendingOnly
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {filterPendingOnly ? 'Showing: Pending Only' : 'Show All Deliverables'}
        </button>
      </div>

      {/* Urgent Section: Next 72 Hours */}
      {urgentItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-red-700">
              Urgent Priority — Due within 72 Hours ({urgentItems.length})
            </h2>
          </div>
          <div className="space-y-3">{urgentItems.map(renderAssignmentCard)}</div>
        </div>
      )}

      {/* Next Week */}
      {nextWeekItems.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-800">
              Due Next Week ({nextWeekItems.length})
            </h2>
          </div>
          <div className="space-y-3">{nextWeekItems.map(renderAssignmentCard)}</div>
        </div>
      )}

      {/* Later */}
      {laterItems.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Upcoming Later This Semester ({laterItems.length})
            </h2>
          </div>
          <div className="space-y-3">{laterItems.map(renderAssignmentCard)}</div>
        </div>
      )}

      {/* Past Deadlines */}
      {pastItems.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Past Due Date Milestones ({pastItems.length})
            </h2>
          </div>
          <div className="space-y-3">{pastItems.map(renderAssignmentCard)}</div>
        </div>
      )}
    </div>
  );
};
