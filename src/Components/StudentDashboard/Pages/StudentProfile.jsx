import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, GraduationCap, MapPin, CreditCard, ShieldCheck, Hash, Calendar, Info } from 'lucide-react';

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userJson = localStorage.getItem('user');
        if (!userJson) {
          setLoading(false);
          return;
        }

        const user = JSON.parse(userJson);
        const token = localStorage.getItem('token');
        
        if (!user || !user._id) {
          setLoading(false);
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/students/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudent(res.data.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        const userJson = localStorage.getItem('user');
        if (userJson) setStudent(JSON.parse(userJson));
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );
  if (!student) return <div className="text-center p-12 text-slate-500">Student data not found. Please log in again.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Student Profile</h1>
        <p className="text-slate-500 mt-1">Detailed information about your academic identity.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-32 bg-emerald-600"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="bg-white p-2 rounded-2xl shadow-lg border">
              <div className="bg-emerald-100 p-8 rounded-xl text-emerald-600 font-black text-4xl">
                {student?.fullName?.charAt(0) || 'S'}
              </div>
            </div>
            <div className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 mb-2">
              <ShieldCheck size={18} />
              Current Student
            </div>
          </div>

          <div className="space-y-1 mb-8">
            <h2 className="text-3xl font-bold text-slate-800">{student?.fullName}</h2>
            <div className="flex items-center gap-2 text-emerald-600 font-semibold text-lg">
              <GraduationCap size={20} />
              <span>{student?.degree} Program</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t">
            <div className="flex flex-col gap-1 p-4 bg-slate-50 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Roll Number</span>
              <span className="text-slate-800 font-bold flex items-center gap-2">
                <Hash size={16} className="text-emerald-500" />
                {student?.rollNumber}
              </span>
            </div>
            <div className="flex flex-col gap-1 p-4 bg-slate-50 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Semester</span>
              <span className="text-slate-800 font-bold flex items-center gap-2">
                <Calendar size={16} className="text-emerald-500" />
                {student?.semester}
              </span>
            </div>
            <div className="flex flex-col gap-1 p-4 bg-slate-50 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Section</span>
              <span className="text-slate-800 font-bold flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                  {student?.section}
                </div>
                Section {student?.section}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
            <Info className="text-emerald-500" size={20} />
            Personal Details
          </h3>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-slate-50 text-slate-400">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Email Address</p>
                <p className="text-slate-700 font-medium">{student?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-slate-50 text-slate-400">
                <CreditCard size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">CNIC / ID Number</p>
                <p className="text-slate-700 font-medium">{student?.cnic}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
            <MapPin className="text-emerald-500" size={20} />
            Academic Standing
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
              <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Batch Year</p>
              <p className="text-2xl font-bold text-emerald-900">20{student?.batchYear}</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Status</p>
              <p className="text-xl font-bold text-slate-700">Regular Student</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
