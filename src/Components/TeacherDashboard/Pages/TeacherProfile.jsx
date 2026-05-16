import React, { useState, useEffect } from 'react';
import { User, Mail, Briefcase, Award, ShieldCheck, Lock } from 'lucide-react';

const TeacherProfile = () => {
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setTeacher(user);
  }, []);

  if (!teacher) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
        <p className="text-slate-500 mt-1">Manage your account and professional details.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-32 bg-indigo-600"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="bg-white p-2 rounded-2xl shadow-lg border">
              <div className="bg-indigo-100 p-8 rounded-xl text-indigo-600">
                <User size={64} />
              </div>
            </div>
            <div className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 mb-2">
              <ShieldCheck size={18} />
              Active Faculty
            </div>
          </div>

          <div className="space-y-1 mb-8">
            <h2 className="text-3xl font-bold text-slate-800">{teacher.fullName}</h2>
            <p className="text-indigo-600 font-semibold text-lg">{teacher.designation}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="bg-white p-3 rounded-lg shadow-sm text-slate-400">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                <p className="text-slate-700 font-medium">{teacher.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="bg-white p-3 rounded-lg shadow-sm text-slate-400">
                <Briefcase size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Department</p>
                <p className="text-slate-700 font-medium">{teacher.department}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="text-indigo-600" size={24} />
          <h3 className="text-xl font-bold text-slate-800">Security Settings</h3>
        </div>
        <div className="space-y-6 max-w-md">
          <p className="text-slate-500 text-sm">To change your password, please provide your current password followed by the new one.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Current Password</label>
              <input type="password" placeholder="••••••••" className="w-full border rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">New Password</label>
              <input type="password" placeholder="••••••••" className="w-full border rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-indigo-500" />
            </div>
            <button className="w-full bg-slate-800 text-white font-bold py-3 rounded-lg hover:bg-slate-900 transition shadow-md">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
