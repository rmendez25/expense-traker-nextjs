'use client';

import { useState, type FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword && newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        name: name !== user?.name ? name : undefined,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });
      setMessage('Profile updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-lg font-bold text-white shadow-sm">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Profile</h1>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
        {error && (
          <div className="bg-rose-50 text-rose-700 text-sm p-3.5 rounded-xl border border-rose-100 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {message && (
          <div className="bg-emerald-50 text-emerald-700 text-sm p-3.5 rounded-xl border border-emerald-100 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {message}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
          />
        </div>

        <hr className="border-slate-100" />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
            placeholder="Leave blank to keep current"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
            placeholder="At least 6 characters"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
            placeholder="Repeat new password"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 shadow-sm"
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving...
            </span>
          ) : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
