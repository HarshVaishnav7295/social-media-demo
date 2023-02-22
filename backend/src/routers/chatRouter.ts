import express from "express";
export const router = express.Router();
import { accessChat } from "../controller/chatController";
router.route("/accessChat").post(accessChat);
