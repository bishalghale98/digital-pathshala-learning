import { IEnrollment } from "@/types/models";
import { Schema,  model, models } from "mongoose";


const enrollmentSchema = new Schema<IEnrollment>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Enrollment =
  models.Enrollment || model<IEnrollment>("Enrollment", enrollmentSchema);
export default Enrollment;
