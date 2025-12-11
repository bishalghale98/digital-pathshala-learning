import { ICategory } from "@/types/models";
import {  model, models, Schema } from "mongoose";


const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category =
  models.Category || model<ICategory>("Category", categorySchema);

export default Category;
