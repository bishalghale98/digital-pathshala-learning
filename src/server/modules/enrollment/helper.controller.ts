import prisma from "@/database/prisma";

async function populateStudents(enrollments: any) {
  if (!Array.isArray(enrollments) || enrollments.length === 0) {
    return enrollments;
  }

  const studentIds = enrollments.map((e) => e.studentId).filter(Boolean);

  if (studentIds.length === 0) {
    return enrollments;
  }

  // Note: Students are managed by Better Auth in a separate table
  // For now, we return the enrollments as-is
  // In a real implementation, you would query the Better Auth user table
  return enrollments.map((enrollment) => ({
    ...enrollment,
    studentId: enrollment.studentId,
  }));
}

async function populateStudentObj(enrollment: any) {
  if (!enrollment || !enrollment.studentId) return enrollment;

  // Note: Students are managed by Better Auth in a separate table
  return {
    ...enrollment,
    studentId: enrollment.studentId,
  };
}

export { populateStudentObj, populateStudents };
