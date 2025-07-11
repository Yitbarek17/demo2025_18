import axios from 'axios';
import { Project, Metadata, User } from '../types';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://demo2025-18.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include user info for RBAC
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.id && user.role) {
    config.params = {
      ...config.params,
      userId: user.id,
      userRole: user.role
    };
  }
  return config;
});

// Project API calls
export const fetchProjects = async (): Promise<Project[]> => {
  const response = await api.get('/projects');
  return response.data;
};

export const forgetPassword = async(email: string) => {
  const response = await api.post('/users/forget-password', {
    email: email
  });
  return response.data
}
export const fetchMetadata = async (): Promise<Metadata> => {
  const response = await api.get('/metadata');
  return response.data;
};

export const createProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
  const response = await api.post('/projects', project);
  return response.data;
};

export const updateProject = async (id: string, project: Partial<Project>): Promise<Project> => {
  const response = await api.put(`/projects/${id}`, project);
  return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/projects/${id}`);
};

// User API calls
export const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get('/users');
  return response.data;
};

export const createUser = async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
  const response = await api.post('/users', user);
  return response.data;
};

export const updateUser = async (id: string, user: Partial<User>): Promise<User> => {
  const response = await api.put(`/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};

export const loginUser = async (username: string, password: string): Promise<User> => {
  const response = await api.post('/users/login', { username, password });
  return response.data;
};

export const resetPassword = async({ email, resetToken, password, tokenId }: { email: string, resetToken: string, password: string, tokenId: string }) => {
  const response = await api.post('/users/reset-password', {
    email,
    resetToken,
    password,
    tokenId
  });
  return response.data;
}