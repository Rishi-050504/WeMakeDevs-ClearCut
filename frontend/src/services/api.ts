import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/api/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  
  logout: () =>
    api.post('/api/auth/logout'),
};

// Document APIs
export const documentAPI = {
  analyze: (data: {
    fileName: string;
    mimeType: string;
    rawText: string;
    docType: 'Legal' | 'Medical' | 'Business' | 'General';
  }) =>
    api.post('/api/documents/analyze', data),
  
  getAll: (page = 1, limit = 10) =>
    api.get(`/api/documents?page=${page}&limit=${limit}`),
  
  getById: (id: string) =>
    api.get(`/api/documents/${id}`),
  
  delete: (id: string) =>
    api.delete(`/api/documents/${id}`),
};

// Chat APIs
export const chatAPI = {
  send: (data: { documentId: string; message: string }) =>
    api.post('/api/chat', data),
  
  stream: (data: { documentId: string; message: string }) =>
    api.post('/api/chat/stream', data, {
      headers: {
        'Accept': 'text/event-stream',
      },
      responseType: 'stream',
    }),
  
  getHistory: (documentId: string) =>
    api.get(`/api/chat/${documentId}`),
};

// Analysis APIs
export const analysisAPI = {
  compliance: (data: { documentId: string; standards: string[] }) =>
    api.post('/api/analysis/compliance', data),
  
  entities: (data: { documentId: string }) =>
    api.post('/api/analysis/entities', data),
  
  timeline: (data: { documentId: string }) =>
    api.post('/api/analysis/timeline', data),
  
  verifyClaim: (data: { documentId: string; claim: string }) =>
    api.post('/api/verify/claim', data),
};

export default api;