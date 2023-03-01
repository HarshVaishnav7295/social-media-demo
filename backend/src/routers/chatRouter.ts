import express from "express";
export const router = express.Router();
import { accessChat,markRead } from "../controller/chatController";
router.route("/accessChat").post(accessChat);
router.route('/markRead').post(markRead)
