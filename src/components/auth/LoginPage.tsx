import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  GraduationCap,
  Eye,
  EyeOff,
  LogIn,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  CalendarCheck,
  Award,
} from 'lucide-react';

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister }) => {
  const { login, addToast } = useApp();

  const [role, setRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('rahul.mca24@university.edu');
  const [password, setPassword] = useState('mca2024pass');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your university email address.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your account password.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    const success = login(email, role);
    if (!success) {
      setErrorMsg('Invalid login credentials for the selected role.');
    }
  };

  const handleFillDemo = (demoRole: UserRole) => {
    setRole(demoRole);
    if (demoRole === 'student') {
      setEmail('rahul.mca24@university.edu');
      setPassword('mca2024pass');
    } else {
      setEmail('anita.rao@university.edu');
      setPassword('prof2026pass');
    }
    setErrorMsg('');
    addToast(`Filled demo credentials for ${demoRole === 'student' ? 'Rahul Sharma (Student)' : 'Dr. Anita Rao (Faculty)'}!`, 'info');
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      addToast('Please provide a valid institutional email.', 'error');
      return;
    }
    setForgotModalOpen(false);
    addToast(`Password recovery link dispatched to ${resetEmail}`, 'success');
    setResetEmail('');
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-900 text-slate-100">
      {/* Left Column: Visual & Value Proposition */}
      <div className="lg:w-1/2 relative bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
        {/* Subtle decorative glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Brand header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white block">Student Assignment Manager</span>
            <span className="text-xs text-indigo-300 font-medium">Department of Computer Applications</span>
          </div>
        </div>

        {/* Center Illustration with Fallback */}
        <div className="relative z-10 my-8 flex flex-col items-center">
          <div className="relative w-full max-w-lg rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl shadow-indigo-950/80 bg-slate-800">
            <img
              src="/src/assets/images/edu_login_illustration_1793012533598.jpg"
              alt="Education Collaboration Digital Platform"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover max-h-[380px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-6">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">Academic Portal 2026</span>
              <p className="text-white text-base font-bold leading-snug">
                Manage assignments. Meet deadlines. Achieve more.
              </p>
              <p className="text-xs text-slate-300 mt-1">
                Centralized academic assignment workflow for MCA students and teaching faculty.
              </p>
            </div>
          </div>
        </div>

        {/* Highlights feature strip */}
        <div className="relative z-10 grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <BookOpen className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Digital Submission</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CalendarCheck className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Deadline Tracking</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Award className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Rubric Grading</span>
          </div>
        </div>
      </div>

      {/* Right Column: Modern Authentication Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-slate-900">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Sign In to Your Account</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
              Select your role and enter your institutional credentials to continue.
            </p>
          </div>

          {/* Quick 1-Click Demo Buttons for Presentation */}
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Quick Demo Accounts (1-Click Fill)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Viva Demo</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('student')}
                className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold border transition-all text-left flex flex-col ${
                  role === 'student'
                    ? 'bg-blue-600/20 text-blue-300 border-blue-500/50'
                    : 'bg-slate-700/50 text-slate-300 border-slate-600 hover:bg-slate-700'
                }`}
              >
                <span className="font-bold text-white">Student Account</span>
                <span className="text-[10px] text-slate-400">Rahul Sharma (MCA)</span>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('teacher')}
                className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold border transition-all text-left flex flex-col ${
                  role === 'teacher'
                    ? 'bg-purple-600/20 text-purple-300 border-purple-500/50'
                    : 'bg-slate-700/50 text-slate-300 border-slate-600 hover:bg-slate-700'
                }`}
              >
                <span className="font-bold text-white">Faculty Account</span>
                <span className="text-[10px] text-slate-400">Dr. Anita Rao (HOD)</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Select Your Academic Role
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-800 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                    role === 'student'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                    role === 'teacher'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Teacher / Faculty
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-200 text-xs">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Institutional Email ID
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'student' ? 'student.reg@university.edu' : 'faculty@university.edu'}
                className="w-full px-3.5 py-2.5 bg-slate-800/90 text-sm text-white rounded-xl border border-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-500"
                required
              />
            </div>

            {/* Password Field with Show/Hide */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-800/90 text-sm text-white rounded-xl border border-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
              />
              <label htmlFor="rememberMe" className="text-xs text-slate-400 cursor-pointer select-none">
                Remember my session on this computer
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In as {role === 'student' ? 'Student' : 'Faculty Member'}</span>
            </button>
          </form>

          {/* Registration Link */}
          <div className="pt-2 text-center text-xs text-slate-400">
            <span>New student without an account? </span>
            <button
              onClick={onSwitchToRegister}
              className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
            >
              <span>Register Here</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Reset Account Password</h3>
            <p className="text-xs text-slate-400">
              Enter your registered university email to receive a password recovery verification token.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-3">
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="name.reg@university.edu"
                className="w-full px-3.5 py-2.5 bg-slate-800 text-sm text-white rounded-xl border border-slate-700 focus:border-indigo-500 focus:outline-none"
                required
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
