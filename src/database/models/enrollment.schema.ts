import { EnrollmentStatus, IEnrollment, PaymentMethod } from "@/types/models";
import { Schema, model, models } from "mongoose";
import "./course.schema";

const enrollmentSchema = new Schema<IEnrollment>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    enrollmentStatus: {
      type: String,
      enum: [
        EnrollmentStatus.Approved,
        EnrollmentStatus.Pending,
        EnrollmentStatus.rejected,
      ],
      default: EnrollmentStatus.Pending,
    },
    whatsapp: {
      type: String,
    },
    paymentMethod: {
      type: String,
      enum: [PaymentMethod.Esewa, PaymentMethod.Khalti],
      default: PaymentMethod.Khalti,
    },
  },
  {
    timestamps: true,
  }
);

const Enrollment =
  models.Enrollment || model<IEnrollment>("Enrollment", enrollmentSchema);
export default Enrollment;
