import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen } from 'lucide-react';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    courseCode: '', courseName: '', creditHours: 3, offeredBy: '', description: '', isElective: false
  });
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true); setMessage(''); setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/courses', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Course added successfully!');
      setFormData({ courseCode: '', courseName: '', creditHours: 3, offeredBy: '', description: '', isElective: false });
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add course');
    } finally {
      setFormLoading(false);
    }
  };

  // Group courses by Department
  const groupedCourses = courses.reduce((acc, course) => {
    const dept = course.offeredBy || 'General';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(course);
    return acc;
  }, {});

  const sortedDepts = Object.keys(groupedCourses).sort();

  return (
    <div className="relative">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Courses</h1>
      
      {/* Add Form */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200 max-w-2xl mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Course</h2>
        {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
            <input type="text" name="courseCode" value={formData.courseCode} onChange={handleChange} required className="w-full border rounded p-2 uppercase" placeholder="e.g. CS-101" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Credit Hours</label>
            <input type="number" name="creditHours" value={formData.creditHours} onChange={handleChange} required className="w-full border rounded p-2" min="1" max="4" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
            <input type="text" name="courseName" value={formData.courseName} onChange={handleChange} required className="w-full border rounded p-2" placeholder="e.g. Introduction to Programming" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Offered By (Degree/Department)</label>
            <input type="text" name="offeredBy" value={formData.offeredBy} onChange={handleChange} required className="w-full border rounded p-2" placeholder="e.g. Computer Science" />
          </div>
          <div className="col-span-2 flex items-center mt-2">
            <input type="checkbox" name="isElective" checked={formData.isElective} onChange={handleChange} id="elective" className="mr-2 h-4 w-4" />
            <label htmlFor="elective" className="text-sm font-medium text-gray-700">This is an Elective Course</label>
          </div>
          <div className="col-span-2 mt-4">
            <button type="submit" disabled={formLoading} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50">
              {formLoading ? 'Adding...' : 'Add Course'}
            </button>
          </div>
        </form>
      </div>

      {/* Course List */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Course Directory</h2>
      {loading ? <p>Loading directory...</p> : (
        <div className="space-y-6">
          {sortedDepts.map(dept => (
            <div key={dept} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
              <div className="bg-emerald-700 text-white px-4 py-3 flex items-center gap-2">
                <BookOpen size={20} />
                <h3 className="text-lg font-bold">{dept} Department</h3>
              </div>
              <div className="p-0">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-gray-700">Course Code</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Course Name</th>
                      <th className="px-4 py-3 font-semibold text-gray-700 text-center">Credit Hours</th>
                      <th className="px-4 py-3 font-semibold text-gray-700 text-center">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedCourses[dept].sort((a,b) => a.courseCode.localeCompare(b.courseCode)).map((course, idx) => (
                      <tr key={course._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="px-4 py-3 font-bold text-gray-800">{course.courseCode}</td>
                        <td className="px-4 py-3 text-gray-700">{course.courseName}</td>
                        <td className="px-4 py-3 text-center">{course.creditHours}</td>
                        <td className="px-4 py-3 text-center">
                          {course.isElective ? 
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">Elective</span> : 
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">Core</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageCourses;
