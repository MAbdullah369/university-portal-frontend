import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, CalendarCheck, UserCircle, LogOut } from 'lucide-react';

const TeacherSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/');
  };

  const navItems = [
    { name: 'Overview', path: '/teacher', icon: <LayoutDashboard className="w-5 h-5" />, exact: true },
    { name: 'My Students', path: '/teacher/students', icon: <Users className="w-5 h-5" /> },
    { name: 'Attendance', path: '/teacher/attendance', icon: <CalendarCheck className="w-5 h-5" /> },
    { name: 'My Profile', path: '/teacher/profile', icon: <UserCircle className="w-5 h-5" /> },
  ];

  return (
    <div className="w-64 bg-indigo-900 text-white h-full flex flex-col shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-wider">Teacher Portal</h2>
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
                    isActive ? 'bg-indigo-600 text-white' : 'text-indigo-300 hover:bg-indigo-800 hover:text-white'
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
      <div className="p-4 border-t border-indigo-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-md text-red-300 hover:bg-indigo-800 hover:text-red-200 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default TeacherSidebar;
