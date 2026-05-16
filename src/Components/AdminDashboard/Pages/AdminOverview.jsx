import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, GraduationCap, BookOpen, CalendarCheck } from 'lucide-react';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    activeSession: 'Loading...'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setStats(prev => ({ ...prev, activeSession: 'Error loading' }));
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Students', value: stats.students, icon: <Users size={32} className="text-blue-500" />, bg: 'bg-blue-50', border: 'border-blue-200' },
    { title: 'Total Teachers', value: stats.teachers, icon: <GraduationCap size={32} className="text-emerald-500" />, bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { title: 'Total Courses', value: stats.courses, icon: <BookOpen size={32} className="text-purple-500" />, bg: 'bg-purple-50', border: 'border-purple-200' },
    { title: 'Active Session', value: stats.activeSession, icon: <CalendarCheck size={32} className="text-orange-500" />, bg: 'bg-orange-50', border: 'border-orange-200', isText: true }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, idx) => (
          <div key={idx} className={`${card.bg} ${card.border} border p-6 rounded-xl shadow-sm flex items-center justify-between`}>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
              {loading ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <h3 className={`font-bold text-gray-800 ${card.isText ? 'text-xl' : 'text-3xl'}`}>
                  {card.value}
                </h3>
              )}
            </div>
            <div className="bg-white p-3 rounded-full shadow-sm">
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-xl shadow border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome to the Portal</h2>
        <p className="text-gray-600 mb-4 text-lg">
          Use the sidebar to navigate through the management modules. From here, you have full control over the university's academic structure:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
          <li><strong>Manage Students:</strong> Register new enrollments and view batched directories.</li>
          <li><strong>Manage Teachers:</strong> Add faculty members and track their assigned course loads.</li>
          <li><strong>Manage Courses:</strong> Maintain the university's central curriculum catalog.</li>
          <li><strong>Course Allocations:</strong> Tie it all together by assigning courses to teachers and sections for the active session.</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminOverview;
