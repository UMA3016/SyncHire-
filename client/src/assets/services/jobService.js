import API from './api';

/**
 * Fetch all jobs, optionally filtered by search term and job type.
 * @param {string} search - Search keyword for title/company/location
 * @param {string} type - Job type filter (Full-time, Part-time, Remote, Internship)
 * @returns {Promise<Array>} List of job objects
 */
export const getAllJobs = async (search = '', type = '') => {
  const params = {};
  if (search) params.search = search;
  if (type) params.type = type;

  const response = await API.get('/jobs', { params });
  return response.data;
};

/**
 * Fetch all jobs for the logged-in recruiter (includes archived).
 * @returns {Promise<Array>} List of job objects
 */
export const getRecruiterJobs = async () => {
  const response = await API.get('/jobs/recruiter/me');
  return response.data;
};

/**
 * Fetch a single job by its ID.
 * @param {string} id - Job ID
 * @returns {Promise<Object>} Job object
 */
export const getJobById = async (id) => {
  const response = await API.get(`/jobs/${id}`);
  return response.data;
};

/**
 * Create a new job posting.
 * @param {Object} jobData - { title, company, location, type, salary, description }
 * @returns {Promise<Object>} Created job object
 */
export const createJob = async (jobData) => {
  const response = await API.post('/jobs', jobData);
  return response.data;
};

/**
 * Update an existing job posting.
 * @param {string} id - Job ID
 * @param {Object} jobData - Fields to update
 * @returns {Promise<Object>} Updated job object
 */
export const updateJob = async (id, jobData) => {
  const response = await API.put(`/jobs/${id}`, jobData);
  return response.data;
};

/**
 * Delete a job posting.
 * @param {string} id - Job ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteJob = async (id) => {
  const response = await API.delete(`/jobs/${id}`);
  return response.data;
};

/**
 * Restore an archived job posting.
 * @param {string} id - Job ID
 * @returns {Promise<Object>} Restore confirmation
 */
export const restoreJob = async (id) => {
  const response = await API.put(`/jobs/${id}/restore`);
  return response.data;
};

/**
 * Apply to a job posting.
 * @param {string} jobId - Job ID
 * @returns {Promise<Object>} Application confirmation
 */
export const applyToJob = async (jobId) => {
  const response = await API.post('/applications', { jobId });
  return response.data;
};

/**
 * Load demo data for a new recruiter.
 * @returns {Promise<Object>} Success message
 */
export const loadDemoData = async () => {
  const response = await API.post('/jobs/load-demo-data');
  return response.data;
};

