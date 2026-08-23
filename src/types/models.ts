import { Document, Types } from "mongoose";

// ====== Status Enum ======
export enum Status {
  Pending = "Pending",
  Completed = "Completed",
  Failed = "Failed",
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
  lessonNumber?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// ====== Enrollment Interface ======

// Enrollment status
export enum EnrollmentStatus {
  Approved = "Approved",
  Pending = "Pending",
  Rejected = "Rejected",
}

export interface IEnrollment extends Document {
  studentId: Types.ObjectId;
  courseId: Types.ObjectId;
  enrollmentStatus: EnrollmentStatus;
  enrolledAt: Date;
  whatsapp: string;
  completedLessons: Types.ObjectId[];
  lastAccessedLesson?: Types.ObjectId;
  lastAccessedAt?: Date;
  paymentMethod: PaymentMethod;
}

export enum PaymentMethod {
  Khalti = "khalti",
  Esewa = "esewa",
}

// ====== Payment Interface ======
export interface IPayment extends Document {
  enrollment: Types.ObjectId;
  amount: number;
  status: Status;
  paymentMethod: PaymentMethod;
  transactionId: string;
  pidx: string;
  createdAt?: Date;
  updatedAt?: Date;
}
