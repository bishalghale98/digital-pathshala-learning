import { ICourse } from "../course/types";
import { IStudent } from "../student/types";
import { Status } from "../types";
import { EnrollmentStatus } from "@/types/models";

export interface IEnrollment {
  _id: string;
  courseId: ICourse;
  studentId: IStudent;
  enrolledAt: Date;
  enrollmentStatus: EnrollmentStatus;
  whatsapp: string;
}

export interface IInitialState {
  Enrollments: IEnrollment[];
  status: Status;
}
