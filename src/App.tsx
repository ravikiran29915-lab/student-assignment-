/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/Toast';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';

// Student Views
import { StudentDashboard } from './components/student/StudentDashboard';
import { AssignmentListing } from './components/student/AssignmentListing';
import { AssignmentDetails } from './components/student/AssignmentDetails';
import { AssignmentSubmission } from './components/student/AssignmentSubmission';
import { MySubmissions } from './components/student/MySubmissions';
import { UpcomingDeadlines } from './components/student/UpcomingDeadlines';

// Teacher Views
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { CreateAssignment } from './components/teacher/CreateAssignment';
import { ManageAssignments } from './components/teacher/ManageAssignments';
import { SubmissionsList } from './components/teacher/SubmissionsList';
import { StudentManagement } from './components/teacher/StudentManagement';

// Common Views
import { NotificationsPage } from './components/common/NotificationsPage';
import { ProfilePage } from './components/common/ProfilePage';
import { SettingsPage } from './components/common/SettingsPage';

const MainLayout: React.FC = () => {
  const { currentUser, activePage } = useApp();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If user is not authenticated, render auth views
  if (!currentUser) {
    if (authView === 'register') {
      return (
        <>
          <RegisterPage onSwitchToLogin={() => setAuthView('login')} />
          <ToastContainer />
        </>
      );
    }
    return (
      <>
        <LoginPage onSwitchToRegister={() => setAuthView('register')} />
        <ToastContainer />
      </>
    );
  }

  const isTeacher = currentUser.role === 'teacher';

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return isTeacher ? <TeacherDashboard /> : <StudentDashboard />;
      case 'assignments':
        return <AssignmentListing />;
      case 'assignment-details':
        return <AssignmentDetails />;
      case 'assignment-submit':
        return <AssignmentSubmission />;
      case 'my-submissions':
        return <MySubmissions />;
      case 'deadlines':
        return <UpcomingDeadlines />;
      case 'create-assignment':
        return isTeacher ? <CreateAssignment /> : <StudentDashboard />;
      case 'manage-assignments':
        return isTeacher ? <ManageAssignments /> : <AssignmentListing />;
      case 'student-submissions':
        return isTeacher ? <SubmissionsList /> : <MySubmissions />;
      case 'student-management':
        return isTeacher ? <StudentManagement /> : <StudentDashboard />;
      case 'notifications':
        return <NotificationsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return isTeacher ? <TeacherDashboard /> : <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      <div className="flex flex-1">
        {/* Navigation Sidebar */}
        <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar onOpenMobileMenu={() => setMobileSidebarOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {renderActivePage()}
          </main>

          <Footer />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
