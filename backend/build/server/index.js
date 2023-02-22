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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dbConnect_1 = require("../dbSettings/dbConnect");
const http_status_codes_1 = require("http-status-codes");
const authRouter_1 = require("../routers/authRouter");
const userRouter_1 = require("../routers/userRouter");
const postRouter_1 = require("../routers/postRouter");
const chatRouter_1 = require("../routers/chatRouter");
const AuthenticationMiddleware_1 = require("../middleware/AuthenticationMiddleware");
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const Chat_1 = require("../models/Chat");
const Message_1 = require("../models/Message");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/auth", authRouter_1.router);
app.use("/api/user", AuthenticationMiddleware_1.authenticaton, userRouter_1.router);
app.use("/api/post", AuthenticationMiddleware_1.authenticaton, postRouter_1.router);
app.use("/api/chat", AuthenticationMiddleware_1.authenticaton, chatRouter_1.router);
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PATCH"],
    },
});
io.on("connection", (socket) => {
    // console.log("Connection successful with : ", socket.id);
    /*socket.on('setup',(data:string)=>{
          // this is for current user only
          //socket.join(data)
          //console.log(data)
          socket.emit("connected")
      })*/
    socket.on("Leave Room", (data) => {
        socket.leave(data);
    });
    socket.on("Join Room", (data) => __awaiter(void 0, void 0, void 0, function* () {
        socket.join(data.chatId);
        /*console.log("chatid:",data.chatId)*/
        const u1 = data.users[0];
        const u2 = data.users[1];
        const messages = yield Message_1.Message.find({
            chat: data.chatId,
            sender: { $in: [u1._id, u2._id] },
            receiver: { $in: [u1._id, u2._id] },
        });
        io.to(data.chatId).emit("MessagesUpdated", messages);
    }));
    socket.on("sendMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
        var chatId = data.chatId;
        //console.log(data)
        const chat = yield Chat_1.Chat.findById(chatId);
        if (!(chat === null || chat === void 0 ? void 0 : chat.users)) {
            console.log("chat.users not defined");
        }
        else {
            const message = yield Message_1.Message.create({
                text: data.text,
                sender: data.sender,
                receiver: data.receiver,
                chat: chatId,
            });
            const messages = yield Message_1.Message.find({
                chat: chatId,
                sender: { $in: [data.sender, data.receiver] },
                receiver: { $in: [data.sender, data.receiver] },
            });
            io.to(chatId).emit("MessagesUpdated", { message, messages });
            //console.log(messages)
        }
    }));
});
const port = 8000 || process.env.PORT;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, dbConnect_1.connectDB)("mongodb+srv://anirudhTechtic:fZK29xuvheH0j3aV@cluster0.hyodz5j.mongodb.net/CLONE?retryWrites=true&w=majority");
        // compass ->connectDB('mongodb://127.0.0.1:27017/InstaDB')
        server.listen(port, () => {
            console.log("Server is running on port : ", port);
        });
    }
    catch (error) {
        console.log("Error in starting server.");
    }
});
startServer();
app.get("/isServerOn", (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).json({
        message: "server is listening",
    });
});
