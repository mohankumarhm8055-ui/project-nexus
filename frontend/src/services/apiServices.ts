import type { AxiosResponse } from 'axios';
import api from './api';

type ApiEnvelope<T = unknown> = {
  success?: boolean;
  message?: string;
  data?: T;
  pagination?: unknown;
};

export type NormalizedApiResponse<T = unknown> = {
  data: T;
  message?: string;
  pagination?: unknown;
  success?: boolean;
};

const normalizeApiResponse = <T = unknown>(response: AxiosResponse<ApiEnvelope<T> | T>): NormalizedApiResponse<T> => {
  const body = response.data as ApiEnvelope<T>;
  if (body && typeof body === 'object' && 'data' in body) {
    return {
      data: body.data as T,
      message: body.message,
      pagination: body.pagination,
      success: body.success,
    };
  }

  return { data: response.data as T };
};

export const authAPI = {
  login: (data: { email?: string; identifier?: string; password: string }) =>
    api.post('/auth/login', data).then(normalizeApiResponse),
  me: () => api.get('/auth/me').then(normalizeApiResponse),
  logout: (refreshToken?: string) => api.post('/auth/logout', { refreshToken }).then(normalizeApiResponse),
};

export const studentAPI = {
  getAll: (params?: Record<string, unknown>) => api.get('/students', { params }).then(normalizeApiResponse),
  getById: (id: string) => api.get(`/students/${id}`).then(normalizeApiResponse),
  attendanceSummary: (id: string, params?: Record<string, unknown>) =>
    api.get(`/students/${id}/attendance-summary`, { params }).then(normalizeApiResponse),
  marksSummary: (id: string, params?: Record<string, unknown>) =>
    api.get(`/students/${id}/marks-summary`, { params }).then(normalizeApiResponse),
  aiAnalytics: (id: string) => api.get(`/students/${id}/ai-analytics`).then(normalizeApiResponse),
};

export const attendanceAPI = {
  mark: (data: unknown) => api.post('/attendance/mark', data).then(normalizeApiResponse),
  studentSummary: (id: string, params?: Record<string, unknown>) =>
    api.get(`/attendance/student/${id}`, { params }).then(normalizeApiResponse),
  heatmap: (id: string, days = 30) =>
    api.get(`/attendance/student/${id}/heatmap`, { params: { days } }).then(normalizeApiResponse),
  monthlyTrend: (id: string) =>
    api.get(`/attendance/student/${id}/monthly-trend`).then(normalizeApiResponse),
  department: (params: Record<string, unknown>) =>
    api.get('/attendance/department', { params }).then(normalizeApiResponse),
  lowRisk: (params: Record<string, unknown>) =>
    api.get('/attendance/low-risk', { params }).then(normalizeApiResponse),
};

export const marksAPI = {
  upload: (data: unknown) => api.post('/marks/upload', data).then(normalizeApiResponse),
  student: (id: string, params?: Record<string, unknown>) =>
    api.get(`/marks/student/${id}`, { params }).then(normalizeApiResponse),
  gradeReport: (id: string) => api.get(`/marks/grade-report/${id}`).then(normalizeApiResponse),
  publish: (marksIds: string[]) => api.post('/marks/publish', { marksIds }).then(normalizeApiResponse),
};

export const hodAPI = {
  dashboard: () => api.get('/hod/dashboard').then(normalizeApiResponse),
  weakStudents: () => api.get('/hod/weak-students').then(normalizeApiResponse),
  facultyStatus: () => api.get('/hod/faculty-status').then(normalizeApiResponse),
  analytics: () => api.get('/hod/analytics').then(normalizeApiResponse),
  triggerAI: () => api.post('/hod/trigger-ai').then(normalizeApiResponse),
};

export const parentAPI = {
  profile: () => api.get('/parent/profile').then(normalizeApiResponse),
  childOverview: (studentId: string) =>
    api.get(`/parent/child/${studentId}/overview`).then(normalizeApiResponse),
  childAttendance: (studentId: string) =>
    api.get(`/parent/child/${studentId}/attendance`).then(normalizeApiResponse),
  childMarks: (studentId: string) =>
    api.get(`/parent/child/${studentId}/marks`).then(normalizeApiResponse),
  notifications: (params?: Record<string, unknown>) =>
    api.get('/parent/notifications', { params }).then(normalizeApiResponse),
};

export const placementAPI = {
  companies: (params?: Record<string, unknown>) =>
    api.get('/placement/companies', { params }).then(normalizeApiResponse),
  stats: () => api.get('/placement/stats').then(normalizeApiResponse),
  drive: (id: string) => api.get(`/placement/drives/${id}`).then(normalizeApiResponse),
  apply: (driveId: string, studentId: string) =>
    api.post(`/placement/drives/${driveId}/apply`, { studentId }).then(normalizeApiResponse),
};

export const adminAPI = {
  dashboard: () => api.get('/admin/dashboard').then(normalizeApiResponse),
  users: (params?: Record<string, unknown>) => api.get('/admin/users', { params }).then(normalizeApiResponse),
  auditLogs: (params?: Record<string, unknown>) => api.get('/admin/audit-logs', { params }).then(normalizeApiResponse),
  departments: () => api.get('/admin/departments').then(normalizeApiResponse),
};

export const facultyAPI = {
  getAll: () => api.get('/faculty').then(normalizeApiResponse),
  me: () => api.get('/faculty/me').then(normalizeApiResponse),
  getById: (id: string) => api.get(`/faculty/${id}`).then(normalizeApiResponse),
};

export const aiAPI = {
  studentRisk: (id: string) => api.get(`/ai/student/${id}/risk`).then(normalizeApiResponse),
  recommendations: (id: string) => api.get(`/ai/student/${id}/recommendations`).then(normalizeApiResponse),
  deptTrends: (department: string) =>
    api.get('/ai/department/trends', { params: { department } }).then(normalizeApiResponse),
  analyze: (data: { studentId?: string; departmentId?: string }) =>
    api.post('/ai/analyze', data).then(normalizeApiResponse),
};

export const notificationAPI = {
  list: (params?: Record<string, unknown>) =>
    api.get('/notifications', { params }).then(normalizeApiResponse),
  markRead: (ids: string[]) => api.put('/notifications/read', { ids }).then(normalizeApiResponse),
  markAllRead: () => api.put('/notifications/read-all').then(normalizeApiResponse),
};
