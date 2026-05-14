import type { Subject, Notification, Company, PlacementStudent, RiskStudent, CommunicationLog, FacultyStatus, AttendanceHeatmapDay, ParentNotification } from '../types';

export const mockSubjects: Subject[] = [
  { id: '1', name: 'Data Structures & Algorithms', code: 'CS301', credits: 4, attendancePercent: 88, internalMark: 47, maxInternalMark: 50, faculty: 'Dr. Priya Nair' },
  { id: '2', name: 'Database Management Systems', code: 'CS302', credits: 3, attendancePercent: 72, internalMark: 38, maxInternalMark: 50, faculty: 'Prof. Arun Kumar' },
  { id: '3', name: 'Computer Networks', code: 'CS303', credits: 3, attendancePercent: 65, internalMark: 35, maxInternalMark: 50, faculty: 'Dr. Sunita Rao' },
  { id: '4', name: 'Operating Systems', code: 'CS304', credits: 4, attendancePercent: 91, internalMark: 44, maxInternalMark: 50, faculty: 'Prof. Vikram Singh' },
  { id: '5', name: 'Machine Learning', code: 'CS305', credits: 3, attendancePercent: 79, internalMark: 41, maxInternalMark: 50, faculty: 'Dr. Ananya Das' },
  { id: '6', name: 'Web Technologies', code: 'CS306', credits: 2, attendancePercent: 95, internalMark: 49, maxInternalMark: 50, faculty: 'Prof. Ravi Menon' },
];

export const mockNotifications: Notification[] = [
  { id: '1', title: 'Attendance Warning', message: 'Your attendance in Computer Networks is 65% — below the 75% threshold.', type: 'warning', time: '2 hours ago', read: false },
  { id: '2', title: 'Assignment Due', message: 'DSA Assignment 4 is due tomorrow at 11:59 PM.', type: 'info', time: '4 hours ago', read: false },
  { id: '3', title: 'Placement Drive', message: 'Google has opened applications. Check your eligibility now.', type: 'success', time: '1 day ago', read: true },
  { id: '4', title: 'Internal Marks Published', message: 'Internal Assessment 3 marks are now available.', type: 'info', time: '2 days ago', read: true },
  { id: '5', title: 'AI Study Plan Ready', message: 'Your personalized study plan for finals has been generated.', type: 'success', time: '3 days ago', read: true },
];

export const mockCompanies: Company[] = [
  { id: '1', name: 'Google', role: 'Software Engineer', ctc: '₹42 LPA', eligibilityCGPA: 7.5, driveDate: '2026-06-15', status: 'upcoming', studentsApplied: 124, studentsSelected: 0 },
  { id: '2', name: 'Microsoft', role: 'SDE-1', ctc: '₹38 LPA', eligibilityCGPA: 7.0, driveDate: '2026-05-28', status: 'ongoing', studentsApplied: 189, studentsSelected: 12 },
  { id: '3', name: 'Amazon', role: 'SDE-1', ctc: '₹32 LPA', eligibilityCGPA: 6.5, driveDate: '2026-05-10', status: 'completed', studentsApplied: 245, studentsSelected: 28 },
  { id: '4', name: 'Infosys', role: 'Systems Engineer', ctc: '₹6.5 LPA', eligibilityCGPA: 6.0, driveDate: '2026-04-20', status: 'completed', studentsApplied: 380, studentsSelected: 95 },
  { id: '5', name: 'Flipkart', role: 'SDE-1', ctc: '₹28 LPA', eligibilityCGPA: 7.0, driveDate: '2026-06-25', status: 'upcoming', studentsApplied: 67, studentsSelected: 0 },
  { id: '6', name: 'Razorpay', role: 'Backend Engineer', ctc: '₹24 LPA', eligibilityCGPA: 7.0, driveDate: '2026-07-05', status: 'upcoming', studentsApplied: 43, studentsSelected: 0 },
];

export const mockPlacementStudents: PlacementStudent[] = [
  { id: '1', name: 'Arjun Sharma', rollNumber: 'CS21B047', department: 'CSE', cgpa: 9.1, skills: ['Python', 'ML', 'React'], placementScore: 92, status: 'placed', offeredCompany: 'Google', ctc: '₹42 LPA' },
  { id: '2', name: 'Preethi Menon', rollNumber: 'CS21B023', department: 'CSE', cgpa: 8.7, skills: ['Java', 'Spring', 'AWS'], placementScore: 88, status: 'placed', offeredCompany: 'Microsoft', ctc: '₹38 LPA' },
  { id: '3', name: 'Rahul Nath', rollNumber: 'EC21B012', department: 'ECE', cgpa: 7.4, skills: ['C++', 'VLSI', 'Embedded'], placementScore: 71, status: 'in_process' },
  { id: '4', name: 'Sneha Rao', rollNumber: 'ME21B034', department: 'MECH', cgpa: 6.8, skills: ['AutoCAD', 'MATLAB'], placementScore: 58, status: 'not_placed' },
  { id: '5', name: 'Vikram Pillai', rollNumber: 'CS21B056', department: 'CSE', cgpa: 8.2, skills: ['Node.js', 'React', 'MongoDB'], placementScore: 84, status: 'placed', offeredCompany: 'Flipkart', ctc: '₹28 LPA' },
  { id: '6', name: 'Divya Krishnan', rollNumber: 'IT21B019', department: 'IT', cgpa: 7.9, skills: ['Angular', 'Python', 'SQL'], placementScore: 77, status: 'in_process' },
];

export const cgpaHistory = [
  { semester: 'S1', sgpa: 8.2, cgpa: 8.2 },
  { semester: 'S2', sgpa: 8.6, cgpa: 8.4 },
  { semester: 'S3', sgpa: 7.8, cgpa: 8.2 },
  { semester: 'S4', sgpa: 8.9, cgpa: 8.4 },
  { semester: 'S5', sgpa: 9.1, cgpa: 8.5 },
  { semester: 'S6', sgpa: 8.7, cgpa: 8.55 },
];

export const attendanceData = [
  { month: 'Jan', percent: 91 },
  { month: 'Feb', percent: 85 },
  { month: 'Mar', percent: 78 },
  { month: 'Apr', percent: 88 },
  { month: 'May', percent: 92 },
];

export const skillData = [
  { skill: 'DSA', level: 72 },
  { skill: 'Web Dev', level: 88 },
  { skill: 'ML/AI', level: 61 },
  { skill: 'DBMS', level: 79 },
  { skill: 'Cloud', level: 45 },
  { skill: 'DevOps', level: 38 },
];

export const departmentPlacementData = [
  { dept: 'CSE', placed: 87, total: 120, percent: 72.5 },
  { dept: 'ECE', placed: 54, total: 90, percent: 60.0 },
  { dept: 'MECH', placed: 28, total: 75, percent: 37.3 },
  { dept: 'CIVIL', placed: 15, total: 60, percent: 25.0 },
  { dept: 'IT', placed: 63, total: 80, percent: 78.75 },
  { dept: 'EEE', placed: 38, total: 70, percent: 54.3 },
];

export const aiResponses: Record<string, string> = {
  default: "I'm your Nexus AI Academic Assistant. I can help you understand concepts, generate study plans, create quizzes, analyze your performance, and much more. What would you like to explore today?",
  hello: "Hello! 👋 Great to see you, Arjun! Your CGPA is currently 8.55 and your attendance is at 80% overall. You have a DSA assignment due tomorrow. How can I help you today?",
  attendance: "Your current attendance summary:\n\n📊 **DSA**: 88% ✅\n📊 **DBMS**: 72% ⚠️\n📊 **CN**: 65% 🔴 (Shortage!)\n📊 **OS**: 91% ✅\n📊 **ML**: 79% ✅\n📊 **Web Tech**: 95% ✅\n\nYou need to attend the next **7 consecutive CN classes** to reach 75%. I recommend prioritizing this subject.",
  cgpa: "Your academic performance trend:\n\n🎓 **Current CGPA**: 8.55\n📈 Semester 6 SGPA: 8.7 (your best!)\n\nYou're in the **top 12%** of your batch. To reach 9.0 CGPA, you need an average SGPA of 9.6 in the remaining semesters — which is achievable with focused effort!",
  placement: "Your Placement Readiness Score is **78/100** 🎯\n\n**Strong areas**: Problem Solving, Web Development\n**Areas to improve**: System Design, Communication Skills\n\n**Recommended actions**:\n1. Practice 3 LeetCode problems daily\n2. Complete the System Design course on your roadmap\n3. Apply for Google drive (you're eligible!)\n4. Schedule a mock interview this week",
};

// ─── HOD & Parent Module Data ─────────────────────────────────────────────────

export const deptMetrics = {
  totalStudents: 286,
  activeFaculty: 18,
  avgAttendance: 79.4,
  avgCGPA: 8.12,
  atRiskCount: 34,
  highRiskCount: 11,
  mediumRiskCount: 23,
  placementRate: 72.5,
  classesThisWeek: 142,
  pendingReports: 3,
  alerts: 7,
};

export const hodStudents: RiskStudent[] = [
  { id: 'r1', name: 'Kiran Patel', rollNumber: 'CS21B034', year: 3, attendance: 58, cgpa: 5.9, internalAvg: 26, riskLevel: 'high', riskReasons: ['Low Attendance', 'Failing Internals', 'Sudden Drop'], aiSummary: 'Attendance dropped 18% in 3 weeks. Internal marks below passing. Immediate counselling recommended.', parentContact: '+91-98765-43210', lastAlert: '2 days ago' },
  { id: 'r2', name: 'Ananya Shetty', rollNumber: 'CS21B019', year: 3, attendance: 68, cgpa: 6.4, internalAvg: 32, riskLevel: 'high', riskReasons: ['Low Attendance', 'Below Average Marks'], aiSummary: 'Attendance below 75% threshold in 3 subjects. Performance declining since Semester 5.', parentContact: '+91-98765-11223', lastAlert: '5 days ago' },
  { id: 'r3', name: 'Rohan Joshi', rollNumber: 'CS21B051', year: 3, attendance: 65, cgpa: 6.1, internalAvg: 28, riskLevel: 'high', riskReasons: ['Critical Attendance', 'At Detention Risk'], aiSummary: 'Only 65% attendance. If trend continues, may face detention. Parent informed 5 days ago — no improvement seen.', parentContact: '+91-87654-32109', lastAlert: '5 days ago' },
  { id: 'r4', name: 'Meera Pillai', rollNumber: 'CS22B008', year: 2, attendance: 72, cgpa: 7.1, internalAvg: 34, riskLevel: 'medium', riskReasons: ['Borderline Attendance', 'Inconsistent Performance'], aiSummary: 'Attendance near threshold. Performance inconsistent across subjects. Monitoring recommended.', parentContact: '+91-76543-21098', lastAlert: '1 week ago' },
  { id: 'r5', name: 'Aditya Rao', rollNumber: 'CS22B022', year: 2, attendance: 74, cgpa: 7.3, internalAvg: 36, riskLevel: 'medium', riskReasons: ['Near Threshold', 'Missed Lab Sessions'], aiSummary: 'One absence away from shortage. Missed 4 consecutive lab sessions last fortnight.', parentContact: '+91-65432-10987', lastAlert: undefined },
  { id: 'r6', name: 'Sneha Kulkarni', rollNumber: 'CS23B041', year: 1, attendance: 70, cgpa: 6.8, internalAvg: 31, riskLevel: 'medium', riskReasons: ['Low Attendance', 'First Year Adjustment'], aiSummary: 'First-year student struggling with attendance. May need academic mentoring and peer support.', parentContact: '+91-54321-09876', lastAlert: '3 days ago' },
  { id: 'r7', name: 'Vivek Menon', rollNumber: 'CS21B063', year: 3, attendance: 76, cgpa: 7.5, internalAvg: 38, riskLevel: 'low', riskReasons: ['Slight Attendance Dip'], aiSummary: 'Minor attendance slip in April. Otherwise performing well. No immediate action needed.', parentContact: '+91-43210-98765', lastAlert: undefined },
  { id: 'r8', name: 'Divya Iyer', rollNumber: 'CS22B033', year: 2, attendance: 78, cgpa: 7.8, internalAvg: 40, riskLevel: 'low', riskReasons: ['One Subject Shortage Risk'], aiSummary: 'Computer Networks attendance at 74.5%. All other subjects satisfactory.', parentContact: '+91-32109-87654', lastAlert: undefined },
];

export const facultyStatus: FacultyStatus[] = [
  { id: 'f1', name: 'Dr. Priya Nair', subject: 'Data Structures & Algorithms', submitted: true, lastUpdate: '10:30 AM today', classesHeld: 48, classesPending: 0 },
  { id: 'f2', name: 'Prof. Arun Kumar', subject: 'Database Management Systems', submitted: true, lastUpdate: '11:15 AM today', classesHeld: 42, classesPending: 0 },
  { id: 'f3', name: 'Dr. Sunita Rao', subject: 'Computer Networks', submitted: false, lastUpdate: '2 days ago', classesHeld: 38, classesPending: 4 },
  { id: 'f4', name: 'Prof. Vikram Singh', subject: 'Operating Systems', submitted: true, lastUpdate: '09:45 AM today', classesHeld: 45, classesPending: 0 },
  { id: 'f5', name: 'Dr. Ananya Das', subject: 'Machine Learning', submitted: false, lastUpdate: '1 day ago', classesHeld: 36, classesPending: 3 },
  { id: 'f6', name: 'Prof. Ravi Menon', subject: 'Web Technologies', submitted: true, lastUpdate: '08:50 AM today', classesHeld: 28, classesPending: 0 },
];

export const communicationLogs: CommunicationLog[] = [
  { id: 'c1', recipient: 'Kiran Patel (Parent)', type: 'whatsapp', message: 'Attendance alert: Kiran\'s attendance is 58%. Immediate action required.', status: 'delivered', sentAt: '2 days ago, 10:00 AM', category: 'attendance' },
  { id: 'c2', recipient: 'All Parents — Sem 6', type: 'email', message: 'Internal Assessment 3 marks have been published. Please check the portal.', status: 'delivered', sentAt: '3 days ago, 2:00 PM', category: 'marks' },
  { id: 'c3', recipient: 'Ananya Shetty (Parent)', type: 'sms', message: 'Low attendance warning for Ananya Shetty (CS21B019). Current: 68%.', status: 'delivered', sentAt: '5 days ago, 9:30 AM', category: 'attendance' },
  { id: 'c4', recipient: 'All Students — CSE', type: 'push', message: 'End semester examination schedule released. Check the portal now.', status: 'delivered', sentAt: '1 week ago', category: 'general' },
  { id: 'c5', recipient: 'Rohan Joshi (Parent)', type: 'sms', message: 'Critical: Rohan Joshi faces detention risk. Please meet HOD.', status: 'delivered', sentAt: '5 days ago', category: 'emergency' },
  { id: 'c6', recipient: 'Fee Defaulters — 12 students', type: 'email', message: 'Second semester fee due on May 20, 2026. Late fee applicable after due date.', status: 'pending', sentAt: 'Scheduled: May 15, 9:00 AM', category: 'fee' },
];

export const weeklyDeptAttendance = [
  { day: 'Mon', rate: 84 }, { day: 'Tue', rate: 81 }, { day: 'Wed', rate: 76 },
  { day: 'Thu', rate: 82 }, { day: 'Fri', rate: 71 },
];

export const deptSemesterComparison = [
  { sem: 'S1', avg: 7.8 }, { sem: 'S2', avg: 8.0 }, { sem: 'S3', avg: 7.6 },
  { sem: 'S4', avg: 8.1 }, { sem: 'S5', avg: 8.3 }, { sem: 'S6', avg: 8.12 },
];

export const subjectDeptAvg = [
  { subject: 'DSA', avg: 78 }, { subject: 'DBMS', avg: 72 }, { subject: 'CN', avg: 65 },
  { subject: 'OS', avg: 80 }, { subject: 'ML', avg: 74 }, { subject: 'Web', avg: 85 },
];

export const attendanceHeatmap: AttendanceHeatmapDay[] = [
  { date: 1, status: 'present' },
  { date: 2, status: 'weekend' },
  { date: 3, status: 'weekend' },
  { date: 4, status: 'present' },
  { date: 5, status: 'present' },
  { date: 6, status: 'absent' },
  { date: 7, status: 'present' },
  { date: 8, status: 'present' },
  { date: 9, status: 'weekend' },
  { date: 10, status: 'weekend' },
  { date: 11, status: 'present' },
  { date: 12, status: 'absent' },
  { date: 13, status: 'present' },
  { date: 14, status: 'present' },
  { date: 15, status: 'future' },
  { date: 16, status: 'weekend' },
  { date: 17, status: 'weekend' },
  { date: 18, status: 'future' },
  { date: 19, status: 'future' },
  { date: 20, status: 'future' },
  { date: 21, status: 'future' },
  { date: 22, status: 'future' },
  { date: 23, status: 'weekend' },
  { date: 24, status: 'weekend' },
  { date: 25, status: 'holiday' },
  { date: 26, status: 'future' },
  { date: 27, status: 'future' },
  { date: 28, status: 'future' },
  { date: 29, status: 'future' },
  { date: 30, status: 'future' },
  { date: 31, status: 'weekend' },
];

export const parentNotifications: ParentNotification[] = [
  { id: 'pn1', title: '⚠️ Attendance Warning', message: 'Arjun Sharma\'s attendance in Computer Networks has dropped to 65% — below the required 75% threshold. Please ensure regular class attendance to avoid academic penalty.', type: 'attendance', time: '2 hours ago', read: false, from: 'HOD — CSE Dept.' },
  { id: 'pn2', title: '📝 Internal Marks Published', message: 'Internal Assessment 3 results are now available. Arjun scored 47/50 in DSA, 38/50 in DBMS, 35/50 in Computer Networks. Please review the portal for full details.', type: 'marks', time: '2 days ago', read: false, from: 'Examination Cell' },
  { id: 'pn3', title: '📅 Exam Schedule Released', message: 'End Semester Examination schedule for June 2026 has been released. First exam: DSA on June 5, 2026. Please ensure your ward is prepared.', type: 'general', time: '1 week ago', read: true, from: 'Examination Cell' },
  { id: 'pn4', title: '💰 Fee Reminder', message: 'Second semester tuition fee of ₹45,000 is due on May 20, 2026. Late fee of ₹500/day will be charged after the due date. Pay through the Nexus portal.', type: 'fee', time: '1 week ago', read: true, from: 'Accounts Office' },
  { id: 'pn5', title: '✅ Assignment Submitted', message: 'Arjun Sharma has successfully submitted the DSA Assignment 3 (Linked Lists & Trees). Faculty review pending.', type: 'general', time: '10 days ago', read: true, from: 'Dr. Priya Nair' },
  { id: 'pn6', title: '🏆 Placement Update', message: 'Arjun Sharma has applied for the Google Software Engineer drive scheduled June 15. Eligibility confirmed (CGPA 8.55 ≥ 7.5 required).', type: 'general', time: '2 weeks ago', read: true, from: 'Placement Cell' },
];

export const monthlyAttendanceTrend = [
  { month: 'Dec', percent: 91 }, { month: 'Jan', percent: 85 },
  { month: 'Feb', percent: 72 }, { month: 'Mar', percent: 78 },
  { month: 'Apr', percent: 88 }, { month: 'May', percent: 80 },
];

export const topPerformers = [
  { name: 'Arjun Sharma', roll: 'CS21B047', cgpa: 9.1, attendance: 88 },
  { name: 'Preethi Menon', roll: 'CS21B023', cgpa: 8.9, attendance: 94 },
  { name: 'Vikram Pillai', roll: 'CS21B056', cgpa: 8.7, attendance: 91 },
  { name: 'Shruti Verma', roll: 'CS22B012', cgpa: 8.6, attendance: 96 },
  { name: 'Rajan Nair', roll: 'CS22B031', cgpa: 8.4, attendance: 89 },
];

