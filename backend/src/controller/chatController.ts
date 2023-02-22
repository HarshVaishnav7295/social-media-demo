import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Message } from "../models/Message";
import { User } from "../models/User";

export interface IMessageReq {
  text: string;
  receiverId: string;
}

export const getChatWith = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const receiverId = req.body.receiverId;
    const senderId = req.body.senderId;
    if (!receiverId || !senderId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        errorMessage: "Please provide receiverId",
      });
    } else {
      const receiverUser = await User.findById(receiverId);
      if (!receiverUser) {
        res.status(StatusCodes.BAD_REQUEST).json({
          errorMessage: "No user with this id",
        });
      } else {
        // const chat = await Message.find({
        //   sender: senderId,
        //   receiver: receiverId,
        // });
        const chat = await Message.find({
          $or: [
            {
              sender: senderId,
              receiver: receiverId,
            },
            {
              sender: receiverId,
              receiver: senderId,
            },
          ],
        });
        res.status(StatusCodes.OK).json({
          Chat: chat,
        });
      }
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorMessage: error,
    });
  }
};
export const sendMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { text, receiverId } = req.body as IMessageReq;
    const senderId = req.body.user.id;
    if (!text || !receiverId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        errorMessage: "Please provide text and receiverId",
      });
    } else {
      const receiverUser = await User.findById(receiverId);
      if (!receiverUser) {
        res.status(StatusCodes.BAD_REQUEST).json({
          errorMessage: "No user with this id",
        });
      } else {
        const message = await Message.create({
          text: text,
          sender: senderId,
          receiver: receiverId,
        });
        if (message) {
          res.status(StatusCodes.CREATED).json({
            message: message,
          });
        } else {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errorMessage: "Error occured in sending message",
          });
        }
      }
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorMessage: error,
    });
  }
};
