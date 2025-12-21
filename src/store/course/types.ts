import { ICategory } from "../category/types";
import { Status } from "../types";

export interface ICourse {
  _id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  categoryId: ICategory;
  createdAt: string;
}

export interface ICoursesInitialState {
  Courses: ICourse[];
  status: Status;
}
