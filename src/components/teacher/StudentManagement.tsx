import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  Mail,
  Phone,
  FileCheck2,
  Clock,
  Award,
  ChevronRight,
  X,
  BookOpen,
} from 'lucide-react';
import { User, Assignment, Submission } from '../../types';

export const StudentManagement: React.FC = () => {
  const { students, assignments, submissions, isDeadlinePassed } = useApp();

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  const publishedAssignments = assignments.filter((a) => a.status === 'published');

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        (s.registerNumber && s.registerNumber.toLowerCase().includes(q)) ||
        s.email.toLowerCase().includes(q)
      );
    });
  }, [students, search]);

  // Helper to compute student academic metrics
  const getStudentMetrics = (studentId: string) => {
    const studentSubs = submissions.filter((s) => s.studentId === studentId);
    const submittedIds = new Set(studentSubs.map((s) => s.assignmentId));

    const submittedCount = studentSubs.length;
    const pendingCount = publishedAssignments.filter(
      (a) => !submittedIds.has(a.id) && !isDeadlinePassed(a.dueDate)
    ).length;
    const overdueCount = publishedAssignments.filter(
      (a) => !submittedIds.has(a.id) && isDeadlinePassed(a.dueDate)
    ).length;

    const evaluatedSubs = studentSubs.filter((s) => s.marksObtained !== undefined);
    const avgScore =
      evaluatedSubs.length > 0
        ? Math.round(
            (evaluatedSubs.reduce((acc, s) => acc + (s.marksObtained || 0), 0) /
              evaluatedSubs.reduce((acc, s) => {
                const asg = assignments.find((a) => a.id === s.assignmentId);
                return acc + (asg?.maxMarks || 25);
              }, 0)) *
              100
          )
        : null;

    return {
      submittedCount,
      pendingCount,
      overdueCount,
      avgScore,
      studentSubs,
    };
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Management Roster</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enrolled student cohort, academic progress monitoring, and individual submissions
          </p>
        </div>

        <div className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm self-start sm:self-auto tabular-nums">
          Enrolled: <strong className="text-purple-600">{students.length} Students</strong>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name or register number..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-purple-600 focus:bg-white"
          />
        </div>

        <div className="text-xs text-slate-500">
          Showing <strong>{filteredStudents.length}</strong> of {students.length} students
        </div>
      </div>

      {/* Students Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStudents.map((student) => {
          const metrics = getStudentMetrics(student.id);

          return (
            <div
              key={student.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between space-y-4"
            >
              {/* Profile Card Header */}
              <div className="flex items-start gap-3">
                <img
                  src={student.avatar}
                  alt={student.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-purple-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate">{student.name}</h3>
                  <div className="text-xs font-mono font-semibold text-purple-700">
                    {student.registerNumber}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">{student.course}</div>
                </div>
              </div>

              {/* Metrics strip */}
              <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-xl text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Turned In</span>
                  <span className="font-extrabold text-slate-900 text-sm tabular-nums">
                    {metrics.submittedCount}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Pending</span>
                  <span className="font-extrabold text-amber-600 text-sm tabular-nums">
                    {metrics.pendingCount}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Avg Grade</span>
                  <span className="font-extrabold text-emerald-600 text-sm tabular-nums">
                    {metrics.avgScore !== null ? `${metrics.avgScore}%` : '—'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setSelectedStudent(student)}
                className="w-full py-2 px-3 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Academic Progress</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Student Profile Drawer / Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-200"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedStudent.name}</h3>
                  <p className="text-xs text-purple-700 font-mono font-bold">
                    {selectedStudent.registerNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student Info */}
            <div className="p-3.5 bg-slate-50 rounded-2xl space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[11px]">Email:</span>
                  <span className="text-slate-800 font-medium">{selectedStudent.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Department:</span>
                  <span className="text-slate-800 font-medium">{selectedStudent.department}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/80">
                <div>
                  <span className="text-slate-400 block text-[11px]">Course & Year:</span>
                  <span className="text-slate-800 font-medium">
                    {selectedStudent.course} · {selectedStudent.yearOfStudy}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Enrolled Since:</span>
                  <span className="text-slate-800 font-medium">{selectedStudent.joinedDate}</span>
                </div>
              </div>
            </div>

            {/* Detailed Submissions History */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Semester Assignment Submissions
              </h4>
              <div className="space-y-2">
                {publishedAssignments.map((asg) => {
                  const sub = submissions.find(
                    (s) => s.assignmentId === asg.id && s.studentId === selectedStudent.id
                  );
                  const isPast = isDeadlinePassed(asg.dueDate);

                  return (
                    <div
                      key={asg.id}
                      className="p-3 rounded-xl border border-slate-200 text-xs flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{asg.title}</div>
                        <div className="text-[11px] text-slate-500">
                          {asg.subjectCode} · Due {new Date(asg.dueDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {sub ? (
                          sub.marksObtained !== undefined ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                              Graded: {sub.marksObtained}/{asg.maxMarks}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
                              Turned In
                            </span>
                          )
                        ) : isPast ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-800">
                            Overdue
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
