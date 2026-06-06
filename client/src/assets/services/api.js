/**
 * api.js — Native Fetch API wrapper replacing Axios.
 * Provides get, post, put, delete methods with automatic
 * token injection and JSON parsing.
 */
const BASE_URL = 'http://localhost:5000/api';

const getHeaders = (isFormData = false) => {
  const headers = {};
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';
  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || 'Request failed');
    error.response = { data, status: res.status };
    throw error;
  }
  return { data };
};

const API = {
  get: async (url, { params } = {}) => {
    let fullUrl = `${BASE_URL}${url}`;
    if (params) {
      const query = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v))
      ).toString();
      if (query) fullUrl += `?${query}`;
    }
    const res = await fetch(fullUrl, { headers: getHeaders() });
    return handleResponse(res);
  },

  post: async (url, body, options = {}) => {
    const isFormData = body instanceof FormData;
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: getHeaders(isFormData),
      body: isFormData ? body : JSON.stringify(body),
    });
    return handleResponse(res);
  },

  put: async (url, body) => {
    const isFormData = body instanceof FormData;
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'PUT',
      headers: getHeaders(isFormData),
      body: isFormData ? body : JSON.stringify(body),
    });
    return handleResponse(res);
  },

  delete: async (url) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};

export default API;
