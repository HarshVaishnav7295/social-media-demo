import mongoose, { Schema, Document } from "mongoose";
import { IMessage } from "./Message";
import { IUserRef } from "./User";

export interface IChat {
  users: IUserRef[];
  messages: IMessage[];
}

const chatSchema = new Schema(
  {
    users: [
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

export interface IChatModel extends IChat, Document {}

export const Chat = mongoose.model<IChatModel>("Chat", chatSchema);
