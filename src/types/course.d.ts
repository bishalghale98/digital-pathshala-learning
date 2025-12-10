import { Document } from "mongoose";

interface ICourse extends Document {
  courseName: string;
  courseDescription: string;
  coursePrice: number;
  courseDuration: string;
}
