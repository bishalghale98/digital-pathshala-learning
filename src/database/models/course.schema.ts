import { ICourse } from "@/types/course";
import { model, models, Schema } from "mongoose";

const courseSchema = new Schema<ICourse>(
  {
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    courseDescription: {
      type: String,
      required: true,
      trim: true,
    },
    coursePrice: {
      type: Number,
      required: true,
    },
    courseDuration: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Course = models.Course || model<ICourse>("Course", courseSchema);

export default Course;
