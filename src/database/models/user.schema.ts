import { Role } from "@/lib/constants";
import { IUser } from "@/types/user";
import { model, models, Schema } from "mongoose";

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: [Role.Admin, Role.Student],
      default: Role.Student,
    },
  },
  {
    timestamps: true,
  }
);

const User = models.User || model<IUser>("User", userSchema);

export default User;
