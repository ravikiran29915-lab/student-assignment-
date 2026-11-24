import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Bell,
  Search,
  UserCheck,
  LogOut,
  Settings,
  User as UserIcon,
  BookOpen,
  ArrowRightLeft,
  ChevronDown,
  CheckCircle,
  Clock,
  Sparkles,
  Menu,
} from 'lucide-react';
import { ActivePage } from '../../types';

interface NavbarProps {
  onOpenMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const {
    currentUser,
    activePage,
    setActivePage,
    switchRole,
    logout,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setSelectedAssignmentId,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close popups on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  const isTeacher = currentUser.role === 'teacher';
  const roleNotifs = notifications.filter(
    (n) => !n.targetRole || n.targetRole === 'all' || n.targetRole === currentUser.role
  );
  const unreadCount = roleNotifs.filter((n) => !n.read).length;

  const getPageTitle = (page: ActivePage) => {
    switch (page) {
      case 'dashboard':
        return isTeacher ? 'Faculty Dashboard' : 'Student Dashboard';
      case 'assignments':
        return 'Course Assignments';
      case 'assignment-details':
        return 'Assignment Overview';
      case 'assignment-submit':
        return 'Submit Assignment';
      case 'my-submissions':
        return 'My Submissions & Grades';
      case 'deadlines':
        return 'Upcoming Deadlines';
      case 'create-assignment':
        return 'Create New Assignment';
      case 'manage-assignments':
        return 'Manage Assignments';
      case 'student-submissions':
        return 'Student Submissions';
      case 'student-management':
        return 'Student Roster';
      case 'notifications':
        return 'Notification Center';
      case 'profile':
        return 'Account Profile';
      case 'settings':
        return 'System Preferences';
      default:
        return 'Dashboard';
    }
  };

  const handleNotificationClick = (notifId: string, asgId?: string) => {
    markNotificationRead(notifId);
    setIsNotifOpen(false);
    if (asgId) {
      setSelectedAssignmentId(asgId);
      setActivePage(isTeacher ? 'student-submissions' : 'assignment-details');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActivePage(isTeacher ? 'manage-assignments' : 'assignments');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Brand & Breadcrumb */}
      <div className="flex items-center gap-3 shrink-0">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-bold text-base md:text-lg text-slate-900 tracking-tight whitespace-nowrap">
            SAM <span className="hidden sm:inline font-normal text-slate-400">· MCA Mini Project</span>
          </span>
        </div>

        <div className="hidden lg:flex items-center text-xs text-slate-400 font-medium ml-2 pl-3 border-l border-slate-200">
          <span>Portal</span>
          <span className="mx-1.5">/</span>
          <span className="text-slate-800 font-semibold">{getPageTitle(activePage)}</span>
        </div>
      </div>

      {/* Center Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-2">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isTeacher ? "Search assignments, students..." : "Search assignments, topics, subjects..."}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs md:text-sm text-slate-800 rounded-lg border border-transparent focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
          />
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Role Switcher Toggle (Essential for Evaluation Demo) */}
        <button
          onClick={() => switchRole(isTeacher ? 'student' : 'teacher')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            isTeacher
              ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
              : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
          }`}
          title="Toggle view between Student and Teacher roles for project demonstration"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Switch to {isTeacher ? 'Student' : 'Faculty'}</span>
          <span className="sm:hidden">{isTeacher ? 'Student' : 'Faculty'}</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4 md:w-5 md:h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white tabular-nums ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-slate-500 hover:text-blue-600 transition-colors font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto space-y-1.5 divide-y divide-slate-50">
                {roleNotifs.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No notifications at the moment</p>
                ) : (
                  roleNotifs.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n.id, n.relatedAssignmentId)}
                      className={`p-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                        n.read ? 'hover:bg-slate-50 opacity-80' : 'bg-blue-50/50 hover:bg-blue-50 border border-blue-100/80 font-medium'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className={`font-semibold ${n.read ? 'text-slate-800' : 'text-blue-950'}`}>
                          {n.title}
                        </span>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />}
                      </div>
                      <p className="text-slate-600 line-clamp-2 leading-relaxed">{n.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(n.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 mt-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setIsNotifOpen(false);
                    setActivePage('notifications');
                  }}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-lg hover:bg-slate-100 transition-colors text-left"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
            />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-500 font-medium capitalize">
                {isTeacher ? 'Professor' : currentUser.registerNumber}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                <div className="mt-1.5 inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 capitalize">
                  {currentUser.role} · {currentUser.department.replace('Department of ', '')}
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setActivePage('profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  My Profile
                </button>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setActivePage('settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  Settings & Preferences
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
