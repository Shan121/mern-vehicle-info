import mongoose from "mongoose";

export type UserType = {
  _id: string;
  email: string;
  password: string;
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: [50, "Name cannot exceed 50 characters"],
  },
  email: {
    type: String,
    trim: true,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Email is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false,
  },
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;
