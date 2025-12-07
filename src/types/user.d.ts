import { Role } from "@/lib/constants";
import { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  profileImage: string;
  email: string;
  role: Role;
}
