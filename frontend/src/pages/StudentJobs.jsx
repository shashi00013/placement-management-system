import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const StudentJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/student/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await api.get('/student/applications');
      const applied = new Set(response.data.map(app => app.jobId._id));
      setAppliedJobs(applied);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await api.post(`/student/jobs/${jobId}/apply`);
      toast.success('Application submitted successfully');
      setAppliedJobs(new Set([...appliedJobs, jobId]));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Available Job Openings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
              <p className="text-gray-600 mb-2">{job.company}</p>
              <p className="text-gray-700 mb-2">{job.location}</p>
              <p className="text-green-600 font-semibold mb-2">Package: {job.package}</p>
              <p className="text-sm text-gray-500 mb-4">Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{job.description}</p>
              
              <button
                onClick={() => handleApply(job._id)}
                disabled={appliedJobs.has(job._id)}
                className={`w-full py-2 px-4 rounded-md ${
                  appliedJobs.has(job._id)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white font-semibold transition`}
              >
                {appliedJobs.has(job._id) ? 'Applied' : 'Apply Now'}
              </button>
            </div>
          ))}
        </div>
        
        {jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No job openings available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentJobs;