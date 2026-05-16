import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signin from './Components/SIgnIn/SignIn';
import Adduser from './Components/Adduser/Adduser';
import ProtectedRoute from './Components/ProtectedRoute';

// Dashboards
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';
import StudentDashboard from './Components/StudentDashboard/StudentDashboard';
import TeacherDashboard from './Components/TeacherDashboard/TeacherDashboard';

// Admin Sub-pages
import AdminOverview from './Components/AdminDashboard/Pages/AdminOverview';
import ManageStudents from './Components/AdminDashboard/Pages/ManageStudents';
import ManageTeachers from './Components/AdminDashboard/Pages/ManageTeachers';
import ManageCourses from './Components/AdminDashboard/Pages/ManageCourses';
import ManageSessions from './Components/AdminDashboard/Pages/ManageSessions';
import CourseAllocations from './Components/AdminDashboard/Pages/CourseAllocations';

// Teacher Sub-pages
import TeacherOverview from './Components/TeacherDashboard/Pages/TeacherOverview';
import MyStudents from './Components/TeacherDashboard/Pages/MyStudents';
import AttendanceSheet from './Components/TeacherDashboard/Pages/AttendanceSheet';
import TeacherProfile from './Components/TeacherDashboard/Pages/TeacherProfile';

// Student Sub-pages
import StudentOverview from './Components/StudentDashboard/Pages/StudentOverview';
import StudentAttendance from './Components/StudentDashboard/Pages/StudentAttendance';
import StudentProfile from './Components/StudentDashboard/Pages/StudentProfile';
import StudentFees from './Components/StudentDashboard/Pages/StudentFees';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/adduser" element={<Adduser />} />
        
        {/* Protected Admin Section */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<AdminOverview />} />
            <Route path="students" element={<ManageStudents />} />
            <Route path="teachers" element={<ManageTeachers />} />
            <Route path="courses" element={<ManageCourses />} />
            <Route path="sessions" element={<ManageSessions />} />
            <Route path="allocations" element={<CourseAllocations />} />
          </Route>
        </Route>

        {/* Protected Student Section */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/student" element={<StudentDashboard />}>
            <Route index element={<StudentOverview />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="fees" element={<StudentFees />} />
          </Route>
        </Route>

        {/* Protected Teacher Section */}
        <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
          <Route path="/teacher" element={<TeacherDashboard />}>
            <Route index element={<TeacherOverview />} />
            <Route path="students" element={<MyStudents />} />
            <Route path="attendance" element={<AttendanceSheet />} />
            <Route path="profile" element={<TeacherProfile />} />
          </Route>
        </Route>
        
        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;