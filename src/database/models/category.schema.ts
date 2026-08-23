import { ICategory } from "@/types/models";
import { model, models, Schema } from "mongoose";

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [100, "Category name cannot exceed 100 characters"],
    },

    slug: {
      type: String,
      required: [true, "Category slug is required"],
      lowercase: true,
      trim: true,
      maxlength: [120, "Category slug cannot exceed 120 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Category description cannot exceed 500 characters"],
      default: null,
    },

    image: {
      type: String,
      trim: true,
      default: null,
    },

    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
      min: [0, "Sort order cannot be negative"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


categorySchema.index({ parent: 1, name: 1 }, { unique: true });
categorySchema.index({ parent: 1, slug: 1 }, { unique: true });
categorySchema.index({ parent: 1, isActive: 1, sortOrder: 1 });

const Category =
  models.Category || model<ICategory>("Category", categorySchema);

export default Category;
