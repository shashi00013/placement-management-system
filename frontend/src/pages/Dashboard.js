import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ applications: 0, selected: 0, pending: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/student/applications');
      const apps = response.data;
      setStats({
        applications: apps.length,
        selected: apps.filter(a => a.status === 'selected' || a.status === 'offer_letter_generated').length,
        pending: apps.filter(a => a.status === 'applied' || a.status === 'shortlisted').length,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const getRoleBasedNav = () => {
    switch(user?.role) {
      case 'student':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button onClick={() => navigate('/student/jobs')} className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600">
              View Available Jobs
            </button>
            <button onClick={() => navigate('/student/applications')} className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600">
              My Applications
            </button>
            <button onClick={() => navigate('/student/profile')} className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600">
              Update Profile
            </button>
          </div>
        );
      case 'tpo':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button onClick={() => navigate('/tpo/jobs')} className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600">
              Manage Jobs
            </button>
            <button onClick={() => navigate('/tpo/dashboard')} className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600">
              View Applications
            </button>
          </div>
        );
      case 'management':
        return (
          <button onClick={() => navigate('/management/dashboard')} className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 mb-8">
            View Analytics Dashboard
          </button>
        );
      case 'superadmin':
        return (
          <button onClick={() => navigate('/superadmin')} className="bg-red-500 text-white p-4 rounded-lg hover:bg-red-600 mb-8">
            System Administration
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Placement Management System</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.name}</span>
            <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          <p className="text-gray-600">Role: {user?.role?.toUpperCase()}</p>
        </div>
        
        {getRoleBasedNav()}
        
        {user?.role === 'student' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">Total Applications</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.applications}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">Selected</h3>
              <p className="text-3xl font-bold text-green-600">{stats.selected}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">In Progress</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;