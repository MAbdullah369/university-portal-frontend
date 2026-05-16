import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Users, GraduationCap, BookOpen, Calendar, BookCheck, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <BookOpen className="w-5 h-5" />, exact: true },
    { name: 'Manage Students', path: '/admin/students', icon: <Users className="w-5 h-5" /> },
    { name: 'Manage Teachers', path: '/admin/teachers', icon: <GraduationCap className="w-5 h-5" /> },
    { name: 'Manage Courses', path: '/admin/courses', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Manage Sessions', path: '/admin/sessions', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Course Allocations', path: '/admin/allocations', icon: <BookCheck className="w-5 h-5" /> },
  ];

  return (
    <div className="w-64 bg-slate-800 text-white h-full flex flex-col shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-wider">Admin Portal</h2>
      </div>
      <nav className="flex-1 mt-6">
        <ul className="space-y-2 px-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                    isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`
                }
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-md text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
