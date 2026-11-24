import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Mail,
  GraduationCap,
  Calendar,
  Phone,
  Shield,
  KeyRound,
  Edit2,
  CheckCircle2,
  LogOut,
  Sparkles,
  Camera,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateUserProfile, logout, addToast } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  if (!currentUser) return null;

  const isTeacher = currentUser.role === 'teacher';

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      bio,
    });
    setIsEditing(false);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass || !confirmPass) {
      addToast('All password fields are required.', 'error');
      return;
    }
    if (newPass.length < 6) {
      addToast('New password must have at least 6 characters.', 'error');
      return;
    }
    if (newPass !== confirmPass) {
      addToast('New passwords do not match.', 'error');
      return;
    }

    setIsPasswordModalOpen(false);
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    addToast('Account password updated successfully!', 'success');
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Account Profile</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your personal academic records, communication preferences, and security
          </p>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 relative">
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider">
            {isTeacher ? 'Faculty Member' : 'Enrolled Student'}
          </div>
        </div>

        {/* Content body */}
        <div className="px-6 pb-8 pt-0 relative space-y-6">
          {/* Avatar and Primary Info */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-12">
            <div className="flex items-end gap-4">
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white shadow-xl bg-slate-100"
                />
              </div>

              <div className="space-y-1 mb-1">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {currentUser.name}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                  <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {isTeacher ? currentUser.teacherId : currentUser.registerNumber}
                  </span>
                  <span>·</span>
                  <span>{currentUser.department}</span>
                </div>
              </div>
            </div>

            {/* Edit Profile trigger */}
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3.5 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="profile-form"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </div>

          {/* Bio statement */}
          {!isEditing && currentUser.bio && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed italic">
              "{currentUser.bio}"
            </div>
          )}

          {/* Form / Details grid */}
          <form id="profile-form" onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                    required
                  />
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-900">
                    {currentUser.name}
                  </div>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                    required
                  />
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-900">
                    {currentUser.email}
                  </div>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Academic Department
                </label>
                <div className="p-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-900">
                  {currentUser.department}
                </div>
              </div>

              {/* Role Specific Info */}
              {isTeacher ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Faculty Designation
                  </label>
                  <div className="p-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-900">
                    {currentUser.designation || 'Professor'}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Degree & Year of Study
                  </label>
                  <div className="p-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-900">
                    {currentUser.course} · {currentUser.yearOfStudy}
                  </div>
                </div>
              )}

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Contact Phone
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-900">
                    {currentUser.phone || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Joined Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Enrolled / Joined Since
                </label>
                <div className="p-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-900">
                  {currentUser.joinedDate}
                </div>
              </div>
            </div>

            {/* Editable Bio if editing */}
            {isEditing && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Academic Focus & Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
            )}
          </form>

          {/* Security & Password Section */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Account Security & Credentials</h3>
              <p className="text-xs text-slate-500">Update your account password or review session tokens</p>
            </div>

            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <KeyRound className="w-4 h-4 text-slate-600" />
              <span>Change Password</span>
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Change Account Password</h3>
            <p className="text-xs text-slate-500">
              Provide your current password followed by your chosen new secure credentials.
            </p>

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">New Password</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-3.5 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
