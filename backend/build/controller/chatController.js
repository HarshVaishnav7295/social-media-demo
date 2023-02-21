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
exports.accessChat = exports.sendMessage = exports.getChatWith = void 0;
const http_status_codes_1 = require("http-status-codes");
const Chat_1 = require("../models/Chat");
const Message_1 = require("../models/Message");
const User_1 = require("../models/User");
const getChatWith = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId, sender, receiver } = req.body;
        console.log("user-0 : ", sender);
        console.log("user-1 : ", receiver);
        console.log("chatid : all", chatId);
        if (!chatId) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                "errorMessage": "Please provide chatId"
            });
        }
        else {
            const messages = yield Message_1.Message.find({
                chatId: chatId,
                sender: { $in: [sender, receiver] },
                receiver: { $in: [sender, receiver] }
            });
            console.log(messages);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                "Chat": messages
            });
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage": error
        });
    }
});
exports.getChatWith = getChatWith;
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text, sender, receiver, chatId } = req.body;
        if (!text || !receiver || !sender || !chatId) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                "errorMessage": "Please provide text and receiverId"
            });
        }
        else {
            const message = yield Message_1.Message.create({
                text: text,
                sender: sender,
                receiver: receiver,
                chatId: chatId
            });
            if (message) {
                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    "message": message
                });
            }
            else {
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    "errorMessage": "Error occured in sending message"
                });
            }
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage": error
        });
    }
});
exports.sendMessage = sendMessage;
const accessChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { users } = req.body;
        const u1 = yield User_1.User.findById(users[0]);
        const u2 = yield User_1.User.findById(users[1]);
        const chat = yield Chat_1.Chat.find({
            $and: [
                { users: { $elemMatch: { _id: { $eq: u1 === null || u1 === void 0 ? void 0 : u1._id } } } },
                { users: { $elemMatch: { _id: { $eq: u2 === null || u2 === void 0 ? void 0 : u2._id } } } },
            ]
        });
        if (chat.length === 0) {
            const newChat = yield Chat_1.Chat.create({
                users: [u1, u2]
            });
            res.status(http_status_codes_1.StatusCodes.OK).json({
                "chat": newChat
            });
        }
        else {
            res.status(http_status_codes_1.StatusCodes.OK).json({
                "chat": chat
            });
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage": error
        });
    }
});
exports.accessChat = accessChat;
