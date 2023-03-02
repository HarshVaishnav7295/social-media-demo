import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";
import { User } from "../models/User";

export interface IMessageReq {
  text: string;
  receiver: string;
  sender: string;
  chatId: string;
}
/*
export const getChatWith = async(req:Request,res:Response):Promise<void>=>{
    try{
        const {chatId,sender,receiver} = req.body as {chatId:string,sender:string,receiver:string}
        console.log("user-0 : ",sender)
        console.log("user-1 : ",receiver)
        console.log("chatid : all",chatId)
        if(!chatId){
            res.status(StatusCodes.BAD_REQUEST).json({
                "errorMessage":"Please provide chatId"
            })
        }else{
            const messages = await Message.find({
               chatId : chatId,
               sender : { $in : [ sender,receiver ] },
               receiver : { $in : [ sender,receiver ] }
            })
            console.log(messages)
            res.status(StatusCodes.OK).json({
                "Chat":messages
            })
        }
    }catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage":error
        })
    }
}
export const sendMessage = async(req:Request,res:Response):Promise<void>=>{
    try{
        const {text,sender,receiver,chatId} = req.body as IMessageReq
        
        if(!text || !receiver || !sender || !chatId){
            res.status(StatusCodes.BAD_REQUEST).json({
                "errorMessage":"Please provide text and receiverId"
            })
        }else{
            const message = await Message.create({
                text : text,
                sender : sender,
                receiver : receiver,
                chatId : chatId
            })
            if(message){
                res.status(StatusCodes.CREATED).json({
                    "message":message
                })
            }
            else{
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    "errorMessage":"Error occured in sending message"
                })
            }
            
        }
    }catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage":error
        })
    }
}
*/
export const accessChat = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { users } = req.body as { users: string[] };
    const u1 = await User.findById(users[0]);
    const u2 = await User.findById(users[1]);
    const messages = await Message.find({
      sender: { $in: [u1?._id, u2?._id] },
      receiver: { $in: [u1?._id, u2?._id] },
    });
    res.status(StatusCodes.OK).json({
      chat: messages,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorMessage: error,
    });
  }
};

export const markRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body as { id: string };
    const message = await Message.findByIdAndUpdate(id, {
      isRead: true,
    });
    res.status(StatusCodes.OK).json({
      readStatus: true,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorMessage: error,
    });
  }
};
