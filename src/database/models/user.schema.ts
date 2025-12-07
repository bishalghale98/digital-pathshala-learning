import { Role } from "@/lib/constants";
import { IUser } from "@/types/user";
import { model, models, Schema } from "mongoose";

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [Role.Admin, Role.Student],
    default: Role.Student,
  },
});

const User = models.User || model("User", userSchema);

export default User;
