import mongoose, { Schema, Document, ObjectId } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import { NextFunction } from "express";
interface IUser {
  name: string;
  email: string;
  password: string;
  dob: string;
  gender: string;
  bio: string;
  avatar: string;
  followers: IUserRef[];
  followings: IUserRef[];
  comparePassword(enteredPassword: string): Promise<boolean>;
}

export interface IUserRef {
  _id: mongoose.Types.ObjectId;
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
    },
    email: {
      type: String,
      unique: [true, "Email already taken,try different one"],
      required: [true, "Please provide email"],
      validate: function (value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("Please provide correct email");
        }
      },
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
    },
    dob: Date,
    gender: String,
    bio: String,
    avatar: String,
    followers: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    followings: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  const matched = await bcrypt.compare(enteredPassword, this.password);
  return matched;
};

export interface IUserModel extends IUser, Document {}
export const User = mongoose.model<IUserModel>("User", userSchema);
