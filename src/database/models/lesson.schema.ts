import { ILesson } from "@/types/models";
import { model, models, Schema } from "mongoose";
import './course.schema'

const lessonSchema = new Schema<ILesson>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    videoUrl: {
      type: String,
      trim: true,
    },
    lessonNumber: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Lesson = models.Lesson || model<ILesson>("Lesson", lessonSchema);

export default Lesson;
