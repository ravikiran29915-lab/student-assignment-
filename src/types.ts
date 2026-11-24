export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  registerNumber?: string;
  department: string;
  course?: string;
  yearOfStudy?: string;
  designation?: string;
  teacherId?: string;
  avatar: string;
  joinedDate: string;
  phone?: string;
  bio?: string;
}

export interface AssignmentResource {
  id: string;
  name: string;
  size: string;
  type: string;
  url?: string;
}

export interface Assignment {
  id: string;
  code: string; // e.g. MCA-301
  title: string;
  subject: string;
  subjectCode: string;
  teacherId: string;
  teacherName: string;
  department: string;
  targetClass: string;
  description: string;
  instructions: string[];
  tasks: string[];
  assignedDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DDTHH:mm
  maxMarks: number;
  acceptedFormats: string[];
  maxFileSizeMB: number;
  status: 'published' | 'draft';
  resources: AssignmentResource[];
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentRegNo: string;
  department: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  submittedAt: string; // ISO string
  status: 'submitted' | 'evaluated' | 'pending_evaluation' | 'late' | 'returned';
  marksObtained?: number;
  teacherFeedback?: string;
  evaluatedAt?: string;
  comments?: string;
  attemptNumber?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'assignment' | 'deadline' | 'submission' | 'evaluation' | 'system';
  timestamp: string;
  read: boolean;
  relatedAssignmentId?: string;
  targetRole?: UserRole | 'all';
}

export type ActivePage =
  | 'dashboard'
  | 'assignments'
  | 'assignment-details'
  | 'assignment-submit'
  | 'my-submissions'
  | 'deadlines'
  | 'create-assignment'
  | 'manage-assignments'
  | 'student-submissions'
  | 'student-management'
  | 'notifications'
  | 'profile'
  | 'settings';
