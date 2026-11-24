import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  BookOpen,
  FileCheck2,
  CalendarClock,
  Bell,
  User,
  Settings,
  LogOut,
  PlusCircle,
  FolderKanban,
  ClipboardCheck,
  Users,
  GraduationCap,
  Sparkles,
  ArrowRightLeft,
  X,
} from 'lucide-react';
import { ActivePage } from '../../types';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const {
    currentUser,
    activePage,
    setActivePage,
    switchRole,
    logout,
    assignments,
    submissions,
    notifications,
  } = useApp();

  if (!currentUser) return null;

  const isTeacher = currentUser.role === 'teacher';

  // Compute pending metrics for badge display
  const pendingSubmissionsCount = isTeacher
    ? submissions.filter((s) => s.status === 'pending_evaluation' || s.status === 'submitted').length
    : assignments.filter(
        (a) =>
          a.status === 'published' &&
          !submissions.some((s) => s.assignmentId === a.id && s.studentId === currentUser.id)
      ).length;

  const unreadNotifs = notifications.filter(
    (n) => (!n.targetRole || n.targetRole === 'all' || n.targetRole === currentUser.role) && !n.read
  ).length;

  interface NavItem {
    id: ActivePage;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }

  const studentNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assignments', label: 'All Assignments', icon: BookOpen, badge: pendingSubmissionsCount, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'my-submissions', label: 'My Submissions', icon: FileCheck2 },
    { id: 'deadlines', label: 'Upcoming Deadlines', icon: CalendarClock },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifs, badgeColor: 'bg-indigo-100 text-indigo-700' },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const teacherNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create-assignment', label: 'Create Assignment', icon: PlusCircle },
    { id: 'manage-assignments', label: 'Manage Assignments', icon: FolderKanban },
    { id: 'student-submissions', label: 'Student Submissions', icon: ClipboardCheck, badge: pendingSubmissionsCount, badgeColor: 'bg-red-100 text-red-800' },
    { id: 'student-management', label: 'Student Management', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifs, badgeColor: 'bg-indigo-100 text-indigo-700' },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const navItems = isTeacher ? teacherNavItems : studentNavItems;

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-900 text-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out border-r border-slate-800/80 shadow-xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide leading-none">Assignment Hub</h1>
              <p className="text-[10px] text-indigo-300 font-medium mt-1">MCA Mini Project</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="px-4 py-3 mx-3 my-2 rounded-xl bg-slate-800/60 border border-slate-800 flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-lg object-cover ring-2 ring-indigo-500/30"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-xs font-semibold text-white truncate">{currentUser.name}</h2>
            <p className="text-[11px] text-indigo-300/90 font-medium capitalize truncate">
              {isTeacher ? 'Professor & HOD' : currentUser.registerNumber}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {isTeacher ? 'Faculty Workspace' : 'Student Portal'}
          </div>

          {navItems.map((item) => {
            const isActive = activePage === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold tabular-nums ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Role Switcher & Sign Out */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          {/* Demo Role Switcher Card */}
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-900/40 text-left">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Demo Switcher
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-200 font-semibold">
                1-Click
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mb-2 leading-relaxed">
              Viewing as <strong className="text-white">{isTeacher ? 'Faculty' : 'Student'}</strong>. Switch to inspect the other interface.
            </p>
            <button
              onClick={() => switchRole(isTeacher ? 'student' : 'teacher')}
              className="w-full flex items-center justify-center gap-2 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              Switch to {isTeacher ? 'Student View' : 'Teacher View'}
            </button>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800/80 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 text-slate-500 hover:text-red-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
