import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle, XCircle, Clock, Save, AlertCircle } from 'lucide-react';

const AttendanceSheet = () => {
  const [offers, setOffers] = useState([]);
  const [selectedOfferId, setSelectedOfferId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { studentId: 'Present' | 'Absent' }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchMyOffers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/course-offers/teacher/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const activeOnly = res.data.data.filter(o => o.sessionId?.isActive);
      setOffers(activeOnly);
      if (activeOnly.length > 0) {
        setSelectedOfferId(activeOnly[0]._id);
      }
    } catch (err) {
      console.error("Failed to fetch offers:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClassList = async (offerId) => {
    if (!offerId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/enrollments/offer/${offerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const classList = res.data.data.map(e => e.studentId);
      setStudents(classList);
      
      // Check for existing attendance for this date
      const attRes = await axios.get(`http://localhost:5000/api/attendance/course?courseOfferId=${offerId}&date=${date}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const existing = {};
      attRes.data.data.forEach(a => {
        existing[a.studentId?._id || a.studentId] = a.status;
      });
      
      // Merge: default to Present for those not in existing
      const initial = {};
      classList.forEach(s => {
        initial[s._id] = existing[s._id] || 'Present';
      });
      setAttendance(initial);
    } catch (err) {
      console.error("Failed to fetch class list/attendance:", err);
    }
  };

  useEffect(() => { fetchMyOffers(); }, []);

  useEffect(() => {
    if (selectedOfferId && date) {
      fetchClassList(selectedOfferId);
    }
  }, [selectedOfferId, date]);

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    setSaving(true); setMessage('');
    try {
      const token = localStorage.getItem('token');
      const selectedOffer = offers.find(o => o._id === selectedOfferId);
      
      const attendanceData = Object.keys(attendance).map(sId => ({
        studentId: sId,
        status: attendance[sId]
      }));

      await axios.post('http://localhost:5000/api/attendance/bulk', {
        courseOfferId: selectedOfferId,
        sessionId: selectedOffer.sessionId?._id || selectedOffer.sessionId,
        date,
        attendanceData
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Attendance saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error saving attendance: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-6 items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Mark Attendance</h1>
          <p className="text-slate-500 mt-1">Select a class and date to track student presence.</p>
        </div>
        <div className="flex gap-4">
          <div className="w-64">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Class Section</label>
            <select 
              value={selectedOfferId}
              onChange={(e) => setSelectedOfferId(e.target.value)}
              className="w-full border rounded-lg p-2 bg-white"
            >
              {offers.map(o => (
                <option key={o._id} value={o._id}>{o.courseId?.courseCode} (Sec {o.section})</option>
              ))}
            </select>
          </div>
          <div className="w-48">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-lg p-2 bg-white"
            />
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.includes('Error') ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold border-b">
              <tr>
                <th className="px-6 py-4">Student Info</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map(student => (
                <tr key={student._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{student.fullName}</span>
                      <span className="text-xs text-slate-500">{student.rollNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-4">
                      {['Present', 'Absent', 'Late', 'Leave'].map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(student._id, status)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                            attendance[student._id] === status
                              ? status === 'Present' ? 'bg-green-600 text-white border-green-600 shadow-sm' :
                                status === 'Absent' ? 'bg-red-600 text-white border-red-600 shadow-sm' :
                                status === 'Late' ? 'bg-yellow-500 text-white border-yellow-500 shadow-sm' :
                                'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan="2" className="px-6 py-12 text-center text-slate-500 italic">No students in this section.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {students.length > 0 && (
          <div className="p-4 bg-slate-50 border-t flex justify-end">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-indigo-600 text-white px-8 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition shadow-md disabled:opacity-50"
            >
              {saving ? 'Saving...' : (
                <>
                  <Save size={20} />
                  Save Attendance
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceSheet;
