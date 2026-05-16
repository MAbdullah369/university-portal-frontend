import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CalendarCheck, PieChart, Info, CheckCircle2, XCircle, Clock } from 'lucide-react';

const StudentAttendance = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [selectedOfferId, setSelectedOfferId] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchLoading, setFetchLoading] = useState(false);

  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/enrollments/student/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const active = res.data.data;
      setEnrollments(active);
      if (active.length > 0) {
        setSelectedOfferId(active[0].courseOfferId?._id);
      }
    } catch (err) {
      console.error("Error fetching enrollments:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async (offerId) => {
    if (!offerId) return;
    setFetchLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/attendance/course?courseOfferId=${offerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter attendance records specifically for THIS student
      const user = JSON.parse(localStorage.getItem('user'));
      const myRecords = res.data.data.filter(r => (r.studentId?._id || r.studentId) === user._id);
      setAttendance(myRecords.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      console.error("Error fetching attendance:", err);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { if (selectedOfferId) fetchAttendance(selectedOfferId); }, [selectedOfferId]);

  const stats = {
    present: attendance.filter(r => r.status === 'Present').length,
    absent: attendance.filter(r => r.status === 'Absent').length,
    late: attendance.filter(r => r.status === 'Late').length,
    total: attendance.length
  };

  const attendancePercentage = stats.total > 0 ? ((stats.present + (stats.late * 0.5)) / stats.total * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Attendance</h1>
          <p className="text-slate-500 mt-1">Track your presence and attendance percentage for each course.</p>
        </div>
        <div className="w-80">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Select Course</label>
          <select 
            value={selectedOfferId}
            onChange={(e) => setSelectedOfferId(e.target.value)}
            className="w-full border rounded-lg p-2.5 bg-white shadow-sm focus:ring-2 focus:ring-emerald-500"
          >
            {enrollments.map(e => (
              <option key={e._id} value={e.courseOfferId?._id}>
                {e.courseOfferId?.courseId?.courseCode} - {e.courseOfferId?.courseId?.courseName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-8 border-emerald-100 text-emerald-600 mb-4">
              <span className="text-2xl font-bold">{attendancePercentage}%</span>
            </div>
            <h3 className="font-bold text-slate-800">Attendance Rate</h3>
            <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-wider">Overall Status</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
              <PieChart size={18} className="text-emerald-500" />
              Summary
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center text-slate-600">
                <span>Present</span>
                <span className="font-bold text-emerald-600">{stats.present}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Absent</span>
                <span className="font-bold text-red-600">{stats.absent}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Late</span>
                <span className="font-bold text-yellow-600">{stats.late}</span>
              </div>
              <div className="pt-3 border-t flex justify-between items-center font-bold text-slate-800">
                <span>Total Classes</span>
                <span>{stats.total}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-slate-700">Detailed Attendance History</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b">
                <tr>
                  <th className="px-6 py-4 text-center">No.</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Session Info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fetchLoading ? (
                  <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400">Loading records...</td></tr>
                ) : attendance.length > 0 ? (
                  attendance.map((record, idx) => (
                    <tr key={record._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-center text-slate-400 text-sm font-medium">{attendance.length - idx}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Clock size={16} className="text-slate-300" />
                          <span className="font-semibold text-slate-700">{new Date(record.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          record.status === 'Present' ? 'bg-emerald-100 text-emerald-700' :
                          record.status === 'Absent' ? 'bg-red-100 text-red-700' :
                          record.status === 'Late' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {record.status === 'Present' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 italic">
                        Class {attendance.length - idx} of the session
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic">
                      No attendance records found for this course.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
