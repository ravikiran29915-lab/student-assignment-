import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  LayoutGrid,
  Table as TableIcon,
  ChevronRight,
  Upload,
} from 'lucide-react';
import { Assignment } from '../../types';

export const AssignmentListing: React.FC = () => {
  const {
    assignments,
    submissions,
    currentUser,
    setActivePage,
    setSelectedAssignmentId,
    getDaysRemaining,
    isDeadlinePassed,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'PENDING' | 'SUBMITTED' | 'EVALUATED' | 'OVERDUE'>('ALL');
  const [sortBy, setSortBy] = useState<'NEAREST' | 'NEWEST' | 'OLDEST'>('NEAREST');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  if (!currentUser) return null;

  // Subjects list
  const subjects = useMemo(() => {
    const set = new Set<string>();
    assignments.forEach((a) => set.add(a.subject));
    return Array.from(set);
  }, [assignments]);

  // Compute status for each assignment for current student
  const getAssignmentStatus = (asg: Assignment) => {
    const sub = submissions.find((s) => s.assignmentId === asg.id && s.studentId === currentUser.id);
    if (!sub) {
      if (isDeadlinePassed(asg.dueDate)) return 'OVERDUE';
      return 'PENDING';
    }
    if (sub.status === 'evaluated' || (sub.status === 'late' && sub.marksObtained !== undefined)) {
      return 'EVALUATED';
    }
    return 'SUBMITTED';
  };

  // Filtered and sorted assignments
  const filteredAssignments = useMemo(() => {
    return assignments
      .filter((a) => a.status === 'published')
      .filter((a) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.subject.toLowerCase().includes(q) ||
          a.code.toLowerCase().includes(q) ||
          a.teacherName.toLowerCase().includes(q)
        );
      })
      .filter((a) => {
        if (selectedSubject === 'ALL') return true;
        return a.subject === selectedSubject;
      })
      .filter((a) => {
        if (selectedStatus === 'ALL') return true;
        const status = getAssignmentStatus(a);
        return status === selectedStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'NEAREST') {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (sortBy === 'NEWEST') {
          return new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime();
        }
        return new Date(a.assignedDate).getTime() - new Date(b.assignedDate).getTime();
      });
  }, [assignments, search, selectedSubject, selectedStatus, sortBy, submissions, currentUser]);

  const handleOpenDetails = (id: string) => {
    setSelectedAssignmentId(id);
    setActivePage('assignment-details');
  };

  const handleOpenSubmit = (id: string) => {
    setSelectedAssignmentId(id);
    setActivePage('assignment-submit');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Course Assignments</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse and manage all coursework deliverables for the current MCA semester
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 self-start sm:self-auto shadow-sm">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewMode === 'table' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, subject or code..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Subject Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Subjects</option>
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending (Not Submitted)</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="EVALUATED">Evaluated</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="NEAREST">Nearest Deadline</option>
              <option value="NEWEST">Newest Assigned</option>
              <option value="OLDEST">Oldest Assigned</option>
            </select>
          </div>
        </div>

        {/* Filter Quick Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium">Quick Filter:</span>
          {(['ALL', 'PENDING', 'SUBMITTED', 'EVALUATED', 'OVERDUE'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                selectedStatus === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL'
                ? 'All'
                : st === 'PENDING'
                ? 'Pending'
                : st === 'SUBMITTED'
                ? 'Submitted'
                : st === 'EVALUATED'
                ? 'Evaluated'
                : 'Overdue'}
            </button>
          ))}

          <span className="ml-auto text-slate-500 text-[11px]">
            Showing <strong className="text-slate-800 tabular-nums">{filteredAssignments.length}</strong> assignments
          </span>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAssignments.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No assignments match your criteria</h3>
              <p className="text-xs text-slate-400">Try modifying your search or filter preferences.</p>
            </div>
          ) : (
            filteredAssignments.map((asg) => {
              const status = getAssignmentStatus(asg);
              const rem = getDaysRemaining(asg.dueDate);
              const sub = submissions.find((s) => s.assignmentId === asg.id && s.studentId === currentUser.id);

              return (
                <div
                  key={asg.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between p-5 space-y-4"
                >
                  {/* Top Subject and Status */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                        {asg.code}
                      </span>

                      {/* Status Badges */}
                      {status === 'EVALUATED' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Evaluated ({sub?.marksObtained}/{asg.maxMarks})
                        </span>
                      )}
                      {status === 'SUBMITTED' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Submitted
                        </span>
                      )}
                      {status === 'PENDING' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                      {status === 'OVERDUE' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          Overdue
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2">
                      {asg.title}
                    </h3>

                    <p className="text-xs text-indigo-900/80 font-medium">{asg.subject}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{asg.description}</p>
                  </div>

                  {/* Metadata and Deadlines */}
                  <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[140px]">{asg.teacherName}</span>
                      </span>
                      <span className="font-semibold text-slate-700">Max: {asg.maxMarks} Marks</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(asg.dueDate).toLocaleDateString()}
                      </span>

                      <span
                        className={`text-[11px] font-semibold tabular-nums ${
                          rem.isPast ? 'text-red-600' : rem.urgent ? 'text-amber-600 font-bold' : 'text-slate-600'
                        }`}
                      >
                        {status === 'SUBMITTED' || status === 'EVALUATED' ? 'Delivered' : rem.text}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleOpenDetails(asg.id)}
                      className="w-full py-2 px-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center"
                    >
                      View Details
                    </button>
                    {status === 'SUBMITTED' || status === 'EVALUATED' ? (
                      <button
                        onClick={() => {
                          setSelectedAssignmentId(asg.id);
                          setActivePage('my-submissions');
                        }}
                        className="w-full py-2 px-3 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors text-center"
                      >
                        View Submission
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenSubmit(asg.id)}
                        className="w-full py-2 px-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors text-center flex items-center justify-center gap-1"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Submit Work</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Code & Title</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Faculty</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Max Marks</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssignments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      No assignments found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredAssignments.map((asg) => {
                    const status = getAssignmentStatus(asg);
                    const rem = getDaysRemaining(asg.dueDate);
                    const sub = submissions.find((s) => s.assignmentId === asg.id && s.studentId === currentUser.id);

                    return (
                      <tr key={asg.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{asg.title}</div>
                          <div className="text-[11px] text-indigo-600 font-mono">{asg.code}</div>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-700">{asg.subject}</td>
                        <td className="px-4 py-3 text-slate-500">{asg.teacherName}</td>
                        <td className="px-4 py-3">
                          <div className="text-slate-800 font-semibold">{new Date(asg.dueDate).toLocaleDateString()}</div>
                          <div
                            className={`text-[10px] tabular-nums ${
                              rem.isPast ? 'text-red-600 font-semibold' : 'text-slate-400'
                            }`}
                          >
                            {rem.text}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-800 tabular-nums">{asg.maxMarks}</td>
                        <td className="px-4 py-3">
                          {status === 'EVALUATED' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700">
                              Evaluated ({sub?.marksObtained})
                            </span>
                          )}
                          {status === 'SUBMITTED' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700">
                              Submitted
                            </span>
                          )}
                          {status === 'PENDING' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700">
                              Pending
                            </span>
                          )}
                          {status === 'OVERDUE' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-50 text-red-700">
                              Overdue
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenDetails(asg.id)}
                              className="px-2.5 py-1 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold"
                            >
                              Details
                            </button>
                            {status === 'PENDING' || status === 'OVERDUE' ? (
                              <button
                                onClick={() => handleOpenSubmit(asg.id)}
                                className="px-2.5 py-1 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold"
                              >
                                Submit
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedAssignmentId(asg.id);
                                  setActivePage('my-submissions');
                                }}
                                className="px-2.5 py-1 text-blue-700 hover:bg-blue-50 rounded-lg font-semibold"
                              >
                                View
                              </button>
                            )}
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
      )}
    </div>
  );
};
