import { Document, Types } from "mongoose";

// ====== Status Enum ======
export enum Status {
  Pending = "pending",
  Completed = "completed",
  Failed = "failed",
}

// ====== Category Interface ======
export interface ICategory extends Document {
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ====== Course Interface ======
export interface ICourse extends Document {
  title: string;
  description: string;
  duration?: string;
  price: number;
  categoryId: Types.ObjectId;
  lessons?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

// ====== Lesson Interface ======
export interface ILesson extends Document {
  courseId: Types.ObjectId;
  title: string;
  description?: string;
  videoUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ====== Enrollment Interface ======

// Enrollment status
export enum EnrollmentStatus {
  Approved = "approved",
  Pending = "pending",
  rejected = "rejected",
}

export interface IEnrollment extends Document {
  studentId: Types.ObjectId;
  courseId: Types.ObjectId;
  enrollmentStatus: EnrollmentStatus;
  enrolledAt: Date;
  whatsapp: string;
}

// ====== Payment Interface ======
export interface IPayment extends Document {
  student: Types.ObjectId;
  course: Types.ObjectId;
  amount: number;
  status: Status;
  createdAt?: Date;
  updatedAt?: Date;
}
