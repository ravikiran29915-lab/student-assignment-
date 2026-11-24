import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, ArrowLeft, CheckCircle2, AlertCircle, UserPlus, Eye, EyeOff } from 'lucide-react';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin }) => {
  const { register } = useApp();

  const [fullName, setFullName] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Department of Computer Applications');
  const [course, setCourse] = useState('Master of Computer Applications (MCA)');
  const [yearOfStudy, setYearOfStudy] = useState('1st Year (Semester I)');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!registerNumber.trim()) {
      setErrorMsg('Please enter your official Student ID / Register Number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid academic email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    const success = register({
      name: fullName.trim(),
      registerNumber: registerNumber.trim().toUpperCase(),
      email: email.trim(),
      department,
      course,
      yearOfStudy,
    });

    if (!success) {
      setErrorMsg('Registration could not be completed. Please check your inputs.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/25">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Student Registration</h2>
              <p className="text-xs text-slate-400">Student Assignment Manager · Department of Computer Applications</p>
            </div>
          </div>
          <button
            onClick={onSwitchToLogin}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </button>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Siddharth Menon"
                className="w-full px-3.5 py-2.5 bg-slate-900 text-sm text-white rounded-xl border border-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>

            {/* Student ID / Register Number */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Student ID / Register No.</label>
              <input
                type="text"
                value={registerNumber}
                onChange={(e) => setRegisterNumber(e.target.value)}
                placeholder="e.g. MCA2024-088"
                className="w-full px-3.5 py-2.5 bg-slate-900 text-sm text-white rounded-xl border border-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Institutional Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. siddharth.mca24@university.edu"
              className="w-full px-3.5 py-2.5 bg-slate-900 text-sm text-white rounded-xl border border-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Department */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 text-xs text-white rounded-xl border border-slate-700 focus:border-indigo-500 focus:outline-none"
              >
                <option value="Department of Computer Applications">Computer Applications (MCA)</option>
                <option value="Department of Computer Science & Engineering">Computer Science (CSE)</option>
                <option value="Department of Information Technology">Information Tech (IT)</option>
              </select>
            </div>

            {/* Course / Degree */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Course / Degree</label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 text-xs text-white rounded-xl border border-slate-700 focus:border-indigo-500 focus:outline-none"
              >
                <option value="Master of Computer Applications (MCA)">Master of Computer Applications</option>
                <option value="M.Tech in Software Engineering">M.Tech Software Engineering</option>
                <option value="M.Sc Computer Science">M.Sc Computer Science</option>
              </select>
            </div>

            {/* Year of Study */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Year of Study</label>
              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 text-xs text-white rounded-xl border border-slate-700 focus:border-indigo-500 focus:outline-none"
              >
                <option value="1st Year (Semester I)">1st Year (Semester I)</option>
                <option value="1st Year (Semester II)">1st Year (Semester II)</option>
                <option value="2nd Year (Semester III)">2nd Year (Semester III)</option>
                <option value="2nd Year (Semester IV)">2nd Year (Semester IV)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Create Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-900 text-sm text-white rounded-xl border border-slate-700 focus:border-indigo-500 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-3.5 py-2.5 bg-slate-900 text-sm text-white rounded-xl border border-slate-700 focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Guidelines note */}
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            By creating an account, you agree to abide by the university academic honor code. Submissions are subject to automated plagiarism detection.
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Complete Registration & Access Student Portal</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <button
            onClick={onSwitchToLogin}
            className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Sign in to existing account
          </button>
        </div>
      </div>
    </div>
  );
};
