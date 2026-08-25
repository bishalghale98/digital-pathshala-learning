import type { MyCourse } from "@/store/student/studentApi"
import type { Course } from "@/store/course/courseApi"

export const getCourse = (enrollment: MyCourse): Course | null => {
  if (typeof enrollment.courseId === "object" && enrollment.courseId !== null) {
    return enrollment.courseId as Course
  }
  return null
}

export const getCourseId = (courseId: string | { id: string }): string =>
  typeof courseId === "string" ? courseId : courseId.id
