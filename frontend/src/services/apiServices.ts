import api from './api';

// ── Auth ───────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (data: { email?: string; identifier?: string; password: string }) =>
    api.post('/auth/login', data).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
  logout: (refreshToken?: string) => api.post('/auth/logout', { refreshToken }),
};

// ── Student ────────────────────────────────────────────────────────────────
export const studentAPI = {
  getAll: (params?: Record<string, unknown>) => api.get('/students', { params }).then((r) => r.data),
  getById: (id: string) => api.get(`/students/${id}`).then((r) => r.data),
  attendanceSummary: (id: string, params?: Record<string, unknown>) =>
    api.get(`/students/${id}/attendance-summary`, { params }).then((r) => r.data),
  marksSummary: (id: string, params?: Record<string, unknown>) =>
    api.get(`/students/${id}/marks-summary`, { params }).then((r) => r.data),
  aiAnalytics: (id: string) => api.get(`/students/${id}/ai-analytics`).then((r) => r.data),
};

// ── Attendance ─────────────────────────────────────────────────────────────
export const attendanceAPI = {
  mark: (data: unknown) => api.post('/attendance/mark', data).then((r) => r.data),
  studentSummary: (id: string, params?: Record<string, unknown>) =>
    api.get(`/attendance/student/${id}`, { params }).then((r) => r.data),
  heatmap: (id: string, days = 30) =>
    api.get(`/attendance/student/${id}/heatmap`, { params: { days } }).then((r) => r.data),
  monthlyTrend: (id: string) =>
    api.get(`/attendance/student/${id}/monthly-trend`).then((r) => r.data),
  department: (params: Record<string, unknown>) =>
    api.get('/attendance/department', { params }).then((r) => r.data),
  lowRisk: (params: Record<string, unknown>) =>
    api.get('/attendance/low-risk', { params }).then((r) => r.data),
};

// ── Marks ──────────────────────────────────────────────────────────────────
export const marksAPI = {
  upload: (data: unknown) => api.post('/marks/upload', data).then((r) => r.data),
  student: (id: string, params?: Record<string, unknown>) =>
    api.get(`/marks/student/${id}`, { params }).then((r) => r.data),
  gradeReport: (id: string) => api.get(`/marks/grade-report/${id}`).then((r) => r.data),
  publish: (marksIds: string[]) => api.post('/marks/publish', { marksIds }).then((r) => r.data),
};

// ── HOD ───────────────────────────────────────────────────────────────────
export const hodAPI = {
  dashboard: () => api.get('/hod/dashboard').then((r) => r.data),
  weakStudents: () => api.get('/hod/weak-students').then((r) => r.data),
  facultyStatus: () => api.get('/hod/faculty-status').then((r) => r.data),
  analytics: () => api.get('/hod/analytics').then((r) => r.data),
  triggerAI: () => api.post('/hod/trigger-ai').then((r) => r.data),
};

// ── Parent ────────────────────────────────────────────────────────────────
export const parentAPI = {
  profile: () => api.get('/parent/profile').then((r) => r.data),
  childOverview: (studentId: string) =>
    api.get(`/parent/child/${studentId}/overview`).then((r) => r.data),
  childAttendance: (studentId: string) =>
    api.get(`/parent/child/${studentId}/attendance`).then((r) => r.data),
  childMarks: (studentId: string) =>
    api.get(`/parent/child/${studentId}/marks`).then((r) => r.data),
  notifications: (params?: Record<string, unknown>) =>
    api.get('/parent/notifications', { params }).then((r) => r.data),
};

// ── Placement ─────────────────────────────────────────────────────────────
export const placementAPI = {
  companies: (params?: Record<string, unknown>) =>
    api.get('/placement/companies', { params }).then((r) => r.data),
  stats: () => api.get('/placement/stats').then((r) => r.data),
  drive: (id: string) => api.get(`/placement/drives/${id}`).then((r) => r.data),
  apply: (driveId: string, studentId: string) =>
    api.post(`/placement/drives/${driveId}/apply`, { studentId }).then((r) => r.data),
};

// ── Admin ─────────────────────────────────────────────────────────────────
export const adminAPI = {
  dashboard: () => api.get('/admin/dashboard').then((r) => r.data),
  users: (params?: Record<string, unknown>) => api.get('/admin/users', { params }).then((r) => r.data),
  auditLogs: (params?: Record<string, unknown>) => api.get('/admin/audit-logs', { params }).then((r) => r.data),
  departments: () => api.get('/admin/departments').then((r) => r.data),
};

// ── AI ────────────────────────────────────────────────────────────────────
export const aiAPI = {
  studentRisk: (id: string) => api.get(`/ai/student/${id}/risk`).then((r) => r.data),
  recommendations: (id: string) => api.get(`/ai/student/${id}/recommendations`).then((r) => r.data),
  deptTrends: (department: string) =>
    api.get('/ai/department/trends', { params: { department } }).then((r) => r.data),
  analyze: (data: { studentId?: string; departmentId?: string }) =>
    api.post('/ai/analyze', data).then((r) => r.data),
};

// ── Notifications ─────────────────────────────────────────────────────────
export const notificationAPI = {
  list: (params?: Record<string, unknown>) =>
    api.get('/notifications', { params }).then((r) => r.data),
  markRead: (ids: string[]) => api.put('/notifications/read', { ids }).then((r) => r.data),
  markAllRead: () => api.put('/notifications/read-all').then((r) => r.data),
};
