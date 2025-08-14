import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const api = axios.create();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || error.message || 'Request failed';
    toast.error(message);
    return Promise.reject(error);
  }
);

// Auth
export const register = (payload) => api.post('/api/users/register', payload);
export const login = (payload) => api.post('/api/users/login', payload);

// Jobs
export const getJobs = (params = {}) => api.get('/api/jobs', { params });
export const createJob = (payload) => api.post('/api/jobs', payload);
export const applyForJob = (jobId, formData) => api.post(`/api/jobs/${jobId}/apply`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

// Applications
export const getMyApplications = (params = {}) => api.get('/api/jobs/applications/me', { params });
export const getRecruiterApplications = (params = {}) => api.get('/api/jobs/recruiter/applications', { params });
export const getRecruiterJobApplications = (jobId) => api.get(`/api/jobs/recruiter/applications/${jobId}`);
export const updateApplicationStatus = (applicationId, payload) => api.patch(`/api/jobs/applications/${applicationId}/status`, payload);

export default api;