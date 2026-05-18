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

const logger = console;

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nexus_intellect';

const seed = async () => {
  try {
    logger.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    logger.log('✅ Connected');

    // ── Clean slate ───────────────────────────────────────────────────────────
    await Promise.all([
      User.deleteMany({}), Student.deleteMany({}), Faculty.deleteMany({}),
      Parent.deleteMany({}), Department.deleteMany({}), Subject.deleteMany({}),
      Attendance.deleteMany({}), Marks.deleteMany({}), PlacementDrive.deleteMany({}),
    ]);
    logger.log('🧹 Database cleared');

    // ── Departments ───────────────────────────────────────────────────────────
    const [cse, ece, mech] = await Department.insertMany([
      { name: 'Computer Science Engineering', code: 'CSE', establishedYear: 1990 },
      { name: 'Electronics & Communication Engineering', code: 'ECE', establishedYear: 1992 },
      { name: 'Mechanical Engineering', code: 'MECH', establishedYear: 1988 },
    ]);
    logger.log('✅ Departments seeded');

    // ── Users ─────────────────────────────────────────────────────────────────
    const SALT = await bcrypt.genSalt(12);
    const hashedPass = await bcrypt.hash('Nexus@123', SALT);

    const [adminUser, hodUser, facultyUser, studentUser, parentUser, placementUser] = await User.insertMany([
      { name: 'Dr. Meena Iyer', email: 'admin@nexus.edu', passwordHash: hashedPass, role: 'admin', identifier: 'ADM001', isEmailVerified: true },
      { name: 'Dr. Ramesh Babu', email: 'hod.cse@nexus.edu', passwordHash: hashedPass, role: 'hod', identifier: 'HOD001', isEmailVerified: true },
      { name: 'Dr. Priya Nair', email: 'priya.nair@nexus.edu', passwordHash: hashedPass, role: 'faculty', identifier: 'FAC001', isEmailVerified: true },
      { name: 'Arjun Sharma', email: 'arjun.sharma@nexus.edu', passwordHash: hashedPass, role: 'student', identifier: 'CS21B047', isEmailVerified: true },
      { name: 'Mr. Suresh Sharma', email: 'suresh.sharma@gmail.com', passwordHash: hashedPass, role: 'parent', isEmailVerified: true },
      { name: 'Rajesh Kumar', email: 'placement@nexus.edu', passwordHash: hashedPass, role: 'placement', identifier: 'PLC001', isEmailVerified: true },
    ]);
    logger.log('✅ Users seeded');

    // ── Faculty ────────────────────────────────────────────────────────────────
    const hodFaculty = await Faculty.create({
      userId: hodUser._id, employeeId: 'HOD001', name: hodUser.name,
      department: cse._id, designation: 'HOD', joiningDate: new Date('2016-07-01'),
    });
    const facultyDoc = await Faculty.create({
      userId: facultyUser._id, employeeId: 'FAC001', name: facultyUser.name,
      department: cse._id, designation: 'Associate Professor', joiningDate: new Date('2019-08-01'),
    });

    // Update HOD ref on department
    await Department.findByIdAndUpdate(cse._id, { hodId: hodFaculty._id, totalFaculty: 2, totalStudents: 1 });
    logger.log('✅ Faculty seeded');

    // ── Subjects ──────────────────────────────────────────────────────────────
    const [dsa, os, dbms] = await Subject.insertMany([
      { name: 'Data Structures & Algorithms', code: 'CS301', credits: 4, department: cse._id, semester: 3, faculty: facultyDoc._id },
      { name: 'Operating Systems', code: 'CS302', credits: 4, department: cse._id, semester: 3, faculty: facultyDoc._id },
      { name: 'Database Management Systems', code: 'CS303', credits: 3, department: cse._id, semester: 3, faculty: facultyDoc._id },
    ]);
    await Faculty.findByIdAndUpdate(facultyDoc._id, { subjects: [dsa._id, os._id, dbms._id] });
    logger.log('✅ Subjects seeded');

    // ── Parent & Student ──────────────────────────────────────────────────────
    const parentDoc = await Parent.create({
      userId: parentUser._id, name: parentUser.name, relationship: 'father',
      phone: '9876543210', whatsappPhone: '9876543210', email: parentUser.email,
    });
    const studentDoc = await Student.create({
      userId: studentUser._id, usn: 'CS21B047', name: studentUser.name,
      department: cse._id, semester: 3, section: 'A', year: 2, cgpa: 8.5,
      parentId: parentDoc._id, admissionYear: 2021, passoutYear: 2025,
      skills: ['JavaScript', 'Python', 'React'],
    });
    await Parent.findByIdAndUpdate(parentDoc._id, { students: [studentDoc._id] });
    logger.log('✅ Student & Parent seeded');

    // ── Attendance records ────────────────────────────────────────────────────
    const subjects = [dsa, os, dbms];
    const today = new Date();
    const attendanceDocs = [];
    for (let i = 15; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      if (date.getDay() === 0 || date.getDay() === 6) continue; // Skip weekends
      for (const sub of subjects) {
        attendanceDocs.push({
          student: studentDoc._id, subject: sub._id, faculty: facultyDoc._id,
          department: cse._id, date, semester: 3, section: 'A', academicYear: '2024-25',
          status: Math.random() > 0.2 ? 'present' : 'absent',
        });
      }
    }
    await Attendance.insertMany(attendanceDocs);
    logger.log(`✅ Attendance seeded: ${attendanceDocs.length} records`);

    // ── Marks records ─────────────────────────────────────────────────────────
    const marksDocs = subjects.flatMap((sub) => [
      { student: studentDoc._id, subject: sub._id, faculty: facultyDoc._id, department: cse._id, type: 'internal1', marks: Math.floor(Math.random() * 20 + 30), maxMarks: 50, semester: 3, academicYear: '2024-25', isPublished: true, publishedAt: new Date() },
      { student: studentDoc._id, subject: sub._id, faculty: facultyDoc._id, department: cse._id, type: 'assignment', marks: Math.floor(Math.random() * 5 + 13), maxMarks: 20, semester: 3, academicYear: '2024-25', isPublished: true, publishedAt: new Date() },
    ]);
    await Marks.insertMany(marksDocs);
    logger.log(`✅ Marks seeded: ${marksDocs.length} records`);

    // ── Placement drives ──────────────────────────────────────────────────────
    await PlacementDrive.insertMany([
      {
        company: { name: 'Google', industry: 'Technology', description: 'Search giant hiring engineers' },
        role: 'Software Engineer L3', ctcDisplay: '30-45 LPA', ctcRange: { min: 3000000, max: 4500000 },
        eligibility: { minCGPA: 8.0, allowedBranches: [cse._id], maxBacklogs: 0 },
        driveDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        lastApplyDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        rounds: ['Aptitude', 'Technical Round 1', 'Technical Round 2', 'HR'],
        status: 'upcoming', createdBy: adminUser._id,
      },
      {
        company: { name: 'Infosys', industry: 'IT Services' },
        role: 'Systems Engineer', ctcDisplay: '4.5 LPA',
        eligibility: { minCGPA: 6.5, allowedBranches: [cse._id, ece._id], maxBacklogs: 2 },
        driveDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        rounds: ['Aptitude', 'Technical', 'HR'],
        status: 'upcoming', createdBy: adminUser._id,
      },
      {
        company: { name: 'TCS', industry: 'IT Services' },
        role: 'Assistant System Engineer', ctcDisplay: '3.5 LPA',
        eligibility: { minCGPA: 6.0 },
        driveDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'completed', createdBy: adminUser._id,
        applicants: [{ student: studentDoc._id, status: 'selected', ctcOffered: '3.5 LPA' }],
      },
    ]);
    logger.log('✅ Placement drives seeded');

    logger.log('\n══════════════════════════════════════════════════════');
    logger.log('🎉 SEED COMPLETE — Nexus Intellect Database Ready!');
    logger.log('══════════════════════════════════════════════════════');
    logger.log('\n📧 Login credentials (password: Nexus@123):');
    logger.log('  Admin      : admin@nexus.edu');
    logger.log('  HOD        : hod.cse@nexus.edu');
    logger.log('  Faculty    : priya.nair@nexus.edu');
    logger.log('  Student    : arjun.sharma@nexus.edu  | USN: CS21B047');
    logger.log('  Parent     : suresh.sharma@gmail.com');
    logger.log('  Placement  : placement@nexus.edu');
    logger.log('══════════════════════════════════════════════════════\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    logger.error('❌ Seed failed:', err.message);
    console.error(err);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();
