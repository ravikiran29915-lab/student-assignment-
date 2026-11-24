import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FolderKanban,
  Search,
  PlusCircle,
  Edit3,
  Trash2,
  Eye,
  FileCheck2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  X,
  Check,
} from 'lucide-react';
import { Assignment } from '../../types';

export const ManageAssignments: React.FC = () => {
  const {
    assignments,
    submissions,
    students,
    deleteAssignment,
    updateAssignment,
    toggleAssignmentPublish,
    setActivePage,
    setSelectedAssignmentId,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'published' | 'draft'>('ALL');
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [deletingAssignmentId, setDeletingAssignmentId] = useState<string | null>(null);

  // Filtered list
  const filtered = useMemo(() => {
    return assignments
      .filter((a) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.subject.toLowerCase().includes(q) ||
          a.code.toLowerCase().includes(q)
        );
      })
      .filter((a) => {
        if (selectedStatus === 'ALL') return true;
        return a.status === selectedStatus;
      });
  }, [assignments, search, selectedStatus]);

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAssignment) return;
    updateAssignment(editingAssignment);
    setEditingAssignment(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingAssignmentId) return;
    deleteAssignment(deletingAssignmentId);
    setDeletingAssignmentId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manage Assignments</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain deadlines, update module specifications, monitor submission turn-in
          </p>
        </div>

        <button
          onClick={() => setActivePage('create-assignment')}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-purple-600/30 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Assignment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assignments..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-purple-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto text-xs">
          <span className="text-slate-400 font-medium">Status:</span>
          {(['ALL', 'published', 'draft'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all ${
                selectedStatus === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Assignments Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3.5">Code & Title</th>
                <th className="px-4 py-3.5">Subject</th>
                <th className="px-4 py-3.5">Assigned Date</th>
                <th className="px-4 py-3.5">Submission Deadline</th>
                <th className="px-4 py-3.5">Submissions</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No assignments found matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((asg) => {
                  const asgSubmissions = submissions.filter((s) => s.assignmentId === asg.id);
                  const isPublished = asg.status === 'published';

                  return (
                    <tr key={asg.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">{asg.title}</div>
                        <div className="text-[11px] font-mono text-purple-700 font-semibold">{asg.code}</div>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-700">{asg.subject}</td>
                      <td className="px-4 py-3.5 text-slate-500">{new Date(asg.assignedDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-800">
                          {new Date(asg.dueDate).toLocaleDateString()}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(asg.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => {
                            setSelectedAssignmentId(asg.id);
                            setActivePage('student-submissions');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold tabular-nums transition-colors flex items-center gap-1.5"
                          title="View submissions"
                        >
                          <FileCheck2 className="w-3.5 h-3.5 text-purple-600" />
                          <span>
                            {asgSubmissions.length} / {students.length}
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => toggleAssignmentPublish(asg.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                            isPublished
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                          }`}
                          title="Click to toggle publish status"
                        >
                          {isPublished ? <Check className="w-3 h-3" /> : null}
                          <span className="capitalize">{asg.status}</span>
                        </button>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedAssignmentId(asg.id);
                              setActivePage('assignment-details');
                            }}
                            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Preview Assignment Page"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingAssignment({ ...asg })}
                            className="p-1.5 text-slate-500 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                            title="Edit Assignment"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingAssignmentId(asg.id)}
                            className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete Assignment"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Edit Assignment Modal */}
      {editingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Edit Assignment Details</h3>
              <button
                onClick={() => setEditingAssignment(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Title</label>
                <input
                  type="text"
                  value={editingAssignment.title}
                  onChange={(e) =>
                    setEditingAssignment({ ...editingAssignment, title: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-purple-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Subject</label>
                  <input
                    type="text"
                    value={editingAssignment.subject}
                    onChange={(e) =>
                      setEditingAssignment({ ...editingAssignment, subject: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-purple-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Max Marks</label>
                  <input
                    type="number"
                    value={editingAssignment.maxMarks}
                    onChange={(e) =>
                      setEditingAssignment({
                        ...editingAssignment,
                        maxMarks: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-purple-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Submission Deadline</label>
                <input
                  type="datetime-local"
                  value={editingAssignment.dueDate.slice(0, 16)}
                  onChange={(e) =>
                    setEditingAssignment({ ...editingAssignment, dueDate: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-purple-600"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingAssignment.description}
                  onChange={(e) =>
                    setEditingAssignment({
                      ...editingAssignment,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-purple-600"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingAssignment(null)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingAssignmentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Delete Assignment?</h3>
              <p className="text-xs text-slate-500">
                This will permanently delete this assignment and all associated student submissions.
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setDeletingAssignmentId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
