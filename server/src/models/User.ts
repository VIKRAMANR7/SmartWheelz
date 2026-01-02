import mongoose, { Schema, Types } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "owner" | "user";
  image: string;
}

export interface IUserWithId extends IUser {
  _id: Types.ObjectId;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["owner", "user"], default: "user" },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
