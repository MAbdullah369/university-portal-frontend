import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, CreditCard, UserCircle, LogOut, BookOpen } from 'lucide-react';

const StudentSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/student', icon: <LayoutDashboard className="w-5 h-5" />, exact: true },
    { name: 'My Attendance', path: '/student/attendance', icon: <CalendarCheck className="w-5 h-5" /> },
    { name: 'Fee Details', path: '/student/fees', icon: <CreditCard className="w-5 h-5" /> },
    { name: 'Profile', path: '/student/profile', icon: <UserCircle className="w-5 h-5" /> },
  ];

  return (
    <div className="w-64 bg-emerald-900 text-white h-full flex flex-col shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-wider">Student Portal</h2>
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
                    isActive ? 'bg-emerald-600 text-white' : 'text-emerald-300 hover:bg-emerald-800 hover:text-white'
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
      <div className="p-4 border-t border-emerald-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-md text-red-300 hover:bg-emerald-800 hover:text-red-200 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;
