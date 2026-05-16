import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, School } from 'lucide-react';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student' // default
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let endpoint = '';
      if (formData.role === 'admin') endpoint = 'https://university-portal-backend-beryl.vercel.app/api/admin/login';
      else if (formData.role === 'teacher') endpoint = 'https://university-portal-backend-beryl.vercel.app/api/teachers/login';
      else endpoint = 'https://university-portal-backend-beryl.vercel.app/api/students/login';

      const response = await axios.post(endpoint, {
        email: formData.email,
        password: formData.password
      });

      const userData = response.data.data || response.data.user;
      const token = response.data.token || (response.data.data && response.data.data.token);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('role', formData.role);

      navigate(`/${formData.role}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side: Visual Branding */}
        <div className="md:w-1/2 bg-gradient-to-br from-indigo-700 to-emerald-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 rounded-full border-8 border-white"></div>
            <div className="absolute bottom-[-5%] right-[-5%] w-96 h-96 rounded-full border-8 border-white"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                <School size={32} />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase">ITU Portal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Empowering the <br />
              <span className="text-emerald-300">Future</span> of Education.
            </h1>
            <p className="text-indigo-100 text-lg max-w-sm">
              Your gateway to academic excellence, seamless management, and interactive learning.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-6 text-sm font-medium text-indigo-100 mt-12 md:mt-0">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-indigo-400 flex items-center justify-center text-xs font-bold">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <span>Join 5,000+ students and faculty today.</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                {error}
              </div>
            )}

            {/* Role Selector */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-xl">
              {['student', 'teacher', 'admin'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: r })}
                  className={`py-2 px-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    formData.role === r 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="name@itu.edu.pk"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-700">Password</label>
                  <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Forgot Password?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 text-sm">
            Don't have an account? <span className="text-indigo-600 font-bold cursor-pointer hover:underline">Contact Admin</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;