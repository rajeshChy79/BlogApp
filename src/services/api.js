import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'https://blogapp-mzev.onrender.com') + '/api';
console.log("api url:",API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ add this
});


// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/auth/password', passwordData),
};

// Blog API
export const blogAPI = {
  getPosts: (params = {}) => api.get('/blogs', { params }),
  getPost: (id) => api.get(`/blogs/${id}`),
  createPost: (postData) => api.post('/blogs', postData),
  updatePost: (id, postData) => api.put(`/blogs/${id}`, postData),
  deletePost: (id) => api.delete(`/blogs/${id}`),
  likePost: (id) => api.put(`/blogs/${id}/like`),
  bookmarkPost: (id) => api.put(`/blogs/${id}/bookmark`),
  getBookmarkedPosts: (params = {}) => api.get('/blogs/bookmarks', { params }),
};

// Comment API
export const commentAPI = {
  getComments: (blogId, params = {}) => api.get(`/blogs/${blogId}/comments`, { params }),
  createComment: (blogId, commentData) => api.post(`/blogs/${blogId}/comments`, commentData),
  updateComment: (id, commentData) => api.put(`/comments/${id}`, commentData),
  deleteComment: (id) => api.delete(`/comments/${id}`),
  likeComment: (id) => api.put(`/comments/${id}/like`),
};

// User API
export const userAPI = {
  getUsers: (params = {}) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  getUserPosts: (id, params = {}) => api.get(`/users/${id}/posts`, { params }),
  getUserStats: (id) => api.get(`/users/${id}/stats`),
};

export default api;
