'use strict';

module.exports = {
  AUTH: {
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logged out successfully',
    REGISTER_SUCCESS: 'Registration successful',
    INVALID_CREDENTIALS: 'Invalid email or password',
    TOKEN_EXPIRED: 'Access token expired',
    TOKEN_INVALID: 'Invalid token',
    TOKEN_REFRESHED: 'Token refreshed successfully',
    UNAUTHORIZED: 'You must be logged in to access this resource',
    FORBIDDEN: 'You do not have permission to perform this action',
    PASSWORD_RESET_SENT: 'Password reset email sent',
    PASSWORD_RESET_SUCCESS: 'Password reset successful',
  },
  STUDENT: {
    FETCH_SUCCESS: 'Students fetched successfully',
    FETCH_ONE_SUCCESS: 'Student fetched successfully',
    UPDATE_SUCCESS: 'Student updated successfully',
    NOT_FOUND: 'Student not found',
  },
  ATTENDANCE: {
    MARK_SUCCESS: 'Attendance marked successfully',
    FETCH_SUCCESS: 'Attendance fetched successfully',
    ALREADY_MARKED: 'Attendance already marked for this session',
    NOT_FOUND: 'No attendance records found',
  },
  MARKS: {
    UPLOAD_SUCCESS: 'Marks uploaded successfully',
    FETCH_SUCCESS: 'Marks fetched successfully',
    UPDATE_SUCCESS: 'Marks updated successfully',
    INVALID_RANGE: 'Marks exceed maximum allowed value',
    NOT_FOUND: 'No marks records found',
  },
  NOTIFICATION: {
    SEND_SUCCESS: 'Notification sent successfully',
    FETCH_SUCCESS: 'Notifications fetched successfully',
    MARKED_READ: 'Notifications marked as read',
  },
  REPORT: {
    GENERATE_SUCCESS: 'Report generated successfully',
    NOT_FOUND: 'Report data not found',
  },
  COMMON: {
    SERVER_ERROR: 'Internal server error. Please try again later.',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation failed',
    DELETED: 'Deleted successfully',
    UPDATED: 'Updated successfully',
    CREATED: 'Created successfully',
  },
};
