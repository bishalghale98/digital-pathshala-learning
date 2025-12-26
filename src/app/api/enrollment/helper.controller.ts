import { db } from "@/lib/auth";
import { ObjectId } from "mongodb";

async function populateStudents(enrollments: any) {
  if (!Array.isArray(enrollments) || enrollments.length === 0) {
    return enrollments;
  }

  const studentIds = enrollments.map((e) => e.studentId);
  const users = await db
    .collection("user")
    .find({ _id: { $in: studentIds } })
    .toArray();

  return enrollments.map((enrollment) => {
    const user = users.find(
      (u) => u._id.toString() === enrollment.studentId.toString()
    );
    return {
      ...enrollment,
      studentId: user || null,
    };
  });
}

// Helper to populate a single enrollment object
async function populateStudentObj(enrollment: any) {
  if (!enrollment || !enrollment.studentId) return enrollment;

  const user = await db
    .collection("user")
    .findOne({ _id: new ObjectId(enrollment.studentId) });

  return {
    ...enrollment,
    studentId: user || null,
  };
}

export { populateStudentObj, populateStudents };
