import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Hash, Book, Calendar, X } from 'lucide-react';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '', degree: 'BSCS', batchYear: '26', password: '', cnic: '', section: 'A'
  });
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeBatch, setActiveBatch] = useState('26');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveBatch = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/sessions');
      const active = res.data.data.find(s => s.isActive);
      if (active) {
        const yearMatch = active.sessionName.match(/\d{4}/);
        if (yearMatch) {
          const yearShort = yearMatch[0].substring(2);
          setActiveBatch(yearShort);
          setFormData(prev => ({ ...prev, batchYear: yearShort }));
        }
      }
    } catch (err) {
      console.error("Failed to fetch active batch:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchActiveBatch();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true); setMessage(''); setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/students/register', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(`Added successfully! Roll No: ${response.data.data.rollNumber} | Email: ${response.data.data.email}`);
      setFormData({ fullName: '', degree: 'BSCS', batchYear: activeBatch, password: '', cnic: '', section: 'A' });
      fetchStudents(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add student');
    } finally {
      setFormLoading(false);
    }
  };

  // Group students
  const groupedStudents = students.reduce((acc, student) => {
    const year = student.batchYear || 'Unknown';
    const section = student.section || 'Unassigned';
    if (!acc[year]) acc[year] = {};
    if (!acc[year][section]) acc[year][section] = [];
    acc[year][section].push(student);
    return acc;
  }, {});

  const sortedYears = Object.keys(groupedStudents).sort((a, b) => b - a);

  return (
    <div className="relative">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Students</h1>
      
      {/* Add Form */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-8 max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Add New Student</h2>
        {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
            <select name="degree" value={formData.degree} onChange={handleChange} className="w-full border rounded p-2">
              <option value="BSCS">Computer Science (BSCS)</option>
              <option value="BSAI">Artificial Intelligence (BSAI)</option>
              <option value="BSEE">Electrical Engineering (BSEE)</option>
              <option value="BBA">Business Admin (BBA)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Batch Year (e.g., 26)</label>
            <input type="number" name="batchYear" value={formData.batchYear} onChange={handleChange} required className="w-full border rounded p-2" min="20" max="99" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="text" name="password" value={formData.password} onChange={handleChange} required className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CNIC</label>
            <input type="text" name="cnic" value={formData.cnic} onChange={handleChange} placeholder="12345-1234567-1" className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
            <input type="text" name="section" value={formData.section} onChange={handleChange} required className="w-full border rounded p-2 uppercase" />
          </div>
          <div className="col-span-2 mt-2">
            <button type="submit" disabled={formLoading} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50">
              {formLoading ? 'Adding...' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>

      {/* Grouped List */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Student Directory</h2>
      {loading ? <p>Loading directory...</p> : (
        <div className="space-y-6">
          {sortedYears.map(year => (
            <div key={year} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
              <div className="bg-slate-800 text-white px-4 py-3">
                <h3 className="text-lg font-bold">Batch 20{year}</h3>
              </div>
              <div className="p-4 space-y-6">
                {Object.keys(groupedStudents[year]).sort().map(section => (
                  <div key={section}>
                    <h4 className="text-md font-semibold text-slate-700 border-b pb-2 mb-3">Section {section}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {groupedStudents[year][section].map(student => (
                        <div 
                          key={student._id} 
                          onClick={() => setSelectedStudent(student)}
                          className="p-3 border rounded-lg cursor-pointer hover:border-blue-500 hover:shadow-md transition bg-slate-50 flex items-center gap-3"
                        >
                          <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                            <User size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{student.fullName}</p>
                            <p className="text-sm text-gray-500">{student.rollNumber}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Student Profile</h2>
              <button onClick={() => setSelectedStudent(null)} className="text-white hover:text-gray-200">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 border-b pb-4">
                <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                  <User size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{selectedStudent.fullName}</h3>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-semibold mt-1">
                    {selectedStudent.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-gray-700">
                  <Hash className="text-gray-400" size={18} />
                  <span className="font-medium w-24">Roll Number:</span> 
                  <span>{selectedStudent.rollNumber}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="text-gray-400" size={18} />
                  <span className="font-medium w-24">Email:</span> 
                  <span>{selectedStudent.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Book className="text-gray-400" size={18} />
                  <span className="font-medium w-24">Degree:</span> 
                  <span>{selectedStudent.degree}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="text-gray-400" size={18} />
                  <span className="font-medium w-24">Semester:</span> 
                  <span>{selectedStudent.semester} (Section {selectedStudent.section})</span>
                </div>
                {selectedStudent.cnic && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <User className="text-gray-400" size={18} />
                    <span className="font-medium w-24">CNIC:</span> 
                    <span>{selectedStudent.cnic}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
