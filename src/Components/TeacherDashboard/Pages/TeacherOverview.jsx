import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Clock, History, Calendar } from 'lucide-react';

const TeacherOverview = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('active'); // 'active' or 'history'

  const fetchMyCourses = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/course-offers/teacher/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOffers(res.data.data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const activeOffers = offers.filter(o => o.sessionId?.isActive === true);
  const historyOffers = offers.filter(o => o.sessionId?.isActive === false);

  const displayOffers = viewMode === 'active' ? activeOffers : historyOffers;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Teaching Portal</h1>
          <p className="text-slate-500 mt-1">Manage your classes, students, and attendance.</p>
        </div>
        <div className="flex bg-white rounded-lg shadow p-1 border">
          <button 
            onClick={() => setViewMode('active')}
            className={`px-4 py-2 rounded-md transition-all ${viewMode === 'active' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Active Courses
          </button>
          <button 
            onClick={() => setViewMode('history')}
            className={`px-4 py-2 rounded-md transition-all ${viewMode === 'history' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Teaching History
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayOffers.length > 0 ? displayOffers.map(offer => (
            <div key={offer._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-indigo-600 p-4 text-white">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded">
                    {offer.courseId?.courseCode}
                  </span>
                  <span className="text-xs font-medium">Sec {offer.section}</span>
                </div>
                <h3 className="text-lg font-bold mt-2 line-clamp-1">{offer.courseId?.courseName}</h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <Calendar size={18} className="text-indigo-500" />
                  <span className="text-sm font-medium">{offer.sessionId?.sessionName}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Users size={18} className="text-indigo-500" />
                  <span className="text-sm">{offer.enrolledCount} / {offer.maxSeats} Students Enrolled</span>
                </div>
                <div className="pt-4 flex gap-2">
                  <button 
                    onClick={() => navigate('/teacher/students')}
                    className="flex-1 bg-indigo-50 text-indigo-700 py-2 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors"
                  >
                    View Students
                  </button>
                  <button 
                    onClick={() => navigate('/teacher/attendance')}
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors"
                  >
                    Mark Attendance
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
              <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium text-lg">No {viewMode} courses found.</p>
              <p className="text-slate-400 text-sm mt-1">If this is an error, please contact the Admin office.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherOverview;
