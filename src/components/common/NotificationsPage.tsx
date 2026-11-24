import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCheck,
  BookOpen,
  Clock,
  CheckCircle2,
  Award,
  AlertCircle,
  Filter,
  ArrowRight,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    currentUser,
    markNotificationRead,
    markAllNotificationsRead,
    setSelectedAssignmentId,
    setActivePage,
  } = useApp();

  const [filterType, setFilterType] = useState<string>('ALL');

  if (!currentUser) return null;

  // Filter for role
  const roleNotifs = useMemo(() => {
    return notifications.filter(
      (n) => !n.targetRole || n.targetRole === 'all' || n.targetRole === currentUser.role
    );
  }, [notifications, currentUser]);

  const filtered = useMemo(() => {
    if (filterType === 'ALL') return roleNotifs;
    if (filterType === 'UNREAD') return roleNotifs.filter((n) => !n.read);
    return roleNotifs.filter((n) => n.type === filterType);
  }, [roleNotifs, filterType]);

  const unreadCount = roleNotifs.filter((n) => !n.read).length;

  const handleNotificationClick = (notif: any) => {
    markNotificationRead(notif.id);
    if (notif.relatedAssignmentId) {
      setSelectedAssignmentId(notif.relatedAssignmentId);
      setActivePage(
        currentUser.role === 'teacher' ? 'student-submissions' : 'assignment-details'
      );
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <BookOpen className="w-5 h-5 text-indigo-600" />;
      case 'deadline':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'submission':
        return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
      case 'evaluation':
        return <Award className="w-5 h-5 text-emerald-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Notification Center</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official announcements, evaluation publish alerts, and upcoming deadline warnings
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-200 text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 text-xs shadow-sm">
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
            filterType === 'ALL' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All ({roleNotifs.length})
        </button>
        <button
          onClick={() => setFilterType('UNREAD')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
            filterType === 'UNREAD' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-indigo-600'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilterType('assignment')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
            filterType === 'assignment' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Assignments
        </button>
        <button
          onClick={() => setFilterType('evaluation')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
            filterType === 'evaluation' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Marks & Grades
        </button>
        <button
          onClick={() => setFilterType('deadline')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
            filterType === 'deadline' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Deadlines
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2">
            <Bell className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No notifications to display</h3>
            <p className="text-xs text-slate-400">All updates and academic notices will appear here.</p>
          </div>
        ) : (
          filtered.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                notif.read
                  ? 'bg-white border-slate-200/80 hover:border-slate-300'
                  : 'bg-indigo-50/40 border-indigo-200 shadow-sm hover:border-indigo-300'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  notif.read ? 'bg-slate-100' : 'bg-white shadow-sm'
                }`}
              >
                {getNotifIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3
                    className={`text-sm leading-snug truncate ${
                      notif.read ? 'font-bold text-slate-800' : 'font-extrabold text-indigo-950'
                    }`}
                  >
                    {notif.title}
                  </h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-slate-400">
                      {new Date(notif.timestamp).toLocaleDateString()} at{' '}
                      {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {!notif.read && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>

                {notif.relatedAssignmentId && (
                  <div className="pt-1.5 flex items-center gap-1 text-[11px] font-bold text-indigo-600">
                    <span>View associated assignment module</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
