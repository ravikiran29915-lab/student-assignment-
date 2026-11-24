import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Upload,
  FileCheck2,
  File,
  AlertTriangle,
  CheckCircle2,
  X,
  ArrowLeft,
  Clock,
  History,
  FileText,
  AlertCircle,
} from 'lucide-react';

export const AssignmentSubmission: React.FC = () => {
  const {
    selectedAssignmentId,
    assignments,
    submissions,
    currentUser,
    submitAssignment,
    setActivePage,
    getDaysRemaining,
    isDeadlinePassed,
    addToast,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const assignment = assignments.find((a) => a.id === selectedAssignmentId) || assignments[0];

  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    type: string;
  } | null>(null);
  const [comments, setComments] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!currentUser || !assignment) return null;

  // Previous submissions by this student for this assignment
  const mySubmissionsForThis = submissions.filter(
    (s) => s.assignmentId === assignment.id && s.studentId === currentUser.id
  );
  const currentSub = mySubmissionsForThis[0];

  const rem = getDaysRemaining(assignment.dueDate);
  const isPast = isDeadlinePassed(assignment.dueDate);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > assignment.maxFileSizeMB) {
      setErrorMsg(`File size (${sizeInMB.toFixed(1)}MB) exceeds limit of ${assignment.maxFileSizeMB}MB.`);
      return;
    }

    // Format file size
    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    setSelectedFile({
      name: file.name,
      size: formattedSize,
      type: file.type || 'application/octet-stream',
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setErrorMsg('');

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const sizeInMB = file.size / (1024 * 1024);
      if (sizeInMB > assignment.maxFileSizeMB) {
        setErrorMsg(`File size (${sizeInMB.toFixed(1)}MB) exceeds maximum ${assignment.maxFileSizeMB}MB limit.`);
        return;
      }

      const formattedSize =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      setSelectedFile({
        name: file.name,
        size: formattedSize,
        type: file.type || 'application/octet-stream',
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedFile) {
      setErrorMsg('Please select or drag-and-drop a file before submitting.');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleFinalConfirmSubmit = () => {
    if (!selectedFile) return;

    const success = submitAssignment(assignment.id, selectedFile, comments);
    setShowConfirmModal(false);

    if (success) {
      setActivePage('my-submissions');
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => setActivePage('assignment-details')}
        className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Assignment Details</span>
      </button>

      {/* Main Submission Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded">
                {assignment.code}
              </span>
              <span className="text-xs font-semibold text-slate-600">{assignment.subject}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {assignment.title}
            </h1>
          </div>

          {/* Deadline Warning / Countdown */}
          <div
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border shrink-0 ${
              isPast
                ? 'bg-red-50 text-red-700 border-red-200'
                : rem.urgent
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Due Date</div>
              <div className="tabular-nums font-extrabold">{new Date(assignment.dueDate).toLocaleDateString()} · {rem.text}</div>
            </div>
          </div>
        </div>

        {/* Overdue Warning Callout */}
        {isPast && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-900">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-red-800 block text-sm">Deadline Has Expired</strong>
              <p className="mt-0.5 text-red-700 leading-relaxed">
                The official deadline for this assignment passed on {new Date(assignment.dueDate).toLocaleString()}.
                You may still submit your work; however, it will be marked as a <strong>Late Submission</strong> and may incur a grade penalty according to departmental regulations.
              </p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/90 text-white text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Upload Form */}
        <form onSubmit={handlePreSubmit} className="space-y-6">
          {/* Drag & Drop Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Assignment Deliverable Upload
            </label>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-indigo-600 bg-indigo-50/50'
                  : selectedFile
                  ? 'border-emerald-400 bg-emerald-50/20'
                  : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.zip,.tar.gz"
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center space-y-3">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                    selectedFile
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {selectedFile ? <FileCheck2 className="w-7 h-7" /> : <Upload className="w-7 h-7" />}
                </div>

                {selectedFile ? (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500 font-mono">File Size: {selectedFile.size}</p>
                    <p className="text-[11px] text-emerald-600 font-bold">Ready for submission. Click to change file.</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800">
                      Drag and drop your assignment file here, or{' '}
                      <span className="text-indigo-600 underline">browse files</span>
                    </p>
                    <p className="text-xs text-slate-500">
                      Supported formats: PDF, DOC, DOCX, ZIP (Max file size: {assignment.maxFileSizeMB} MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Demo Pre-fill Sample File */}
          {!selectedFile && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Or use sample file for testing:</span>
              <button
                type="button"
                onClick={() =>
                  setSelectedFile({
                    name: `${currentUser.name.replace(' ', '')}_${assignment.code}_Report.pdf`,
                    size: '3.4 MB',
                    type: 'application/pdf',
                  })
                }
                className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold border border-indigo-200 transition-colors"
              >
                Attach Generated MCA Assignment PDF
              </button>
            </div>
          )}

          {/* Optional Comments */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Student Remarks / Implementation Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Provide any instructions for the teacher, repository URLs, or setup notes..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActivePage('assignment-details')}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 ${
                selectedFile
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Submit Assignment Deliverable</span>
            </button>
          </div>
        </form>

        {/* Submission History Section */}
        {mySubmissionsForThis.length > 0 && (
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
              <History className="w-4 h-4 text-indigo-600" />
              <span>Submission History for this Assignment</span>
            </div>

            <div className="space-y-2">
              {mySubmissionsForThis.map((sub, idx) => (
                <div
                  key={sub.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-800 flex items-center gap-2">
                      <span>{sub.fileName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                        {sub.fileSize}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Uploaded on {new Date(sub.submittedAt).toLocaleString()}
                    </div>
                  </div>

                  <div>
                    {sub.status === 'evaluated' ? (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        Evaluated ({sub.marksObtained}/{assignment.maxMarks})
                      </span>
                    ) : sub.status === 'late' ? (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                        Late Submission
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                        Pending Evaluation
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <FileCheck2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Confirm Assignment Submission</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to upload this file as your official submission for{' '}
                <strong>{assignment.title}</strong>?
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Deliverable:</span>
                <span className="font-bold text-slate-800 truncate max-w-[200px]">{selectedFile?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">File Size:</span>
                <span className="font-mono text-slate-700">{selectedFile?.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <span className="text-slate-800 font-medium">{currentUser.name} ({currentUser.registerNumber})</span>
              </div>
              {isPast && (
                <div className="pt-1 text-red-600 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Will be recorded as late submission.</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Go Back & Review
              </button>
              <button
                type="button"
                onClick={handleFinalConfirmSubmit}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors"
              >
                Confirm & Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
