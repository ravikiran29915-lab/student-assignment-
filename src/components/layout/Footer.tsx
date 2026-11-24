import React from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, BookOpen, ShieldCheck, HelpCircle, Code2, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActivePage, currentUser } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Description */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-white tracking-tight">Student Assignment Manager</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A comprehensive academic management system designed for Master of Computer Applications (MCA) department curriculum. Streamlining assignment distribution, submission deadlines, file verification, and rubric evaluations.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-400 font-mono font-medium">MCA Mini Project</span>
              <span>·</span>
              <span>Academic Year 2026</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Quick Navigation</div>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => setActivePage('dashboard')}
                  className="hover:text-white transition-colors text-left"
                >
                  Dashboard Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage(currentUser?.role === 'teacher' ? 'manage-assignments' : 'assignments')}
                  className="hover:text-white transition-colors text-left"
                >
                  Assignment Repository
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage(currentUser?.role === 'teacher' ? 'student-submissions' : 'my-submissions')}
                  className="hover:text-white transition-colors text-left"
                >
                  Submissions & Grades
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('notifications')}
                  className="hover:text-white transition-colors text-left"
                >
                  Notification Feed
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Help & Support */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Help & Guidance</div>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                <span>Assignment Guidelines</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>Plagiarism & Code Rubrics</span>
              </li>
              <li className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                <span>Lab Database Credentials</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Git & Docker Setup FAQs</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 Student Assignment Manager. Department of Computer Applications. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Academic Honor Code</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Support Desk</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
