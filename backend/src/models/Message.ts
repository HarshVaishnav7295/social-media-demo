import mongoose, { Schema, Document } from "mongoose";
import { IUserRef } from "./User";

export interface IMessage {
  text: string;
  sender: IUserRef;
  receiver: IUserRef;
  isRead: boolean;
}

const messageSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "Please provide trxt"],
    },
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export interface IMessageModel extends IMessage, Document {}

export const Message = mongoose.model<IMessageModel>("Message", messageSchema);
