export type UserRole = 'student' | 'faculty' | 'placement' | 'admin' | 'hod' | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  year?: number;
  rollNumber?: string;
  employeeId?: string;
  profileId?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  attendancePercent: number;
  internalMark: number;
  maxInternalMark: number;
  faculty: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  time: string;
  read: boolean;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  role: string;
  ctc: string;
  eligibilityCGPA: number;
  driveDate: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  studentsApplied: number;
  studentsSelected: number;
}

export interface PlacementStudent {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  cgpa: number;
  skills: string[];
  placementScore: number;
  status: 'placed' | 'not_placed' | 'in_process';
  offeredCompany?: string;
  ctc?: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ─── HOD & Parent Module Types ───────────────────────────────────────────────

export interface RiskStudent {
  id: string;
  name: string;
  rollNumber: string;
  year: number;
  attendance: number;
  cgpa: number;
  internalAvg: number;
  riskLevel: 'high' | 'medium' | 'low';
  riskReasons: string[];
  aiSummary: string;
  parentContact: string;
  lastAlert?: string;
}

export interface CommunicationLog {
  id: string;
  recipient: string;
  type: 'sms' | 'whatsapp' | 'email' | 'push';
  message: string;
  status: 'delivered' | 'pending' | 'failed';
  sentAt: string;
  category: 'attendance' | 'marks' | 'fee' | 'general' | 'emergency';
}

export interface FacultyStatus {
  id: string;
  name: string;
  subject: string;
  submitted: boolean;
  lastUpdate: string;
  classesHeld: number;
  classesPending: number;
}

export interface AttendanceHeatmapDay {
  date: number;
  status: 'present' | 'absent' | 'holiday' | 'weekend' | 'future';
}

export interface ParentNotification {
  id: string;
  title: string;
  message: string;
  type: 'attendance' | 'marks' | 'fee' | 'general' | 'emergency';
  time: string;
  read: boolean;
  from: string;
}
