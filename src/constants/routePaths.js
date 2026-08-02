export const ROUTE_PATHS = {
  LOGIN: '/login',

  DASHBOARD: '/',

  DOCTOR_VERIFICATION: '/doctor-verification',

  DOCTORS: '/doctors',
  DOCTOR_NEW: '/doctors/new',
  DOCTOR_DETAILS: '/doctors/:doctorId',
  DOCTOR_EDIT: '/doctors/:doctorId/edit',

  PATIENTS: '/patients',
  PATIENT_NEW: '/patients/new',
  PATIENT_DETAILS: '/patients/:patientId',
  PATIENT_EDIT: '/patients/:patientId/edit',

  TICKETS: '/tickets',
  TICKET_DETAILS: '/tickets/:ticketId',

  SESSIONS: '/sessions',
  SESSIONS_CALENDAR: '/sessions/calendar',
  SESSION_DETAILS: '/sessions/:sessionId',

  PAYMENTS: '/payments',
  PAYMENT_DETAILS: '/payments/:paymentId',

  COMMUNITY_POSTS: '/community/posts',
  COMMUNITY_COMMENTS: '/community/comments',
  COMMUNITY_REPORTS: '/community/reports',

  NOTIFICATIONS: '/notifications',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  PROFILE: '/profile',
}

export const buildPath = (path, params = {}) => {
  let result = path
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, value)
  })
  return result
}
