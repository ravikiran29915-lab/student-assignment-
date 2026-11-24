import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ClipboardCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Award,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { EvaluateModal } from './EvaluateModal';
import { Submission } from '../../types';

export const SubmissionsList: React.FC = () => {
  const {
    submissions,
    assignments,
    selectedAssignmentId,
    setSelectedAssignmentId,
    addToast,
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'EVALUATED' | 'LATE'>('ALL');
  const [filterAssignment, setFilterAssignment] = useState<string>(selectedAssignmentId || 'ALL');
  const [evaluatingSub, setEvaluatingSub] = useState<Submission | null>(null);

  // Filtered submissions
  const filtered = useMemo(() => {
    return submissions
      .filter((s) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          s.studentName.toLowerCase().includes(q) ||
          s.studentRegNo.toLowerCase().includes(q) ||
          s.fileName.toLowerCase().includes(q)
        );
      })
      .filter((s) => {
        if (filterAssignment === 'ALL') return true;
        return s.assignmentId === filterAssignment;
      })
      .filter((s) => {
        if (filterStatus === 'ALL') return true;
        if (filterStatus === 'PENDING') return s.status === 'pending_evaluation' || s.status === 'submitted';
        if (filterStatus === 'EVALUATED') return s.status === 'evaluated';
        if (filterStatus === 'LATE') return s.status === 'late';
        return true;
      });
  }, [submissions, search, filterAssignment, filterStatus]);

  const handleDownload = (filename: string) => {
    addToast(`Downloading verified submission archive: ${filename}`, 'info');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Submissions & Evaluation</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review uploaded files, grade rubrics, publish official marks, and provide qualitative feedback
          </p>
        </div>

        <div className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 self-start sm:self-auto tabular-nums">
          Total Deliverables: {submissions.length}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, roll number, or file..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-purple-600 focus:bg-white"
            />
          </div>

          {/* Assignment dropdown */}
          <div className="md:col-span-4">
            <select
              value={filterAssignment}
              onChange={(e) => {
                setFilterAssignment(e.target.value);
                setSelectedAssignmentId(e.target.value === 'ALL' ? null : e.target.value);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-purple-600"
            >
              <option value="ALL">All Course Assignments</option>
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.code}: {a.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status dropdown */}
          <div className="md:col-span-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-purple-600"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending Evaluation</option>
              <option value="EVALUATED">Evaluated</option>
              <option value="LATE">Late Submission</option>
            </select>
          </div>
        </div>

        {/* Quick status tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium">Quick Filter:</span>
          {(['ALL', 'PENDING', 'EVALUATED', 'LATE'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                filterStatus === st
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL'
                ? 'All Submissions'
                : st === 'PENDING'
                ? 'Pending Review'
                : st === 'EVALUATED'
                ? 'Evaluated'
                : 'Late'}
            </button>
          ))}
          <span className="ml-auto text-slate-500 text-[11px]">
            Showing <strong className="text-slate-800 tabular-nums">{filtered.length}</strong> items
          </span>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3.5">Student Details</th>
                <th className="px-4 py-3.5">Assignment</th>
                <th className="px-4 py-3.5">Submitted File</th>
                <th className="px-4 py-3.5">Turn-in Date</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Score Awarded</th>
                <th className="px-4 py-3.5 text-right">Grading Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No submissions found matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => {
                  const asg = assignments.find((a) => a.id === sub.assignmentId);
                  const isEvaluated =
                    sub.status === 'evaluated' || (sub.status === 'late' && sub.marksObtained !== undefined);

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Student */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900">{sub.studentName}</div>
                        <div className="text-[11px] font-mono font-semibold text-purple-700">
                          {sub.studentRegNo}
                        </div>
                      </td>

                      {/* Assignment */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-800 max-w-[200px] truncate">
                          {asg?.title || 'Assignment'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{asg?.code}</div>
                      </td>

                      {/* File */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 max-w-[180px]">
                          <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-medium text-slate-700 truncate">{sub.fileName}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{sub.fileSize}</div>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3.5">
                        <div className="text-slate-800 font-medium">
                          {new Date(sub.submittedAt).toLocaleDateString()}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        {isEvaluated && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Evaluated
                          </span>
                        )}
                        {!isEvaluated && sub.status === 'late' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertTriangle className="w-3 h-3" />
                            Late (Pending)
                          </span>
                        )}
                        {!isEvaluated && sub.status !== 'late' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <Clock className="w-3 h-3" />
                            Pending Review
                          </span>
                        )}
                      </td>

                      {/* Score */}
                      <td className="px-4 py-3.5">
                        {isEvaluated ? (
                          <div className="font-extrabold text-slate-900 text-xs tabular-nums">
                            <span className="text-emerald-600 text-sm">{sub.marksObtained}</span> /{' '}
                            {asg?.maxMarks || 25}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Not Graded</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDownload(sub.fileName)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Download file"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEvaluatingSub(sub)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                              isEvaluated
                                ? 'bg-slate-100 hover:bg-purple-50 text-purple-700 hover:border-purple-200 border border-transparent'
                                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm'
                            }`}
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>{isEvaluated ? 'Re-evaluate' : 'Evaluate'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Evaluate Modal */}
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
