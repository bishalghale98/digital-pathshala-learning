import { ICourse } from "../course/types";
import { Status } from "../types";

export interface ILesson {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  courseId: ICourse;
  createdAt: string;
}

export interface ILessonsInitialState {
  Lessons: ILesson[];
  status: Status;
}
