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
exports.sendMessage = exports.getChatWith = void 0;
const http_status_codes_1 = require("http-status-codes");
const Message_1 = require("../models/Message");
const User_1 = require("../models/User");
const getChatWith = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receiverId = req.body.receiverId;
        const senderId = req.body.senderId;
        if (!receiverId || !senderId) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                errorMessage: "Please provide receiverId",
            });
        }
        else {
            const receiverUser = yield User_1.User.findById(receiverId);
            if (!receiverUser) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    errorMessage: "No user with this id",
                });
            }
            else {
                // const chat = await Message.find({
                //   sender: senderId,
                //   receiver: receiverId,
                // });
                const chat = yield Message_1.Message.find({
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
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    Chat: chat,
                });
            }
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            errorMessage: error,
        });
    }
});
exports.getChatWith = getChatWith;
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text, receiverId } = req.body;
        const senderId = req.body.user.id;
        if (!text || !receiverId) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                errorMessage: "Please provide text and receiverId",
            });
        }
        else {
            const receiverUser = yield User_1.User.findById(receiverId);
            if (!receiverUser) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    errorMessage: "No user with this id",
                });
            }
            else {
                const message = yield Message_1.Message.create({
                    text: text,
                    sender: senderId,
                    receiver: receiverId,
                });
                if (message) {
                    res.status(http_status_codes_1.StatusCodes.CREATED).json({
                        message: message,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        errorMessage: "Error occured in sending message",
                    });
                }
            }
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            errorMessage: error,
        });
    }
});
exports.sendMessage = sendMessage;
