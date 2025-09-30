import axios from 'axios';
import type { User, FreelancerProfile, Job, Payment, AuthResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (data: { name: string; email: string; password: string; role: string }) =>
    api.post<AuthResponse>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),
  getProfile: () => api.get<User>('/auth/profile'),
};

export const freelancers = {
  getAll: (params?: { category?: string; isAvailable?: boolean; search?: string }) =>
    api.get<FreelancerProfile[]>('/freelancers', { params }),
  getById: (id: string) => api.get<FreelancerProfile>(`/freelancers/${id}`),
  create: (data: Partial<FreelancerProfile>) => api.post<FreelancerProfile>('/freelancers', data),
  update: (id: string, data: Partial<FreelancerProfile>) =>
    api.put<FreelancerProfile>(`/freelancers/${id}`, data),
  uploadMedia: (id: string, formData: FormData) =>
    api.post<FreelancerProfile>(`/freelancers/${id}/media`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const jobs = {
  getAll: (params?: { status?: string; role?: string }) =>
    api.get<Job[]>('/jobs', { params }),
  getById: (id: string) => api.get<Job>(`/jobs/${id}`),
  create: (data: Partial<Job>) => api.post<Job>('/jobs', data),
  update: (id: string, data: Partial<Job>) => api.put<Job>(`/jobs/${id}`, data),
  updateStatus: (id: string, status: string) => api.patch<Job>(`/jobs/${id}/status`, { status }),
};

export const payments = {
  create: (jobId: string, data: { amount: number; receiptEmail?: string }) =>
    api.post<Payment>(`/payments/${jobId}`, data),
  getByJob: (jobId: string) => api.get<Payment>(`/payments/job/${jobId}`),
};

export const admin = {
  getAllUsers: () => api.get<User[]>('/admin/users'),
  banUser: (userId: string) => api.patch(`/admin/users/${userId}/ban`),
  unbanUser: (userId: string) => api.patch(`/admin/users/${userId}/unban`),
  approveFreelancer: (profileId: string) =>
    api.patch(`/admin/freelancers/${profileId}/approve`),
};

export default api;