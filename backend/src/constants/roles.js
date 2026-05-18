'use strict';

module.exports = {
  ROLES: {
    STUDENT: 'student',
    FACULTY: 'faculty',
    HOD: 'hod',
    PLACEMENT: 'placement',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin',
    PARENT: 'parent',
  },

  // Groups for middleware convenience
  ROLE_GROUPS: {
    STAFF: ['faculty', 'hod', 'placement', 'admin', 'super_admin'],
    MANAGEMENT: ['hod', 'admin', 'super_admin'],
    ALL: ['student', 'faculty', 'hod', 'placement', 'admin', 'super_admin', 'parent'],
  },
};
