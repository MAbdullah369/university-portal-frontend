import React from 'react';
import { Outlet } from 'react-router-dom';
import TeacherSidebar from './TeacherSidebar';

const TeacherDashboard = () => {
  return (
    <div className="flex bg-slate-50 h-screen overflow-hidden">
      <TeacherSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
