import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { studentAPI, attendanceAPI, marksAPI, hodAPI, parentAPI, placementAPI, adminAPI, aiAPI, notificationAPI } from '../services/apiServices';
import * as mock from '../utils/mockData';

// ── Generic async hook ─────────────────────────────────────────────────────
function useAsync<T>(
  fetchFn: () => Promise<{ data: T }>,
  mockData: T,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T>(mockData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromAPI, setIsFromAPI] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchFn();
      setData(res.data);
      setIsFromAPI(true);
      setError(null);
    } catch {
      // Silently fall back to mock data when backend is offline
      setData(mockData);
      setIsFromAPI(false);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, isFromAPI, refetch: fetch };
}

// ── Attendance summary hook ────────────────────────────────────────────────
export function useAttendanceSummary(studentId?: string) {
  const { user } = useAuthStore();
  const id = studentId || user?.id || '';

  return useAsync(
    () => attendanceAPI.studentSummary(id),
    {
      subjects: mock.mockSubjects.map(s => ({
        subject: { name: s.name, code: s.code, credits: s.credits },
        total: 40, present: Math.round(40 * s.attendancePercent / 100),
        percentage: s.attendancePercent, isLow: s.attendancePercent < 75,
      })),
      overall: {
        totalClasses: 240,
        totalPresent: 192,
        percentage: 80,
        isLow: false,
        detentionRisk: false,
      },
    },
    [id]
  );
}

// ── Marks summary hook ─────────────────────────────────────────────────────
export function useMarksSummary(studentId?: string) {
  const { user } = useAuthStore();
  const id = studentId || user?.id || '';

  return useAsync(
    () => marksAPI.student(id),
    {
      subjects: mock.mockSubjects.map(s => ({
        subject: { name: s.name, code: s.code },
        entries: [{ type: 'internal1', marks: s.internalMark, maxMarks: s.maxInternalMark, percentage: (s.internalMark / s.maxInternalMark) * 100 }],
        total: s.internalMark, maxTotal: s.maxInternalMark,
        percentage: (s.internalMark / s.maxInternalMark) * 100,
        grade: s.internalMark >= 45 ? 'A' : s.internalMark >= 35 ? 'B' : 'F',
      })),
      overallPercentage: 82,
    },
    [id]
  );
}

// ── HOD dashboard hook ────────────────────────────────────────────────────
export function useHODDashboard() {
  return useAsync(
    () => hodAPI.dashboard(),
    {
      totalStudents: mock.deptMetrics.totalStudents,
      totalFaculty: mock.deptMetrics.activeFaculty,
      lowAttendanceCount: mock.deptMetrics.atRiskCount,
      atRiskCount: mock.deptMetrics.highRiskCount,
    },
    []
  );
}

// ── HOD weak students hook ────────────────────────────────────────────────
export function useWeakStudents() {
  return useAsync(
    () => hodAPI.weakStudents(),
    mock.hodStudents,
    []
  );
}

// ── HOD faculty status hook ───────────────────────────────────────────────
export function useFacultyStatus() {
  return useAsync(
    () => hodAPI.facultyStatus(),
    mock.facultyStatus,
    []
  );
}

// ── Parent profile hook ───────────────────────────────────────────────────
export function useParentProfile() {
  return useAsync(
    () => parentAPI.profile(),
    {
      name: 'Mr. Suresh Sharma',
      students: [{ _id: '1', name: 'Arjun Sharma', usn: 'CS21B047', semester: 3 }],
    },
    []
  );
}

// ── Parent notifications hook ─────────────────────────────────────────────
export function useParentNotifications() {
  return useAsync(
    () => parentAPI.notifications(),
    { notifications: mock.parentNotifications, total: mock.parentNotifications.length, unreadCount: 2 },
    []
  );
}

// ── Placement companies hook ──────────────────────────────────────────────
export function usePlacementCompanies(status?: string) {
  return useAsync(
    () => placementAPI.companies(status ? { status } : undefined),
    { data: mock.mockCompanies, pagination: {} },
    [status]
  );
}

// ── Placement stats hook ──────────────────────────────────────────────────
export function usePlacementStats() {
  return useAsync(
    () => placementAPI.stats(),
    { totalDrives: 6, completedDrives: 2, totalApplicants: 389, totalSelected: 135, selectionRate: 34.7 },
    []
  );
}

// ── Admin dashboard hook ──────────────────────────────────────────────────
export function useAdminDashboard() {
  return useAsync(
    () => adminAPI.dashboard(),
    {
      totalUsers: 320, totalStudents: 286, totalFaculty: 18,
      totalDepts: 6, atRiskStudents: mock.deptMetrics.highRiskCount, activityLast24h: 47,
    },
    []
  );
}

// ── Notifications hook ────────────────────────────────────────────────────
export function useNotifications() {
  return useAsync(
    () => notificationAPI.list({ limit: 20 }),
    { notifications: mock.mockNotifications, total: 5, unreadCount: 2 },
    []
  );
}

// ── AI analytics hook ─────────────────────────────────────────────────────
export function useAIAnalytics(studentId?: string) {
  const { user } = useAuthStore();
  const id = studentId || user?.id || '';

  return useAsync(
    () => aiAPI.studentRisk(id),
    {
      riskScore: 28, riskLevel: 'low',
      riskReasons: ['Attendance below 75% in Computer Networks'],
      suggestions: ['Focus on CN attendance', 'Review DBMS fundamentals'],
      performanceTrend: 'stable',
      detentionRisk: false,
    },
    [id]
  );
}

// ── Attendance heatmap hook ───────────────────────────────────────────────
export function useAttendanceHeatmap(studentId?: string) {
  const { user } = useAuthStore();
  const id = studentId || user?.id || '';

  return useAsync(
    () => attendanceAPI.heatmap(id, 31),
    mock.attendanceHeatmap.map(d => ({ date: `2026-05-${String(d.date).padStart(2,'0')}`, status: d.status, count: d.status === 'present' ? 3 : 0 })),
    [id]
  );
}
