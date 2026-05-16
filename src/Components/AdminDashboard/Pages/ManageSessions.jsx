import React, { useState } from 'react';
import axios from 'axios';

const ManageSessions = () => {
  const [formData, setFormData] = useState({
    sessionName: '',
    startDate: '',
    endDate: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/sessions', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Session created successfully!');
      setFormData({
        sessionName: '', startDate: '', endDate: '', isActive: true
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Sessions</h1>
      
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200 max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Create New Session</h2>
        
        {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Session Name</label>
            <input type="text" name="sessionName" value={formData.sessionName} onChange={handleChange} required className="w-full border rounded p-2" placeholder="e.g. Fall 2026" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="w-full border rounded p-2" />
          </div>

          <div className="col-span-2 flex items-center mt-2">
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} id="active" className="mr-2 h-4 w-4" />
            <label htmlFor="active" className="text-sm font-medium text-gray-700">Set as Active Session (will deactivate others)</label>
          </div>

          <div className="col-span-2 mt-4">
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageSessions;
