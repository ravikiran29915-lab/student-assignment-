import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Assignment, Submission, NotificationItem, ActivePage, UserRole } from '../types';
import {
  INITIAL_STUDENT,
  INITIAL_TEACHER,
  MOCK_STUDENTS_ROSTER,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  currentUser: User | null;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  selectedAssignmentId: string | null;
  setSelectedAssignmentId: (id: string | null) => void;
  selectedSubmissionIdForEvaluation: string | null;
  setSelectedSubmissionIdForEvaluation: (id: string | null) => void;
  assignments: Assignment[];
  submissions: Submission[];
  notifications: NotificationItem[];
  students: User[];
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  login: (email: string, role: UserRole) => boolean;
  register: (userData: Partial<User>) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  addAssignment: (newAsg: Omit<Assignment, 'id' | 'createdAt'>) => string;
  updateAssignment: (updated: Assignment) => void;
  deleteAssignment: (id: string) => void;
  toggleAssignmentPublish: (id: string) => void;
  submitAssignment: (
    assignmentId: string,
    fileDetails: { name: string; size: string; type: string },
    comments?: string
  ) => boolean;
  evaluateSubmission: (
    submissionId: string,
    marks: number,
    feedback: string,
    status?: 'evaluated' | 'returned'
  ) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  resetDemoData: () => void;
  isDeadlinePassed: (dueDate: string) => boolean;
  getDaysRemaining: (dueDate: string) => { text: string; isPast: boolean; urgent: boolean };
}

const STORAGE_KEY = 'mca_assignment_manager_state_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or defaults
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_user');
      return saved ? JSON.parse(saved) : INITIAL_STUDENT;
    } catch {
      return INITIAL_STUDENT;
    }
  });

  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [selectedSubmissionIdForEvaluation, setSelectedSubmissionIdForEvaluation] = useState<string | null>(null);

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_assignments');
      return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
    } catch {
      return INITIAL_ASSIGNMENTS;
    }
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_submissions');
      return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [students, setStudents] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_students');
      return saved ? JSON.parse(saved) : MOCK_STUDENTS_ROSTER;
    } catch {
      return MOCK_STUDENTS_ROSTER;
    }
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_user', JSON.stringify(currentUser));
      localStorage.setItem(STORAGE_KEY + '_assignments', JSON.stringify(assignments));
      localStorage.setItem(STORAGE_KEY + '_submissions', JSON.stringify(submissions));
      localStorage.setItem(STORAGE_KEY + '_notifications', JSON.stringify(notifications));
      localStorage.setItem(STORAGE_KEY + '_students', JSON.stringify(students));
    } catch (err) {
      console.warn('LocalStorage save failed:', err);
    }
  }, [currentUser, assignments, submissions, notifications, students]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const login = (email: string, role: UserRole): boolean => {
    if (role === 'teacher') {
      setCurrentUser(INITIAL_TEACHER);
    } else {
      const found = students.find((s) => s.email.toLowerCase() === email.toLowerCase()) || INITIAL_STUDENT;
      setCurrentUser(found);
    }
    setActivePage('dashboard');
    addToast(`Signed in successfully as ${role === 'teacher' ? 'Professor' : 'Student'}!`, 'success');
    return true;
  };

  const register = (userData: Partial<User>): boolean => {
    const newUser: User = {
      id: 'usr-std-' + (students.length + 1).toString().padStart(3, '0'),
      name: userData.name || 'New Student',
      email: userData.email || 'student@university.edu',
      role: 'student',
      registerNumber: userData.registerNumber || `MCA2024-${Math.floor(100 + Math.random() * 900)}`,
      department: userData.department || 'Department of Computer Applications',
      course: userData.course || 'Master of Computer Applications (MCA)',
      yearOfStudy: userData.yearOfStudy || '1st Year (Semester I)',
      avatar: '/src/assets/images/avatar_student_rahul_1793012533653.jpg',
      joinedDate: 'October 2026',
      bio: 'Enrolled in MCA Program.',
    };
    setStudents((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setActivePage('dashboard');
    addToast('Account created successfully! Welcome to Student Assignment Manager.', 'success');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    addToast('You have been logged out.', 'info');
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'teacher') {
      setCurrentUser(INITIAL_TEACHER);
      setActivePage('dashboard');
      addToast('Switched to Teacher View (Dr. Anita Rao)', 'info');
    } else {
      setCurrentUser(INITIAL_STUDENT);
      setActivePage('dashboard');
      addToast('Switched to Student View (Rahul Sharma)', 'info');
    }
  };

  const isDeadlinePassed = (dueDate: string): boolean => {
    return new Date(dueDate).getTime() < Date.now();
  };

  const getDaysRemaining = (dueDate: string) => {
    const diff = new Date(dueDate).getTime() - Date.now();
    if (diff < 0) {
      const daysAgo = Math.abs(Math.round(diff / (1000 * 60 * 60 * 24)));
      return {
        text: daysAgo === 0 ? 'Passed today' : `${daysAgo} day${daysAgo > 1 ? 's' : ''} overdue`,
        isPast: true,
        urgent: true,
      };
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days === 0) {
      return {
        text: hours === 0 ? 'Due within an hour' : `Due in ${hours} hour${hours > 1 ? 's' : ''}`,
        isPast: false,
        urgent: true,
      };
    }
    return {
      text: `${days} day${days > 1 ? 's' : ''} left`,
      isPast: false,
      urgent: days <= 2,
    };
  };

  const addAssignment = (newAsg: Omit<Assignment, 'id' | 'createdAt'>): string => {
    const id = 'asg-' + (assignments.length + 1).toString().padStart(3, '0');
    const created: Assignment = {
      ...newAsg,
      id,
      createdAt: new Date().toISOString(),
    };
    setAssignments((prev) => [created, ...prev]);

    // Send notification to students
    if (newAsg.status === 'published') {
      const notif: NotificationItem = {
        id: 'notif-' + Date.now(),
        title: `New Assignment: ${newAsg.title}`,
        message: `${newAsg.teacherName} assigned "${newAsg.title}" for ${newAsg.subject}. Due: ${new Date(newAsg.dueDate).toLocaleDateString()}.`,
        type: 'assignment',
        timestamp: new Date().toISOString(),
        read: false,
        relatedAssignmentId: id,
        targetRole: 'student',
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    addToast(`Assignment "${created.title}" ${created.status === 'published' ? 'published' : 'saved as draft'}!`, 'success');
    return id;
  };

  const updateAssignment = (updated: Assignment) => {
    setAssignments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    addToast(`Assignment "${updated.title}" updated successfully.`, 'success');
  };

  const deleteAssignment = (id: string) => {
    const target = assignments.find((a) => a.id === id);
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    setSubmissions((prev) => prev.filter((s) => s.assignmentId !== id));
    addToast(`Assignment "${target?.title || id}" deleted.`, 'info');
  };

  const toggleAssignmentPublish = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextStatus = a.status === 'published' ? 'draft' : 'published';
          addToast(`Assignment status changed to ${nextStatus}.`, 'info');
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );
  };

  const submitAssignment = (
    assignmentId: string,
    fileDetails: { name: string; size: string; type: string },
    comments?: string
  ): boolean => {
    if (!currentUser) return false;
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!assignment) return false;

    const isLate = isDeadlinePassed(assignment.dueDate);
    const newSubmission: Submission = {
      id: 'sub-' + Date.now().toString().slice(-6),
      assignmentId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentRegNo: currentUser.registerNumber || 'MCA2024-REG',
      department: currentUser.department,
      fileName: fileDetails.name,
      fileSize: fileDetails.size,
      fileType: fileDetails.type,
      submittedAt: new Date().toISOString(),
      status: isLate ? 'late' : 'pending_evaluation',
      comments: comments || '',
    };

    // Replace existing if resubmitting, or add new
    setSubmissions((prev) => {
      const filtered = prev.filter(
        (s) => !(s.assignmentId === assignmentId && s.studentId === currentUser.id)
      );
      return [newSubmission, ...filtered];
    });

    // Notify teacher
    const teacherNotif: NotificationItem = {
      id: 'notif-tch-' + Date.now(),
      title: `Submission Received: ${assignment.title}`,
      message: `${currentUser.name} submitted assignment for ${assignment.subject}.${isLate ? ' (Late Submission)' : ''}`,
      type: 'submission',
      timestamp: new Date().toISOString(),
      read: false,
      relatedAssignmentId: assignmentId,
      targetRole: 'teacher',
    };

    // Notify student
    const studentNotif: NotificationItem = {
      id: 'notif-std-' + Date.now(),
      title: `Assignment Submitted: ${assignment.title}`,
      message: `Your file "${fileDetails.name}" has been uploaded successfully.${isLate ? ' Marked as late submission.' : ''}`,
      type: 'submission',
      timestamp: new Date().toISOString(),
      read: false,
      relatedAssignmentId: assignmentId,
      targetRole: 'student',
    };

    setNotifications((prev) => [studentNotif, teacherNotif, ...prev]);
    addToast(
      isLate ? 'Assignment submitted (marked as late submission).' : 'Assignment submitted successfully!',
      isLate ? 'warning' : 'success'
    );
    return true;
  };

  const evaluateSubmission = (
    submissionId: string,
    marks: number,
    feedback: string,
    status: 'evaluated' | 'returned' = 'evaluated'
  ) => {
    let targetSub: Submission | undefined;
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === submissionId) {
          targetSub = s;
          return {
            ...s,
            marksObtained: marks,
            teacherFeedback: feedback,
            status,
            evaluatedAt: new Date().toISOString(),
          };
        }
        return s;
      })
    );

    if (targetSub) {
      const assignment = assignments.find((a) => a.id === targetSub?.assignmentId);
      const studentNotif: NotificationItem = {
        id: 'notif-eval-' + Date.now(),
        title: status === 'returned' ? `Assignment Returned for Correction: ${assignment?.title}` : `Marks Published: ${assignment?.title}`,
        message: status === 'returned'
          ? `Your teacher requested corrections: "${feedback.slice(0, 80)}..."`
          : `You scored ${marks}/${assignment?.maxMarks ?? 100} on ${assignment?.subject}. Feedback: "${feedback.slice(0, 80)}..."`,
        type: 'evaluation',
        timestamp: new Date().toISOString(),
        read: false,
        relatedAssignmentId: targetSub.assignmentId,
        targetRole: 'student',
      };
      setNotifications((prev) => [studentNotif, ...prev]);
    }

    addToast(
      status === 'returned' ? 'Submission returned for correction.' : 'Evaluation saved and published to student!',
      'success'
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('All notifications marked as read.', 'info');
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    if (updated.role === 'student') {
      setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    }
    addToast('Profile updated successfully!', 'success');
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY + '_user');
    localStorage.removeItem(STORAGE_KEY + '_assignments');
    localStorage.removeItem(STORAGE_KEY + '_submissions');
    localStorage.removeItem(STORAGE_KEY + '_notifications');
    localStorage.removeItem(STORAGE_KEY + '_students');

    setCurrentUser(INITIAL_STUDENT);
    setAssignments(INITIAL_ASSIGNMENTS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setStudents(MOCK_STUDENTS_ROSTER);
    setActivePage('dashboard');
    addToast('College demo dataset has been reset to default initial state!', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activePage,
        setActivePage,
        selectedAssignmentId,
        setSelectedAssignmentId,
        selectedSubmissionIdForEvaluation,
        setSelectedSubmissionIdForEvaluation,
        assignments,
        submissions,
        notifications,
        students,
        toasts,
        addToast,
        removeToast,
        login,
        register,
        logout,
        switchRole,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        toggleAssignmentPublish,
        submitAssignment,
        evaluateSubmission,
        markNotificationRead,
        markAllNotificationsRead,
        updateUserProfile,
        resetDemoData,
        isDeadlinePassed,
        getDaysRemaining,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
