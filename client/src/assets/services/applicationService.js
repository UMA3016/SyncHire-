// services/applicationService.js
import api from './api';

/** POST /api/applications — One-click apply */
export const applyForJob = async (jobId) => {
  const response = await api.post('/applications', { jobId });
  return response.data;
};

/** GET /api/applications/job/:jobId — Recruiter: get all applications for a job */
export const getApplicationsByJob = async (jobId) => {
  const response = await api.get(`/applications/job/${jobId}`);
  return response.data;
};

/** PUT /api/applications/:id/status — Recruiter: update candidate status */
export const updateApplicationStatus = async (applicationId, status, interviewDetails = {}) => {
  const response = await api.put(`/applications/${applicationId}/status`, { 
    status, 
    ...interviewDetails 
  });
  return response.data;
};

export const parseResume = async (applicationId) => {
  const response = await api.post(`/applications/${applicationId}/parse-resume`);
  return response.data;
};

/** GET /api/applications/my-pipeline — Candidate: get own pipeline */
export const getMyPipeline = async () => {
  const response = await api.get('/applications/my-pipeline');
  return response.data;
};
