import express from "express";
export const router = express.Router();
import { getChatWith, sendMessage } from "../controller/chatController";
router.route("/getChatWith").post(getChatWith);
router.route("/sendMessage").post(sendMessage);
