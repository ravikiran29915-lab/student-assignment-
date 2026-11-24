import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Submission, Assignment } from '../../types';
import {
  FileCheck2,
  Award,
  Download,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  X,
  FileText,
  User,
  MessageSquare,
} from 'lucide-react';

interface EvaluateModalProps {
  submission: Submission;
  assignment: Assignment;
  onClose: () => void;
}

export const EvaluateModal: React.FC<EvaluateModalProps> = ({ submission, assignment, onClose }) => {
  const { evaluateSubmission, addToast } = useApp();

  const [marks, setMarks] = useState<number>(submission.marksObtained ?? assignment.maxMarks - 2);
  const [feedback, setFeedback] = useState<string>(
    submission.teacherFeedback ??
      'Thorough implementation with clean code structure and well-documented performance analysis. Good job.'
  );
  const [errorMsg, setErrorMsg] = useState('');

  const handleDownload = () => {
    addToast(`Downloading student submission file "${submission.fileName}" for grading...`, 'info');
  };

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (marks === undefined || isNaN(marks) || marks < 0) {
      setErrorMsg('Please enter a valid numeric score (greater than or equal to 0).');
      return;
    }

    if (marks > assignment.maxMarks) {
      setErrorMsg(`Marks obtained cannot exceed maximum marks (${assignment.maxMarks}).`);
      return;
    }

    if (!feedback.trim()) {
      setErrorMsg('Please provide qualitative feedback remarks for the student.');
      return;
    }

    evaluateSubmission(submission.id, marks, feedback.trim(), 'evaluated');
    onClose();
  };

  const handleReturnCorrection = () => {
    if (!feedback.trim()) {
      setErrorMsg('Please state the correction requirements in the feedback box before returning.');
      return;
    }
    evaluateSubmission(submission.id, 0, feedback.trim(), 'returned');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Evaluate Student Submission</h3>
              <p className="text-xs text-slate-500">Grading rubric & qualitative feedback</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student & Assignment Meta */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-slate-400 block text-[11px]">Student Name</span>
              <span className="font-bold text-slate-900 text-sm">{submission.studentName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Register Number</span>
              <span className="font-mono font-bold text-indigo-600">{submission.studentRegNo}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/80 grid grid-cols-2 gap-2">
            <div>
              <span className="text-slate-400 block text-[11px]">Assignment</span>
              <span className="font-semibold text-slate-800">{assignment.title}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Submission Time</span>
              <span className="text-slate-700">{new Date(submission.submittedAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Submitted File strip */}
          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <FileText className="w-4 h-4 text-purple-600 shrink-0" />
              <span className="font-bold text-slate-800 truncate">{submission.fileName}</span>
              <span className="text-slate-400 font-mono">({submission.fileSize})</span>
            </div>
            <button
              onClick={handleDownload}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-[11px] flex items-center gap-1 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>

          {submission.comments && (
            <div className="pt-2 border-t border-slate-200/80">
              <span className="text-slate-400 block text-[11px]">Student Remark:</span>
              <p className="text-slate-700 italic">"{submission.comments}"</p>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Evaluation Form */}
        <form onSubmit={handleSaveEvaluation} className="space-y-4">
          {/* Marks input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Marks Obtained
              </label>
              <span className="text-xs text-slate-500 font-semibold">
                Maximum Allowed: <strong className="text-indigo-600 tabular-nums">{assignment.maxMarks}</strong>
              </span>
            </div>

            <div className="relative">
              <input
                type="number"
                min="0"
                max={assignment.maxMarks}
                value={marks}
                onChange={(e) => setMarks(Number(e.target.value))}
                className="w-full pl-4 pr-16 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-extrabold text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white tabular-nums"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                / {assignment.maxMarks}
              </span>
            </div>
          </div>

          {/* Feedback textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Teacher Feedback & Rubric Remarks
            </label>
            <textarea
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide constructive feedback, analysis of code efficiency, report formatting, or areas for improvement..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white"
              required
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReturnCorrection}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Return for Correction</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Evaluate & Publish Marks</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
