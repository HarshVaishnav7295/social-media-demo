import express from "express";
export const router = express.Router()
import {getChatWith,sendMessage,accessChat} from '../controller/chatController'
router.route('/getChatWith').post(getChatWith)
router.route('/sendMessage').post(sendMessage)
router.route('/accessChat').post(accessChat)