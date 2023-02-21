"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
const chatController_1 = require("../controller/chatController");
exports.router.route('/getChatWith').post(chatController_1.getChatWith);
exports.router.route('/sendMessage').post(chatController_1.sendMessage);
exports.router.route('/accessChat').post(chatController_1.accessChat);
