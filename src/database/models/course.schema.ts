import { ICourse } from "@/types/models";
import { model, models, Schema } from "mongoose";
import "@/database/models/category.schema";

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    slug: {
      type: String,
      required: [true, "Course slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [120, "Slug cannot exceed 120 characters"],
    },

    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    shortDescription: {
      type: String,
      trim: true,
      maxlength: [300, "Short description cannot exceed 300 characters"],
      default: null,
    },

    thumbnail: {
      type: String,
      trim: true,
      default: null,
    },

    duration: {
      type: String,
      required: [true, "Course duration is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Course price is required"],
      min: [0, "Price cannot be negative"],
    },

    isFree: {
      type: Boolean,
      default: false,
      index: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
      index: true,
    },

    subcategoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },

    status: {
      type: String,
      enum: {
        values: ["draft", "published", "archived"],
        message: "Status must be draft, published, or archived",
      },
      default: "draft",
      required: [true, "Course status is required"],
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

courseSchema.index({ categoryId: 1, status: 1 });
courseSchema.index({ subcategoryId: 1, status: 1 });
courseSchema.index({ status: 1, createdAt: -1 });

const Course = models.Course || model<ICourse>("Course", courseSchema);

export default Course;
