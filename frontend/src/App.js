import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import StudentJobs from './pages/StudentJobs';
import StudentApplications from './pages/StudentApplications';
import StudentProfile from './pages/StudentProfile';
import TPODashboard from './pages/TPODashboard';
import ManageJobs from './pages/ManageJobs';
import JobApplications from './pages/JobApplications';
import ManagementDashboard from './pages/ManagementDashboard';
import SuperAdmin from './pages/SuperAdmin';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
          {/* Student Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute allowedRoles={['student', 'tpo', 'management', 'superadmin']}>
              <StudentDashboard />
            </PrivateRoute>
          } />
          <Route path="/student/jobs" element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentJobs />
            </PrivateRoute>
          } />
          <Route path="/student/applications" element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentApplications />
            </PrivateRoute>
          } />
          <Route path="/student/profile" element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentProfile />
            </PrivateRoute>
          } />
          
          {/* TPO Routes */}
          <Route path="/tpo/dashboard" element={
            <PrivateRoute allowedRoles={['tpo', 'superadmin']}>
              <TPODashboard />
            </PrivateRoute>
          } />
          <Route path="/tpo/jobs" element={
            <PrivateRoute allowedRoles={['tpo', 'superadmin']}>
              <ManageJobs />
            </PrivateRoute>
          } />
          <Route path="/tpo/jobs/:jobId/applications" element={
            <PrivateRoute allowedRoles={['tpo', 'superadmin']}>
              <JobApplications />
            </PrivateRoute>
          } />
          
          {/* Management Routes */}
          <Route path="/management/dashboard" element={
            <PrivateRoute allowedRoles={['management', 'superadmin']}>
              <ManagementDashboard />
            </PrivateRoute>
          } />
          
          {/* Super Admin Routes */}
          <Route path="/superadmin" element={
            <PrivateRoute allowedRoles={['superadmin']}>
              <SuperAdmin />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;