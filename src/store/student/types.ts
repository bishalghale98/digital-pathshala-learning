import { EnrollmentStatus } from "@/types/models";
import { ICourse } from "../course/types";
import { Status } from "../types";

export interface IStudent {
  _id: string;
  name: string;
  email: string;
  image: string;
}

export interface IMyCourse {
  _id: string;
  studentId: string;
  courseId: ICourse;
  enrolledAt: string;
  enrollmentStatus: EnrollmentStatus;
  whatsapp: string;
}

export interface ILesson {
  _id: string;
  courseId: ICourse;
  title: string;
  description: string;
  videoUrl: string;
}

export interface IInitialState {
  Students: IStudent[];
  status: Status;
  MyCourses: IMyCourse[];
  Lessons: ILesson[];
  ActiveLesson: ILesson | null;
}
