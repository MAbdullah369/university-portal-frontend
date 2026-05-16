import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Hash, BookOpen, X } from 'lucide-react';

const MyStudents = () => {
  const [offers, setOffers] = useState([]);
  const [selectedOfferId, setSelectedOfferId] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchMyOffers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/course-offers/teacher/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const activeOffers = res.data.data.filter(o => o.sessionId?.isActive);
      setOffers(activeOffers);
      if (activeOffers.length > 0) setSelectedOfferId(activeOffers[0]._id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (offerId) => {
    if (!offerId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/enrollments/offer/${offerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data.data.map(enrollment => enrollment.studentId));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchMyOffers(); }, []);
  useEffect(() => { if (selectedOfferId) fetchStudents(selectedOfferId); }, [selectedOfferId]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Students</h1>
          <p className="text-slate-500 mt-1">View the roster of students enrolled in your classes.</p>
        </div>
        <div className="w-80">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Select Course</label>
          <select 
            value={selectedOfferId}
            onChange={(e) => setSelectedOfferId(e.target.value)}
            className="w-full border rounded-lg p-2.5 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            {offers.map(o => (
              <option key={o._id} value={o._id}>{o.courseId?.courseCode} - {o.courseId?.courseName} (Sec {o.section})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b">
            <tr>
              <th className="px-6 py-4">Student Name</th>
              <th className="px-6 py-4">Roll Number</th>
              <th className="px-6 py-4">Email Address</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.length > 0 ? students.map(student => (
              <tr key={student._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                      {student.fullName?.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-700">{student.fullName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold border">
                    {student.rollNumber}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm">{student.email}</td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => setSelectedStudent(student)}
                    className="text-indigo-600 font-bold text-sm hover:underline"
                  >
                    View Profile
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic">
                  {loading ? 'Loading student list...' : 'No students enrolled in this section yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="bg-indigo-600 h-24 relative">
              <button 
                onClick={() => setSelectedStudent(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/20 p-1.5 rounded-full backdrop-blur-md transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-8 pb-8">
              <div className="relative flex justify-center -mt-12 mb-6">
                <div className="bg-white p-2 rounded-2xl shadow-lg border">
                  <div className="bg-indigo-100 p-6 rounded-xl text-indigo-600 font-black text-3xl">
                    {selectedStudent.fullName?.charAt(0)}
                  </div>
                </div>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-800">{selectedStudent.fullName}</h3>
                <p className="text-indigo-600 font-semibold">{selectedStudent.rollNumber}</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Degree</span>
                  <span className="text-slate-700 font-bold">{selectedStudent.degree}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Email Address</span>
                  <span className="text-slate-700 font-medium">{selectedStudent.email}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Batch</span>
                  <span className="text-slate-700 font-bold">20{selectedStudent.batchYear}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Semester</span>
                  <span className="text-slate-700 font-bold">{selectedStudent.semester} (Sec {selectedStudent.section})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyStudents;
