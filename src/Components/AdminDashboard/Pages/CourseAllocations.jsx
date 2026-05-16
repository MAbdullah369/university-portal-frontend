import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CourseAllocations = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [sessions, setSessions] = useState([]);
  
  const [formData, setFormData] = useState({
    courseId: '',
    teacherId: '',
    sessionId: '',
    section: '',
    maxSeats: 40
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        const [cRes, tRes, sRes] = await Promise.all([
          axios.get('http://localhost:5000/api/courses', { headers }),
          axios.get('http://localhost:5000/api/teachers', { headers }),
          axios.get('http://localhost:5000/api/sessions', { headers })
        ]);
        
        setCourses(cRes.data.data);
        setTeachers(tRes.data.data);
        setSessions(sRes.data.data);
        
        // Auto-select active session if exists
        const activeSession = sRes.data.data.find(s => s.isActive);
        if (activeSession) {
          setFormData(prev => ({ ...prev, sessionId: activeSession._id }));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/course-offers', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Course successfully allocated!');
      setFormData({ ...formData, courseId: '', teacherId: '', section: '' }); // keep session and maxSeats
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to allocate course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Course Allocations</h1>
      
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200 max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Allocate Course to Teacher & Section</h2>
        
        {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
            <select name="sessionId" value={formData.sessionId} onChange={handleChange} required className="w-full border rounded p-2">
              <option value="">-- Select Session --</option>
              {sessions.map(s => (
                <option key={s._id} value={s._id}>{s.sessionName} {s.isActive ? '(Active)' : ''}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
            <select name="courseId" value={formData.courseId} onChange={handleChange} required className="w-full border rounded p-2">
              <option value="">-- Select Course --</option>
              {courses.map(c => (
                <option key={c._id} value={c._id}>{c.courseCode} - {c.courseName}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
            <select name="teacherId" value={formData.teacherId} onChange={handleChange} required className="w-full border rounded p-2">
              <option value="">-- Select Teacher --</option>
              {teachers.map(t => (
                <option key={t._id} value={t._id}>{t.fullName} ({t.department})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
            <input type="text" name="section" value={formData.section} onChange={handleChange} required className="w-full border rounded p-2" placeholder="e.g. A" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Seats</label>
            <input type="number" name="maxSeats" value={formData.maxSeats} onChange={handleChange} required className="w-full border rounded p-2" min="1" />
          </div>

          <div className="col-span-2 mt-4">
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Allocating...' : 'Allocate Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseAllocations;
