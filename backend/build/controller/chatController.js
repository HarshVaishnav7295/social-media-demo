"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markRead = exports.accessChat = void 0;
const http_status_codes_1 = require("http-status-codes");
const Message_1 = require("../models/Message");
const User_1 = require("../models/User");
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
const accessChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { users } = req.body;
        const u1 = yield User_1.User.findById(users[0]);
        const u2 = yield User_1.User.findById(users[1]);
        const messages = yield Message_1.Message.find({
            sender: { $in: [u1 === null || u1 === void 0 ? void 0 : u1._id, u2 === null || u2 === void 0 ? void 0 : u2._id] },
            receiver: { $in: [u1 === null || u1 === void 0 ? void 0 : u1._id, u2 === null || u2 === void 0 ? void 0 : u2._id] }
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            "chat": messages
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage": error
        });
    }
});
exports.accessChat = accessChat;
const markRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const message = yield Message_1.Message.findByIdAndUpdate(id, {
            isRead: true
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            "status": "marked"
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage": error
        });
    }
});
exports.markRead = markRead;
