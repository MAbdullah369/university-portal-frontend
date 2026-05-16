import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Briefcase, BookOpen, X, Filter } from 'lucide-react';

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [offers, setOffers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showActiveSessionOnly, setShowActiveSessionOnly] = useState(true);

  const [formData, setFormData] = useState({
    fullName: '', password: '', department: '', designation: 'Lecturer',
    assignments: [{ courseId: '', section: 'A' }, { courseId: '', section: 'B' }]
  });
  const [courses, setCourses] = useState([]);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in again.');
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };
      const [tRes, oRes, sRes, cRes] = await Promise.all([
        axios.get('http://localhost:5000/api/teachers', { headers }),
        axios.get('http://localhost:5000/api/course-offers', { headers }),
        axios.get('http://localhost:5000/api/sessions', { headers }),
        axios.get('http://localhost:5000/api/courses', { headers })
      ]);
      
      const sortedTeachers = (tRes.data.data || []).sort((a, b) => a.fullName.localeCompare(b.fullName));
      setTeachers(sortedTeachers);
      setOffers(oRes.data.data || []);
      setSessions(sRes.data.data || []);
      setCourses(cRes.data.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.response?.data?.message || 'Failed to load teacher data. Please ensure you are logged in correctly.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const activeSessionId = sessions.find(s => s.isActive)?._id;
  
  const getTeacherOffers = (teacherId) => {
    return offers.filter(o => {
      const oTeacherId = o.teacherId?._id || o.teacherId;
      if (oTeacherId !== teacherId) return false;
      if (showActiveSessionOnly && activeSessionId) {
        const oSessionId = o.sessionId?._id || o.sessionId;
        return oSessionId === activeSessionId;
      }
      return true;
    });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true); setMessage(''); setError('');
    
    // Client-side validation: Check for duplicate course-section pairs in the form itself
    const pairs = formData.assignments.map(a => `${a.courseId}-${a.section}`);
    if (new Set(pairs).size !== pairs.length) {
      setError('You have selected the same course and section multiple times in the form.');
      setFormLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/teachers', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Teacher added successfully!');
      setFormData({ 
        fullName: '', password: '', department: '', designation: 'Lecturer',
        assignments: [{ courseId: '', section: 'A' }, { courseId: '', section: 'B' }]
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add teacher');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="relative">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Teachers</h1>
      
      {/* Add Form */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-8 max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Add New Teacher</h2>
        {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full border rounded p-2" placeholder="e.g., Tariq Mahmood" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="text" name="password" value={formData.password} onChange={handleChange} required className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input type="text" name="department" value={formData.department} onChange={handleChange} required className="w-full border rounded p-2" placeholder="e.g., Computer Science" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
            <select name="designation" value={formData.designation} onChange={handleChange} className="w-full border rounded p-2">
              <option value="Lecturer">Lecturer</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Professor">Professor</option>
            </select>
          </div>
          
          <div className="col-span-2 border-t pt-4 mt-2">
            <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Initial Course Assignments (Min 2)</h3>
            {formData.assignments.map((assignment, index) => (
              <div key={index} className="flex gap-3 mb-3 items-end bg-slate-50 p-3 rounded border">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Course</label>
                  <select 
                    value={assignment.courseId}
                    onChange={(e) => {
                      const newAssignments = [...formData.assignments];
                      newAssignments[index].courseId = e.target.value;
                      setFormData({ ...formData, assignments: newAssignments });
                    }}
                    required
                    className="w-full border rounded p-2 text-sm"
                  >
                    <option value="">Select Course</option>
                    {courses.map(c => (
                      <option key={c._id} value={c._id}>{c.courseCode} - {c.courseName}</option>
                    ))}
                  </select>
                </div>
                <div className="w-24">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Section</label>
                  <select 
                    value={assignment.section}
                    onChange={(e) => {
                      const newAssignments = [...formData.assignments];
                      newAssignments[index].section = e.target.value;
                      setFormData({ ...formData, assignments: newAssignments });
                    }}
                    className="w-full border rounded p-2 text-sm"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                  </select>
                </div>
                {formData.assignments.length > 2 && (
                  <button 
                    type="button" 
                    onClick={() => {
                      const newAssignments = formData.assignments.filter((_, i) => i !== index);
                      setFormData({ ...formData, assignments: newAssignments });
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button"
              onClick={() => setFormData({ ...formData, assignments: [...formData.assignments, { courseId: '', section: 'A' }] })}
              className="text-blue-600 text-sm font-bold hover:underline mt-2"
            >
              + Add Another Course
            </button>
          </div>

          <div className="col-span-2 mt-4">
            <button type="submit" disabled={formLoading} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded hover:bg-blue-700 disabled:opacity-50 shadow-md">
              {formLoading ? 'Adding...' : 'Add Teacher & Allocate Courses'}
            </button>
          </div>
        </form>
      </div>

      {/* Teachers List */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Teacher Directory</h2>
        <button 
          onClick={() => setShowActiveSessionOnly(!showActiveSessionOnly)}
          className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-md font-medium transition-colors"
        >
          <Filter size={18} />
          {showActiveSessionOnly ? 'Showing: Active Session Only' : 'Showing: All Time Courses'}
        </button>
      </div>

      {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">{error}</div>}

      {loading ? <p>Loading directory...</p> : (
        <div className="grid grid-cols-1 gap-4">
          {teachers.map(teacher => {
            const tOffers = getTeacherOffers(teacher._id);
            return (
              <div 
                key={teacher._id} 
                onClick={() => setSelectedTeacher(teacher)}
                className="bg-white p-5 rounded-lg shadow border border-gray-200 cursor-pointer hover:border-blue-500 hover:shadow-md transition"
              >
                <div className="flex items-center gap-4 border-b pb-3 mb-3">
                  <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{teacher.fullName}</h3>
                    <p className="text-sm text-gray-500">{teacher.designation} - {teacher.department}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Assigned Courses ({tOffers.length})</h4>
                  {tOffers.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {tOffers.map(o => (
                        <span key={o._id} className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded border border-slate-200">
                          {o.courseId?.courseCode || 'Unknown'} - Sec {o.section}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No courses assigned in this view.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold">Teacher Profile</h2>
              <button onClick={() => setSelectedTeacher(null)} className="text-white hover:text-gray-200">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="flex items-center gap-4 border-b pb-4 mb-4">
                <div className="bg-indigo-100 p-4 rounded-full text-indigo-600">
                  <User size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{selectedTeacher.fullName}</h3>
                  <p className="text-indigo-600 font-medium">{selectedTeacher.designation}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="text-gray-400" size={18} />
                  <span>{selectedTeacher.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Briefcase className="text-gray-400" size={18} />
                  <span>{selectedTeacher.department}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <BookOpen size={20} className="text-indigo-600" />
                    Course Allocations
                  </h4>
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {showActiveSessionOnly ? 'Active Session' : 'All Time'}
                  </span>
                </div>
                
                <div className="overflow-hidden border rounded-lg">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b">
                      <tr>
                        <th className="px-4 py-2 font-semibold text-gray-700">Course</th>
                        <th className="px-4 py-2 font-semibold text-gray-700">Section</th>
                        <th className="px-4 py-2 font-semibold text-gray-700">Session</th>
                        <th className="px-4 py-2 font-semibold text-gray-700 text-center">Seats</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getTeacherOffers(selectedTeacher._id).map((offer, idx) => (
                        <tr key={offer._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="px-4 py-3 font-medium text-gray-800">
                            {offer.courseId?.courseCode} - {offer.courseId?.courseName}
                          </td>
                          <td className="px-4 py-3">{offer.section}</td>
                          <td className="px-4 py-3 text-gray-600">{offer.sessionId?.sessionName || 'Unknown'}</td>
                          <td className="px-4 py-3 text-center">{offer.maxSeats}</td>
                        </tr>
                      ))}
                      {getTeacherOffers(selectedTeacher._id).length === 0 && (
                        <tr>
                          <td colSpan="4" className="px-4 py-6 text-center text-gray-500 italic">
                            No courses assigned.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTeachers;
