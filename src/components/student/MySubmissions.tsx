import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Eye,
  FileText,
  Filter,
  MessageSquare,
  Award,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Submission } from '../../types';

export const MySubmissions: React.FC = () => {
  const { submissions, assignments, currentUser, setSelectedAssignmentId, setActivePage, addToast } = useApp();

  const [filterStatus, setFilterStatus] = useState<'ALL' | 'EVALUATED' | 'PENDING' | 'LATE'>('ALL');
  const [selectedSubModal, setSelectedSubModal] = useState<Submission | null>(null);

  if (!currentUser) return null;

  const mySubmissions = useMemo(() => {
    return submissions.filter((s) => s.studentId === currentUser.id);
  }, [submissions, currentUser]);

  const filteredSubmissions = useMemo(() => {
    return mySubmissions.filter((s) => {
      if (filterStatus === 'ALL') return true;
      if (filterStatus === 'EVALUATED') return s.status === 'evaluated';
      if (filterStatus === 'PENDING') return s.status === 'pending_evaluation' || s.status === 'submitted';
      if (filterStatus === 'LATE') return s.status === 'late';
      return true;
    });
  }, [mySubmissions, filterStatus]);

  const totalEvaluated = mySubmissions.filter((s) => s.status === 'evaluated').length;
  const totalPending = mySubmissions.filter((s) => s.status === 'pending_evaluation' || s.status === 'submitted').length;
  const totalLate = mySubmissions.filter((s) => s.status === 'late').length;

  const handleDownloadFile = (fileName: string) => {
    addToast(`Downloaded verified submission artifact: ${fileName}`, 'info');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Submissions</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track evaluation status, faculty grading feedback, and submission receipts
          </p>
        </div>

        {/* Quick summary counts */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 tabular-nums">
            {totalEvaluated} Evaluated
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 tabular-nums">
            {totalPending} In Review
          </span>
          {totalLate > 0 && (
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 tabular-nums">
              {totalLate} Late
            </span>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 bg-white rounded-xl border border-slate-200 w-fit shadow-sm text-xs">
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            filterStatus === 'ALL' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Submissions ({mySubmissions.length})
        </button>
        <button
          onClick={() => setFilterStatus('EVALUATED')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            filterStatus === 'EVALUATED' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-emerald-700'
          }`}
        >
          Evaluated ({totalEvaluated})
        </button>
        <button
          onClick={() => setFilterStatus('PENDING')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            filterStatus === 'PENDING' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-blue-700'
          }`}
        >
          Pending Review ({totalPending})
        </button>
        <button
          onClick={() => setFilterStatus('LATE')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            filterStatus === 'LATE' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-amber-700'
          }`}
        >
          Late Submissions ({totalLate})
        </button>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <FileCheck2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No submissions found in this category</h3>
            <p className="text-xs text-slate-400">Your submitted course assignments will appear here once uploaded.</p>
            <button
              onClick={() => setActivePage('assignments')}
              className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors inline-block"
            >
              Browse Open Assignments
            </button>
          </div>
        ) : (
          filteredSubmissions.map((sub) => {
            const asg = assignments.find((a) => a.id === sub.assignmentId);
            const isEvaluated = sub.status === 'evaluated' || (sub.status === 'late' && sub.marksObtained !== undefined);

            return (
              <div
                key={sub.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Left metadata */}
                <div className="space-y-2 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                      {asg?.code || 'MCA'}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-semibold text-slate-600">{asg?.subject}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-[11px] text-slate-500">
                      Submitted {new Date(sub.submittedAt).toLocaleDateString()} at{' '}
                      {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {asg?.title || 'Course Assignment'}
                  </h3>

                  {/* File badge */}
                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 w-fit">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    <span className="font-semibold text-slate-800">{sub.fileName}</span>
                    <span className="text-slate-400">({sub.fileSize})</span>
                  </div>

                  {/* Feedback preview if evaluated */}
                  {sub.teacherFeedback && (
                    <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Faculty Evaluation Remarks:</span>
                      </div>
                      <p className="text-slate-700 italic leading-relaxed">"{sub.teacherFeedback}"</p>
                    </div>
                  )}
                </div>

                {/* Right score & actions */}
                <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {/* Status Badge */}
                  {isEvaluated ? (
                    <div className="text-left md:text-right space-y-1">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Evaluated & Published
                      </span>
                      <div className="text-sm font-bold text-slate-900 tabular-nums">
                        Marks:{' '}
                        <span className="text-lg font-black text-emerald-600">{sub.marksObtained}</span> /{' '}
                        {asg?.maxMarks || 25}
                      </div>
                    </div>
                  ) : sub.status === 'late' ? (
                    <div className="text-left md:text-right space-y-1">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Late Submission (In Review)
                      </span>
                      <div className="text-xs text-slate-400">Awaiting faculty grading</div>
                    </div>
                  ) : (
                    <div className="text-left md:text-right space-y-1">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        <Clock className="w-3.5 h-3.5" />
                        Pending Faculty Evaluation
                      </span>
                      <div className="text-xs text-slate-400">Under departmental queue</div>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadFile(sub.fileName)}
                      className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
                      title="Download your submitted file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedSubModal(sub)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Receipt</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submission Receipt / Details Modal */}
      {selectedSubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Submission Receipt</h3>
                  <p className="text-[11px] text-slate-400 font-mono">ID: {selectedSubModal.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSubModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-bold text-slate-900">{selectedSubModal.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Register Number:</span>
                  <span className="font-mono font-bold text-indigo-600">{selectedSubModal.studentRegNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="text-slate-800">{selectedSubModal.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Timestamp:</span>
                  <span className="text-slate-800">{new Date(selectedSubModal.submittedAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Uploaded File:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[220px]">{selectedSubModal.fileName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">File Size:</span>
                  <span className="font-mono text-slate-700">{selectedSubModal.fileSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold uppercase text-slate-800">{selectedSubModal.status.replace('_', ' ')}</span>
                </div>
              </div>

              {selectedSubModal.marksObtained !== undefined && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-900">Final Grade Awarded:</span>
                    <span className="text-lg font-black text-emerald-700 tabular-nums">
                      {selectedSubModal.marksObtained} Marks
                    </span>
                  </div>
                  {selectedSubModal.teacherFeedback && (
                    <p className="text-xs text-emerald-950 pt-1 border-t border-emerald-200/60 italic">
                      "{selectedSubModal.teacherFeedback}"
                    </p>
                  )}
                </div>
              )}

              {selectedSubModal.comments && (
                <div>
                  <span className="text-slate-400 block mb-0.5 font-semibold">Your Remarks:</span>
                  <p className="p-2.5 bg-slate-100 rounded-xl text-slate-700 italic">{selectedSubModal.comments}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => handleDownloadFile(selectedSubModal.fileName)}
                className="px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Copy</span>
              </button>
              <button
                onClick={() => setSelectedSubModal(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
