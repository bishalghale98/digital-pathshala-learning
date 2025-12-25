import { EnrollmentStatus, IEnrollment } from "@/types/models";
import { Schema, model, models } from "mongoose";
import './course.schema'

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
    }
  },
  {
    timestamps: true,
  }
);

const Enrollment =
  models.Enrollment || model<IEnrollment>("Enrollment", enrollmentSchema);
export default Enrollment;
