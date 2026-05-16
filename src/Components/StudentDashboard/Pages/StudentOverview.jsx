import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, GraduationCap, Calendar, Clock } from 'lucide-react';

const StudentOverview = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        setStudent(user);

        const res = await axios.get(`http://localhost:5000/api/enrollments/student/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEnrollments(res.data.data);
      } catch (err) {
        console.error("Failed to fetch enrollments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome, {student?.fullName}!</h1>
          <p className="text-slate-500 mt-1">Here is an overview of your current academic session.</p>
        </div>
        <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
          <GraduationCap size={20} />
          {student?.degree} - Semester {student?.semester}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
              <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          ))
        ) : enrollments.length > 0 ? (
          enrollments.map((enrollment) => (
            <div key={enrollment._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-emerald-600 p-4 text-white">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded">
                    {enrollment.courseOfferId?.courseId?.courseCode}
                  </span>
                  <span className="text-xs font-medium">Sec {enrollment.courseOfferId?.section}</span>
                </div>
                <h3 className="text-lg font-bold mt-2 line-clamp-1">{enrollment.courseOfferId?.courseId?.courseName}</h3>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                  <Calendar size={16} className="text-emerald-500" />
                  <span>{enrollment.sessionId?.sessionName}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                  <Clock size={16} className="text-emerald-500" />
                  <span>{enrollment.courseOfferId?.courseId?.creditHours} Credit Hours</span>
                </div>
                <div className="pt-4 border-t flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">Instructor</span>
                  <span className="text-sm font-semibold text-slate-700">{enrollment.courseOfferId?.teacherId?.fullName}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
            <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="font-medium text-lg">No active enrollments found.</p>
            <p className="text-sm mt-1">Please contact the administration if you believe this is an error.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentOverview;
