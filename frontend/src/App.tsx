import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from './store/authStore';

// Auth
import LoginPage from './pages/auth/LoginPage';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Student
import StudentDashboard from './pages/student/StudentDashboard';
import AttendancePage from './pages/student/AttendancePage';
import MarksPage from './pages/student/MarksPage';
import AIAssistantPage from './pages/student/AIAssistantPage';
import PlacementPage from './pages/student/PlacementPage';
import SkillsPage from './pages/student/SkillsPage';
import TimetablePage from './pages/student/TimetablePage';
import ResumeBuilderPage from './pages/student/ResumeBuilderPage';

// Faculty
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultyAIToolsPage from './pages/faculty/FacultyAIToolsPage';

// Placement
import PlacementDashboard from './pages/placement/PlacementDashboard';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';

// HOD
import HODDashboard from './pages/hod/HODDashboard';
import HODRiskMonitor from './pages/hod/HODRiskMonitor';
import HODStudentAnalytics from './pages/hod/HODStudentAnalytics';
import HODCommunicationCenter from './pages/hod/HODCommunicationCenter';
import HODReports from './pages/hod/HODReports';

// Parent
import ParentDashboard from './pages/parent/ParentDashboard';
import ParentAttendancePage from './pages/parent/ParentAttendancePage';
import ParentPerformancePage from './pages/parent/ParentPerformancePage';
import ParentMessagesPage from './pages/parent/ParentMessagesPage';

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-4">
        <span className="text-3xl">🚧</span>
      </div>
      <h2 className="text-white font-bold text-xl">{title}</h2>
      <p className="text-slate-500 text-sm mt-2">This module is coming soon in Phase 2</p>
    </div>
  );
}

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole?: string }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRole && user?.role !== allowedRole) return <Navigate to={`/${user?.role}`} replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
}

export default function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Auth */}
          <Route path="/login" element={isAuthenticated ? <Navigate to={`/${user?.role}`} replace /> : <LoginPage />} />
          <Route path="/" element={<Navigate to={isAuthenticated ? `/${user?.role}` : '/login'} replace />} />

          {/* Student Portal */}
          <Route path="/student" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/attendance" element={<ProtectedRoute allowedRole="student"><AttendancePage /></ProtectedRoute>} />
          <Route path="/student/marks" element={<ProtectedRoute allowedRole="student"><MarksPage /></ProtectedRoute>} />
          <Route path="/student/ai" element={<ProtectedRoute allowedRole="student"><AIAssistantPage /></ProtectedRoute>} />
          <Route path="/student/placement" element={<ProtectedRoute allowedRole="student"><PlacementPage /></ProtectedRoute>} />
          <Route path="/student/skills" element={<ProtectedRoute allowedRole="student"><SkillsPage /></ProtectedRoute>} />
          <Route path="/student/timetable" element={<ProtectedRoute allowedRole="student"><TimetablePage /></ProtectedRoute>} />
          <Route path="/student/resume" element={<ProtectedRoute allowedRole="student"><ResumeBuilderPage /></ProtectedRoute>} />
          <Route path="/student/notifications" element={<ProtectedRoute allowedRole="student"><ComingSoon title="Notifications" /></ProtectedRoute>} />

          {/* Faculty Portal */}
          <Route path="/faculty" element={<ProtectedRoute allowedRole="faculty"><FacultyDashboard /></ProtectedRoute>} />
          <Route path="/faculty/attendance" element={<ProtectedRoute allowedRole="faculty"><ComingSoon title="Attendance Management" /></ProtectedRoute>} />
          <Route path="/faculty/marks" element={<ProtectedRoute allowedRole="faculty"><ComingSoon title="Marks Entry" /></ProtectedRoute>} />
          <Route path="/faculty/timetable" element={<ProtectedRoute allowedRole="faculty"><TimetablePage /></ProtectedRoute>} />
          <Route path="/faculty/ai-tools" element={<ProtectedRoute allowedRole="faculty"><FacultyAIToolsPage /></ProtectedRoute>} />
          <Route path="/faculty/analytics" element={<ProtectedRoute allowedRole="faculty"><ComingSoon title="Faculty Analytics" /></ProtectedRoute>} />
          <Route path="/faculty/notifications" element={<ProtectedRoute allowedRole="faculty"><ComingSoon title="Notifications" /></ProtectedRoute>} />

          {/* Placement Portal */}
          <Route path="/placement" element={<ProtectedRoute allowedRole="placement"><PlacementDashboard /></ProtectedRoute>} />
          <Route path="/placement/companies" element={<ProtectedRoute allowedRole="placement"><ComingSoon title="Company Management" /></ProtectedRoute>} />
          <Route path="/placement/students" element={<ProtectedRoute allowedRole="placement"><ComingSoon title="Student Database" /></ProtectedRoute>} />
          <Route path="/placement/analytics" element={<ProtectedRoute allowedRole="placement"><ComingSoon title="Placement Analytics" /></ProtectedRoute>} />
          <Route path="/placement/drives" element={<ProtectedRoute allowedRole="placement"><ComingSoon title="Drive Schedule" /></ProtectedRoute>} />
          <Route path="/placement/notifications" element={<ProtectedRoute allowedRole="placement"><ComingSoon title="Notifications" /></ProtectedRoute>} />

          {/* Admin Portal */}
          <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRole="admin"><ComingSoon title="User Management" /></ProtectedRoute>} />
          <Route path="/admin/departments" element={<ProtectedRoute allowedRole="admin"><ComingSoon title="Departments" /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute allowedRole="admin"><ComingSoon title="Analytics" /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute allowedRole="admin"><ComingSoon title="Reports" /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute allowedRole="admin"><ComingSoon title="Settings" /></ProtectedRoute>} />
          <Route path="/admin/notifications" element={<ProtectedRoute allowedRole="admin"><ComingSoon title="Notifications" /></ProtectedRoute>} />

          {/* HOD Portal */}
          <Route path="/hod" element={<ProtectedRoute allowedRole="hod"><HODDashboard /></ProtectedRoute>} />
          <Route path="/hod/risk" element={<ProtectedRoute allowedRole="hod"><HODRiskMonitor /></ProtectedRoute>} />
          <Route path="/hod/analytics" element={<ProtectedRoute allowedRole="hod"><HODStudentAnalytics /></ProtectedRoute>} />
          <Route path="/hod/communication" element={<ProtectedRoute allowedRole="hod"><HODCommunicationCenter /></ProtectedRoute>} />
          <Route path="/hod/reports" element={<ProtectedRoute allowedRole="hod"><HODReports /></ProtectedRoute>} />
          <Route path="/hod/notifications" element={<ProtectedRoute allowedRole="hod"><ComingSoon title="HOD Notifications" /></ProtectedRoute>} />

          {/* Parent Portal */}
          <Route path="/parent" element={<ProtectedRoute allowedRole="parent"><ParentDashboard /></ProtectedRoute>} />
          <Route path="/parent/attendance" element={<ProtectedRoute allowedRole="parent"><ParentAttendancePage /></ProtectedRoute>} />
          <Route path="/parent/performance" element={<ProtectedRoute allowedRole="parent"><ParentPerformancePage /></ProtectedRoute>} />
          <Route path="/parent/messages" element={<ProtectedRoute allowedRole="parent"><ParentMessagesPage /></ProtectedRoute>} />
          <Route path="/parent/notifications" element={<ProtectedRoute allowedRole="parent"><ParentMessagesPage /></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}
