import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: [],
    eligibilityCriteria: { minCgpa: 6, allowedBranches: [] },
    location: '',
    package: '',
    openings: 1,
    deadline: '',
    status: 'open',
  });
  const [requirementInput, setRequirementInput] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/tpo/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addRequirement = () => {
    if (requirementInput) {
      setFormData({ ...formData, requirements: [...formData.requirements, requirementInput] });
      setRequirementInput('');
    }
  };

  const removeRequirement = (index) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData({ ...formData, requirements: newRequirements });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJob) {
        await api.put(`/tpo/jobs/${editingJob._id}`, formData);
        toast.success('Job updated successfully');
      } else {
        await api.post('/tpo/jobs', formData);
        toast.success('Job created successfully');
      }
      fetchJobs();
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save job');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await api.delete(`/tpo/jobs/${id}`);
        toast.success('Job deleted successfully');
        fetchJobs();
      } catch (error) {
        toast.error('Failed to delete job');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      description: '',
      requirements: [],
      eligibilityCriteria: { minCgpa: 6, allowedBranches: [] },
      location: '',
      package: '',
      openings: 1,
      deadline: '',
      status: 'open',
    });
    setEditingJob(null);
  };

  const editJob = (job) => {
    setEditingJob(job);
    setFormData(job);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Jobs</h2>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Post New Job
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{job.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{job.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{job.package}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(job.deadline).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button onClick={() => editJob(job)} className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button onClick={() => handleDelete(job._id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Modal for Create/Edit Job */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{editingJob ? 'Edit Job' : 'Create New Job'}</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">×</button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Job Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
                <input
                  type="text"
                  name="company"
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Job Description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-md"
                />
                <div>
                  <label className="block text-sm font-medium mb-1">Requirements</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={requirementInput}
                      onChange={(e) => setRequirementInput(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md"
                      placeholder="Add requirement"
                    />
                    <button type="button" onClick={addRequirement} className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.requirements.map((req, idx) => (
                      <span key={idx} className="bg-gray-200 px-2 py-1 rounded text-sm">
                        {req}
                        <button type="button" onClick={() => removeRequirement(idx)} className="ml-2 text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                </div>
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="text"
                  name="package"
                  placeholder="Package (e.g., 10 LPA)"
                  value={formData.package}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="number"
                  name="openings"
                  placeholder="Number of Openings"
                  value={formData.openings}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline?.split('T')[0]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
                
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-md hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    {editingJob ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageJobs;