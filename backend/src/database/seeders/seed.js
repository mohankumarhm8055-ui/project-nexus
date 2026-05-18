'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');
const Student = require('../../models/Student');
const Faculty = require('../../models/Faculty');
const Parent = require('../../models/Parent');
const Department = require('../../models/Department');
const Subject = require('../../models/Subject');
const Attendance = require('../../models/Attendance');
const Marks = require('../../models/Marks');
const PlacementDrive = require('../../models/Placement');
const AIAnalytics = require('../../models/AIAnalytics');
const Notification = require('../../models/Notification');

const log = console.log;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nexus_intellect';

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(2));

const seed = async () => {
  try {
    log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    log('✅ Connected');

    // Clean slate
    await Promise.all([
      User.deleteMany({}), Student.deleteMany({}), Faculty.deleteMany({}),
      Parent.deleteMany({}), Department.deleteMany({}), Subject.deleteMany({}),
      Attendance.deleteMany({}), Marks.deleteMany({}), PlacementDrive.deleteMany({}),
      AIAnalytics.deleteMany({}), Notification.deleteMany({}),
    ]);
    log('🧹 Database cleared');

    // ── Departments ──────────────────────────────────────────────────────────
    const [cse, ece, mech] = await Department.insertMany([
      { name: 'Computer Science Engineering', code: 'CSE', establishedYear: 1990 },
      { name: 'Electronics & Communication Engineering', code: 'ECE', establishedYear: 1992 },
      { name: 'Mechanical Engineering', code: 'MECH', establishedYear: 1988 },
    ]);
    log('✅ Departments seeded');

    // ── Hash password ────────────────────────────────────────────────────────
    const SALT = await bcrypt.genSalt(12);
    const hp = await bcrypt.hash('Nexus@123', SALT);

    // ── Users ────────────────────────────────────────────────────────────────
    const [
      uAdmin, uHod, uFac1, uFac2, uFac3,
      uStu1, uStu2, uStu3, uStu4, uStu5, uStu6, uStu7, uStu8,
      uPar1, uPar2, uPar3, uPlacement,
    ] = await User.insertMany([
      { name: 'Dr. Meena Iyer',        email: 'admin@nexus.edu',           passwordHash: hp, role: 'admin',     identifier: 'ADM001', isEmailVerified: true },
      { name: 'Dr. Ramesh Babu',       email: 'hod.cse@nexus.edu',         passwordHash: hp, role: 'hod',       identifier: 'HOD001', isEmailVerified: true },
      { name: 'Dr. Priya Nair',        email: 'priya.nair@nexus.edu',      passwordHash: hp, role: 'faculty',   identifier: 'FAC001', isEmailVerified: true },
      { name: 'Dr. Anand Krishnan',    email: 'anand.k@nexus.edu',         passwordHash: hp, role: 'faculty',   identifier: 'FAC002', isEmailVerified: true },
      { name: 'Prof. Sunita Reddy',    email: 'sunita.r@nexus.edu',        passwordHash: hp, role: 'faculty',   identifier: 'FAC003', isEmailVerified: true },
      // Students
      { name: 'Arjun Sharma',          email: 'arjun.sharma@nexus.edu',    passwordHash: hp, role: 'student',   identifier: 'CS21B001', isEmailVerified: true },
      { name: 'Priya Patel',           email: 'priya.patel@nexus.edu',     passwordHash: hp, role: 'student',   identifier: 'CS21B002', isEmailVerified: true },
      { name: 'Rohit Verma',           email: 'rohit.verma@nexus.edu',     passwordHash: hp, role: 'student',   identifier: 'CS21B003', isEmailVerified: true },
      { name: 'Sneha Gupta',           email: 'sneha.gupta@nexus.edu',     passwordHash: hp, role: 'student',   identifier: 'CS21B004', isEmailVerified: true },
      { name: 'Kiran Reddy',           email: 'kiran.reddy@nexus.edu',     passwordHash: hp, role: 'student',   identifier: 'EC21B001', isEmailVerified: true },
      { name: 'Meghna Joshi',          email: 'meghna.joshi@nexus.edu',    passwordHash: hp, role: 'student',   identifier: 'EC21B002', isEmailVerified: true },
      { name: 'Aditya Kumar',          email: 'aditya.kumar@nexus.edu',    passwordHash: hp, role: 'student',   identifier: 'ME21B001', isEmailVerified: true },
      { name: 'Divya Menon',           email: 'divya.menon@nexus.edu',     passwordHash: hp, role: 'student',   identifier: 'CS21B005', isEmailVerified: true },
      // Parents
      { name: 'Mr. Suresh Sharma',     email: 'suresh.sharma@gmail.com',   passwordHash: hp, role: 'parent', isEmailVerified: true },
      { name: 'Mrs. Kavita Patel',     email: 'kavita.patel@gmail.com',    passwordHash: hp, role: 'parent', isEmailVerified: true },
      { name: 'Mr. Venkat Reddy',      email: 'venkat.reddy@gmail.com',    passwordHash: hp, role: 'parent', isEmailVerified: true },
      // Placement
      { name: 'Rajesh Kumar',          email: 'placement@nexus.edu',       passwordHash: hp, role: 'placement', identifier: 'PLC001', isEmailVerified: true },
    ]);
    log('✅ Users seeded');

    // ── Faculty docs ─────────────────────────────────────────────────────────
    const hodFac = await Faculty.create({
      userId: uHod._id, employeeId: 'HOD001', name: uHod.name,
      department: cse._id, designation: 'HOD', joiningDate: new Date('2016-07-01'),
    });
    const fac1 = await Faculty.create({
      userId: uFac1._id, employeeId: 'FAC001', name: uFac1.name,
      department: cse._id, designation: 'Associate Professor', joiningDate: new Date('2019-08-01'),
    });
    const fac2 = await Faculty.create({
      userId: uFac2._id, employeeId: 'FAC002', name: uFac2.name,
      department: ece._id, designation: 'Assistant Professor', joiningDate: new Date('2020-06-01'),
    });
    const fac3 = await Faculty.create({
      userId: uFac3._id, employeeId: 'FAC003', name: uFac3.name,
      department: mech._id, designation: 'Assistant Professor', joiningDate: new Date('2021-07-15'),
    });
    await Department.findByIdAndUpdate(cse._id,  { hodId: hodFac._id, totalFaculty: 2, totalStudents: 6 });
    await Department.findByIdAndUpdate(ece._id,  { totalFaculty: 1, totalStudents: 2 });
    await Department.findByIdAndUpdate(mech._id, { totalFaculty: 1, totalStudents: 1 });
    log('✅ Faculty seeded');

    // ── Subjects ─────────────────────────────────────────────────────────────
    const [dsa, os, dbms, cn, ml, se, eca, dsp, vlsi, thermo, mfg, md] = await Subject.insertMany([
      { name: 'Data Structures & Algorithms', code: 'CS301', credits: 4, department: cse._id, semester: 3, faculty: fac1._id },
      { name: 'Operating Systems',            code: 'CS302', credits: 4, department: cse._id, semester: 3, faculty: fac1._id },
      { name: 'Database Management Systems',  code: 'CS303', credits: 3, department: cse._id, semester: 3, faculty: hodFac._id },
      { name: 'Computer Networks',            code: 'CS304', credits: 3, department: cse._id, semester: 3, faculty: fac1._id },
      { name: 'Machine Learning',             code: 'CS305', credits: 4, department: cse._id, semester: 3, faculty: hodFac._id, type: 'elective' },
      { name: 'Software Engineering',         code: 'CS306', credits: 3, department: cse._id, semester: 3, faculty: fac1._id },
      { name: 'Electronic Circuits Analysis', code: 'EC301', credits: 4, department: ece._id, semester: 3, faculty: fac2._id },
      { name: 'Digital Signal Processing',    code: 'EC302', credits: 4, department: ece._id, semester: 3, faculty: fac2._id },
      { name: 'VLSI Design',                  code: 'EC303', credits: 3, department: ece._id, semester: 3, faculty: fac2._id, type: 'elective' },
      { name: 'Thermodynamics',               code: 'ME301', credits: 4, department: mech._id, semester: 3, faculty: fac3._id },
      { name: 'Manufacturing Processes',      code: 'ME302', credits: 3, department: mech._id, semester: 3, faculty: fac3._id },
      { name: 'Machine Design',               code: 'ME303', credits: 4, department: mech._id, semester: 3, faculty: fac3._id },
    ]);
    await Faculty.findByIdAndUpdate(fac1._id,   { subjects: [dsa._id, os._id, cn._id, se._id] });
    await Faculty.findByIdAndUpdate(hodFac._id, { subjects: [dbms._id, ml._id] });
    await Faculty.findByIdAndUpdate(fac2._id,   { subjects: [eca._id, dsp._id, vlsi._id] });
    await Faculty.findByIdAndUpdate(fac3._id,   { subjects: [thermo._id, mfg._id, md._id] });
    log('✅ Subjects seeded');

    // ── Parents ──────────────────────────────────────────────────────────────
    const [par1, par2, par3] = await Parent.insertMany([
      { userId: uPar1._id, name: uPar1.name, relationship: 'father', phone: '9876543210', whatsappPhone: '9876543210', email: uPar1.email, preferredNotification: ['sms', 'email'] },
      { userId: uPar2._id, name: uPar2.name, relationship: 'mother', phone: '9876543211', whatsappPhone: '9876543211', email: uPar2.email, preferredNotification: ['email', 'push'] },
      { userId: uPar3._id, name: uPar3.name, relationship: 'father', phone: '9876543212', whatsappPhone: '9876543212', email: uPar3.email, preferredNotification: ['sms', 'push'] },
    ]);

    // ── Students ─────────────────────────────────────────────────────────────
    const stuData = [
      // CSE students
      { u: uStu1, usn: 'CS21B001', dept: cse._id, cgpa: 8.9, par: par1._id, skills: ['JavaScript', 'React', 'Python'], placementStatus: 'placed' },
      { u: uStu2, usn: 'CS21B002', dept: cse._id, cgpa: 7.4, par: par2._id, skills: ['Java', 'Spring Boot', 'SQL'],     placementStatus: 'eligible' },
      { u: uStu3, usn: 'CS21B003', dept: cse._id, cgpa: 5.8, par: par1._id, skills: ['C', 'C++'],                       placementStatus: 'notEligible' },
      { u: uStu4, usn: 'CS21B004', dept: cse._id, cgpa: 9.2, par: par2._id, skills: ['ML', 'Python', 'TensorFlow'],     placementStatus: 'eligible' },
      { u: uStu8, usn: 'CS21B005', dept: cse._id, cgpa: 6.1, par: par3._id, skills: ['HTML', 'CSS'],                    placementStatus: 'notEligible' },
      // ECE students
      { u: uStu5, usn: 'EC21B001', dept: ece._id, cgpa: 7.8, par: par3._id, skills: ['VLSI', 'Embedded C'],             placementStatus: 'eligible' },
      { u: uStu6, usn: 'EC21B002', dept: ece._id, cgpa: 6.5, par: par1._id, skills: ['Arduino', 'PCB Design'],          placementStatus: 'eligible' },
      // MECH student
      { u: uStu7, usn: 'ME21B001', dept: mech._id, cgpa: 7.2, par: par2._id, skills: ['AutoCAD', 'SolidWorks'],         placementStatus: 'eligible' },
    ];

    const students = await Student.insertMany(stuData.map(s => ({
      userId: s.u._id, usn: s.usn, name: s.u.name, department: s.dept,
      semester: 3, section: 'A', year: 2, cgpa: s.cgpa,
      parentId: s.par, admissionYear: 2021, passoutYear: 2025,
      skills: s.skills, placementStatus: s.placementStatus,
    })));

    // Link parents to students
    await Parent.findByIdAndUpdate(par1._id, { students: [students[0]._id, students[2]._id, students[5]._id] });
    await Parent.findByIdAndUpdate(par2._id, { students: [students[1]._id, students[3]._id, students[7]._id] });
    await Parent.findByIdAndUpdate(par3._id, { students: [students[4]._id, students[6]._id] });
    log(`✅ ${students.length} Students & Parents seeded`);

    // ── Attendance ───────────────────────────────────────────────────────────
    const today = new Date();
    const attDocs = [];

    // Attendance patterns: high, medium, low for drama
    const patterns = [0.95, 0.82, 0.60, 0.91, 0.70, 0.88, 0.78, 0.55];

    for (let i = 0; i < students.length; i++) {
      const stu = students[i];
      const rate = patterns[i] || 0.80;
      const deptSubjects = i < 5 ? [dsa, os, dbms, cn, ml, se] : i < 7 ? [eca, dsp, vlsi] : [thermo, mfg, md];
      const fac = i < 5 ? fac1 : i < 7 ? fac2 : fac3;
      const dept = i < 5 ? cse : i < 7 ? ece : mech;

      for (let d = 45; d >= 0; d--) {
        const date = new Date(today);
        date.setDate(today.getDate() - d);
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        for (const sub of deptSubjects) {
          attDocs.push({
            student: stu._id, subject: sub._id, faculty: fac._id,
            department: dept._id, date, semester: 3, section: 'A',
            academicYear: '2024-25',
            status: Math.random() < rate ? 'present' : 'absent',
          });
        }
      }
    }
    await Attendance.insertMany(attDocs);
    log(`✅ Attendance seeded: ${attDocs.length} records`);

    // ── Marks ────────────────────────────────────────────────────────────────
    const markTypes = [
      { type: 'internal1', max: 50 },
      { type: 'internal2', max: 50 },
      { type: 'assignment', max: 20 },
      { type: 'lab', max: 25 },
    ];

    // marks quality mirrors cgpa
    const marksQuality = [0.90, 0.72, 0.55, 0.93, 0.62, 0.80, 0.68, 0.50];
    const marksDocs = [];

    for (let i = 0; i < students.length; i++) {
      const stu = students[i];
      const q = marksQuality[i] || 0.75;
      const deptSubjects = i < 5 ? [dsa, os, dbms, cn, ml, se] : i < 7 ? [eca, dsp, vlsi] : [thermo, mfg, md];
      const fac = i < 5 ? fac1 : i < 7 ? fac2 : fac3;
      const dept = i < 5 ? cse : i < 7 ? ece : mech;

      for (const sub of deptSubjects) {
        for (const mt of markTypes) {
          const scored = Math.round(mt.max * q * (0.85 + Math.random() * 0.3));
          const capped = Math.min(scored, mt.max);
          marksDocs.push({
            student: stu._id, subject: sub._id, faculty: fac._id, department: dept._id,
            type: mt.type, marks: capped, maxMarks: mt.max,
            semester: 3, academicYear: '2024-25',
            isPublished: true, publishedAt: new Date(),
          });
        }
      }
    }
    await Marks.insertMany(marksDocs);
    log(`✅ Marks seeded: ${marksDocs.length} records`);

    // ── AI Analytics ─────────────────────────────────────────────────────────
    const riskProfiles = [
      { score: 12, level: 'low',      trend: 'improving', reasons: ['Strong attendance (95%)', 'Excellent marks'], detention: false },
      { score: 35, level: 'medium',   trend: 'stable',    reasons: ['Attendance 82% — monitor'], detention: false },
      { score: 72, level: 'high',     trend: 'declining', reasons: ['Attendance 60% — at risk of detention', 'Low internal marks in DSA'], detention: true },
      { score: 8,  level: 'low',      trend: 'improving', reasons: ['Top performer', 'Consistent attendance'], detention: false },
      { score: 61, level: 'high',     trend: 'declining', reasons: ['Attendance 70%', 'Below average marks'], detention: false },
      { score: 22, level: 'low',      trend: 'stable',    reasons: ['Good attendance 88%'], detention: false },
      { score: 44, level: 'medium',   trend: 'stable',    reasons: ['Attendance 78% — room for improvement'], detention: false },
      { score: 85, level: 'critical', trend: 'critical',  reasons: ['Attendance 55% — detention risk HIGH', 'Very low marks in all subjects', 'Consecutive absences detected'], detention: true },
    ];

    const aiDocs = students.map((stu, i) => {
      const p = riskProfiles[i] || riskProfiles[1];
      return {
        student: stu._id,
        riskScore: p.score,
        riskLevel: p.level,
        riskReasons: p.reasons,
        performanceTrend: p.trend,
        attendanceTrend: { current: patterns[i] * 100, lastMonth: (patterns[i] + 0.05) * 100, change: -5 },
        marksTrend: { currentAvg: marksQuality[i] * 100, previousAvg: (marksQuality[i] + 0.05) * 100, change: -5 },
        consecutiveAbsences: p.detention ? rand(3, 7) : 0,
        suggestions: p.detention
          ? ['Attend all remaining classes immediately', 'Meet HOD for academic counselling', 'Inform parents about risk']
          : ['Maintain current performance', 'Focus on weak subjects'],
        parentFriendlySummary: p.detention
          ? `Your ward has low attendance and is at risk of detention. Immediate action required.`
          : `Your ward is performing ${p.level === 'low' ? 'well' : 'adequately'}. Keep it up!`,
        hodAlert: p.level === 'high' || p.level === 'critical',
        detentionRisk: p.detention,
        lastAnalyzedAt: new Date(),
      };
    });
    await AIAnalytics.insertMany(aiDocs);
    log('✅ AI Analytics seeded');

    // ── Placement Drives ─────────────────────────────────────────────────────
    await PlacementDrive.insertMany([
      {
        company: { name: 'Google', industry: 'Technology', description: 'SWE roles for final year students' },
        role: 'Software Engineer L3', ctcDisplay: '30-45 LPA',
        ctcRange: { min: 3000000, max: 4500000 },
        eligibility: { minCGPA: 8.0, allowedBranches: [cse._id], maxBacklogs: 0 },
        driveDate: new Date(Date.now() + 30 * 86400000),
        lastApplyDate: new Date(Date.now() + 20 * 86400000),
        rounds: ['Online Test', 'Technical Round 1', 'Technical Round 2', 'HR'],
        status: 'upcoming', createdBy: uAdmin._id,
        applicants: [{ student: students[3]._id, status: 'applied' }],
      },
      {
        company: { name: 'Microsoft', industry: 'Technology' },
        role: 'SDE-1', ctcDisplay: '25-35 LPA',
        ctcRange: { min: 2500000, max: 3500000 },
        eligibility: { minCGPA: 7.5, allowedBranches: [cse._id, ece._id], maxBacklogs: 0 },
        driveDate: new Date(Date.now() + 45 * 86400000),
        lastApplyDate: new Date(Date.now() + 35 * 86400000),
        rounds: ['Coding Test', 'System Design', 'Behavioural', 'HR'],
        status: 'upcoming', createdBy: uAdmin._id,
        applicants: [
          { student: students[0]._id, status: 'applied' },
          { student: students[3]._id, status: 'applied' },
        ],
      },
      {
        company: { name: 'Infosys', industry: 'IT Services' },
        role: 'Systems Engineer', ctcDisplay: '4.5 LPA',
        eligibility: { minCGPA: 6.5, allowedBranches: [cse._id, ece._id, mech._id], maxBacklogs: 2 },
        driveDate: new Date(Date.now() + 10 * 86400000),
        lastApplyDate: new Date(Date.now() + 5 * 86400000),
        rounds: ['Aptitude', 'Technical', 'HR'],
        status: 'upcoming', createdBy: uAdmin._id,
        applicants: [
          { student: students[1]._id, status: 'applied' },
          { student: students[5]._id, status: 'applied' },
          { student: students[6]._id, status: 'applied' },
          { student: students[7]._id, status: 'applied' },
        ],
      },
      {
        company: { name: 'TCS', industry: 'IT Services' },
        role: 'Assistant System Engineer', ctcDisplay: '3.5 LPA',
        eligibility: { minCGPA: 6.0 },
        driveDate: new Date(Date.now() - 5 * 86400000),
        status: 'completed', createdBy: uAdmin._id,
        applicants: [
          { student: students[0]._id, status: 'selected', ctcOffered: '3.5 LPA' },
          { student: students[1]._id, status: 'selected', ctcOffered: '3.5 LPA' },
          { student: students[4]._id, status: 'rejected' },
        ],
      },
      {
        company: { name: 'Wipro', industry: 'IT Services' },
        role: 'Project Engineer', ctcDisplay: '3.5-5 LPA',
        eligibility: { minCGPA: 6.0, maxBacklogs: 1 },
        driveDate: new Date(Date.now() - 15 * 86400000),
        status: 'completed', createdBy: uAdmin._id,
        applicants: [
          { student: students[1]._id, status: 'selected', ctcOffered: '4 LPA' },
          { student: students[5]._id, status: 'selected', ctcOffered: '3.5 LPA' },
          { student: students[6]._id, status: 'rejected' },
          { student: students[7]._id, status: 'selected', ctcOffered: '3.5 LPA' },
        ],
      },
    ]);
    log('✅ Placement drives seeded');

    // ── Sample Notifications ─────────────────────────────────────────────────
    await Notification.insertMany([
      {
        recipient: uPar1._id, recipientRole: 'parent',
        sender: uFac1._id, senderRole: 'faculty',
        channel: 'in_app', title: 'Attendance Alert — Arjun Sharma',
        body: 'Arjun Sharma (CS21B001) was marked ABSENT for DSA on today.',
        category: 'attendance', status: 'delivered', isRead: false,
      },
      {
        recipient: uStu1._id, recipientRole: 'student',
        sender: uAdmin._id, senderRole: 'admin',
        channel: 'in_app', title: 'Google Drive Registration Open',
        body: 'Google SWE drive registration closes in 20 days. Apply now!',
        category: 'placement', status: 'delivered', isRead: false,
      },
      {
        recipient: uHod._id, recipientRole: 'hod',
        sender: uAdmin._id, senderRole: 'admin',
        channel: 'in_app', title: 'AI Alert: 2 Students at Critical Risk',
        body: 'Rohit Verma and Divya Menon have been flagged as critical risk. Please schedule counselling.',
        category: 'system', status: 'delivered', isRead: false,
      },
    ]);
    log('✅ Notifications seeded');

    log('\n══════════════════════════════════════════════════════');
    log('🎉 SEED COMPLETE — Nexus Intellect Rich Database Ready!');
    log('══════════════════════════════════════════════════════');
    log('\n📧 Credentials (password: Nexus@123):');
    log('  Admin      : admin@nexus.edu');
    log('  HOD        : hod.cse@nexus.edu');
    log('  Faculty    : priya.nair@nexus.edu');
    log('  Student    : arjun.sharma@nexus.edu  (CGPA 8.9, good attendance)');
    log('  Student    : rohit.verma@nexus.edu   (CGPA 5.8, LOW attendance — at risk)');
    log('  Student    : divya.menon@nexus.edu   (CGPA 6.1, CRITICAL — detention risk)');
    log('  Parent     : suresh.sharma@gmail.com');
    log('  Placement  : placement@nexus.edu');
    log('══════════════════════════════════════════════════════\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message, err);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();
