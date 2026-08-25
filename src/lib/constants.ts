export const Roles = {
  Admin: "admin",
  Student: "student",
} as const;

export const ROUTES = {
  // Public
  HOME: '/',
  COURSES: '/courses',
  ABOUT: '/about-us',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  PROFILE: '/profile',
  UNAUTHORIZED: '/unauthorized',

  // Dynamic public
  courseDetail: (slug: string) => `/courses/${slug}`,

  // Student dashboard
  STUDENT_DASHBOARD: '/student',
  STUDENT_MY_COURSES: '/student/mycourse',
  STUDENT_COURSES: '/student/courses',
  STUDENT_SETTINGS: '/student/settings',

  // Student dynamic
  studentCourseSyllabus: (courseId: string) =>
    `/student/mycourse?section=course-syllabus&courseId=${courseId}`,
  studentVideoPlay: (courseId: string, lessonId: string) =>
    `/student/mycourse?section=video_play&courseId=${courseId}&lessonId=${lessonId}`,

  // Admin dashboard
  ADMIN_DASHBOARD: '/admin',
  ADMIN_STUDENTS: '/admin/students',
  ADMIN_COURSES: '/admin/courses',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_ENROLLMENTS: '/admin/enrollments',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_SETTINGS: '/admin/settings',

  ADMIN_COURSE_CREATE: '/admin/courses?type=create',
  ADMIN_COURSE_EDIT: (courseId: string) => `/admin/courses?type=edit&courseId=${courseId}`,


  // Admin dynamic
  adminCourseLessons: (courseId: string) => `/admin/courses/${courseId}/lessons`,
} as const;
