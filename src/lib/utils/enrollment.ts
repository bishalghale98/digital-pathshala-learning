import type { MyCourse } from "@/store/student/studentApi"
import type { StudentUser } from "@/store/student/studentApi"
import type { Course } from "@/store/course/courseApi"
import type { Enrollment } from "@/store/enrollment/enrollmentApi"

type Student = Pick<StudentUser, "id" | "name" | "email">
type CourseBasic = Pick<Course, "id" | "title">

export const getCourse = (enrollment: MyCourse): Course | null => {
  if (typeof enrollment.courseId === "object" && enrollment.courseId !== null) {
    return enrollment.courseId as Course
  }
  return null
}

export const getCourseId = (courseId: string | { id: string }): string =>
  typeof courseId === "string" ? courseId : courseId.id

export const getEnrolledStudent = (
  students: Student[],
  enrollment: Enrollment
): Student | null =>
  students.find((student) => student.id === enrollment.studentId) ?? null

export const getEnrolledCourse = (
  courses: CourseBasic[],
  enrollment: Enrollment
): CourseBasic | null =>
  courses.find((course) => course.id === enrollment.courseId) ?? null
