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
const Message_1 = require("../models/Message");
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
app.use((0, cors_1.default)());
app.use('/api/auth', authRouter_1.router);
app.use('/api/user', AuthenticationMiddleware_1.authenticaton, userRouter_1.router);
app.use('/api/post', AuthenticationMiddleware_1.authenticaton, postRouter_1.router);
app.use('/api/chat', AuthenticationMiddleware_1.authenticaton, chatRouter_1.router);
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PATCH"]
    }
});
io.on('connection', (socket) => {
    console.log('Connection successful with : ', socket.id);
    socket.on('setup', (id) => {
        // creating room for current user
        socket.join(id);
        console.log("User : ", id, " has joined the room : ", id);
        //console.log(data)
    });
    socket.on('Leave Room', (data) => {
        socket.leave(data);
        console.log('User has left the room : ', data);
    });
    /*socket.on('Join Room',async(data:{chatId : string,users:{_id : string}[]})=>{
        socket.join(data.chatId)
        //console.log("chatid:",data.chatId)
        const u1 = data.users[0]
        const u2 = data.users[1]
        const messages = await Message.find({
            chat : data.chatId,
            sender : { $in : [ u1._id,u2._id ] },
            receiver : { $in : [ u1._id,u2._id ] }
        })
        io.to(data.chatId).emit('MessagesUpdated',messages)
    })*/
    socket.on('Join Room', function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            socket.join(data.roomId);
            console.log("User has joined the room : ", data.roomId);
            /*const messages = await Message.find({
                sender : { $in : [ data.roomId,data.currUserId ] },
                receiver : { $in : [ data.roomId,data.currUserId ] }
            })
            //console.log(messages)
            cb(messages)*/
            //io.to(data.currUserId).emit('MessagesUpdated',{"roomId":data.roomId,"messages" : messages})
        });
    });
    /*socket.on('sendMessage',async(data:{text:string,sender:mongoose.Types.ObjectId,receiver:mongoose.Types.ObjectId,chatId:string})=>{
        var chatId = data.chatId
        //console.log(data)
        const chat = await Chat.findById(chatId)
        if(!chat?.users){
            console.log('chat.users not defined')
        }else{
            const message = await Message.create({
                text : data.text,
                sender : data.sender,
                receiver :  data.receiver,
                chat : chatId
            })
            const messages = await Message.find({
                chat : chatId,
                sender : { $in : [ data.sender,data.receiver ] },
                receiver : { $in : [ data.sender,data.receiver ] }
            })
            
            io.to(chatId).emit('MessagesUpdated',{message,messages})
            //console.log(messages)
            
       }
    })*/
    socket.on('sendMessage', function (data, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(data);
            const message = yield Message_1.Message.create({
                text: data.text,
                sender: data.sender,
                receiver: data.receiver
            });
            io.to(data.receiver.toString()).emit('MessagesUpdated', { "newMessage": message });
            cb(message);
            /*console.log("Message : ",message)
            console.log("RoomID : ",roomId)
            const messages = await Message.find({
                sender : { $in : [ data.sender,data.receiver ] },
                receiver : { $in : [ data.sender,data.receiver ] }
            })
            */
            // io.to(data.sender.toString()).emit('MessagesUpdated',{"roomId":roomId,"newMessage":message,"messages":messages}) 
            //console.log(messages)
        });
    });
});
const port = 8000 || process.env.PORT;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // atlas -> 
        // special char are encoded so @ -> %40
        //mongodb+srv://root:<password>@cluster0.mm6h4yu.mongodb.net/?retryWrites=true&w=majority
        // replace <password> with real password : here, root12341234 (erase the <>)
        (0, dbConnect_1.connectDB)('mongodb+srv://root:root12341234@cluster0.mm6h4yu.mongodb.net/?retryWrites=true&w=majority');
        // compass ->connectDB('mongodb://127.0.0.1:27017/InstaDB')
        server.listen(port, () => {
            console.log('Server is running on port : ', port);
        });
    }
    catch (error) {
        console.log('Error in starting server.');
    }
});
startServer();
app.get('/isServerOn', (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).json({
        "message": "server is listening"
    });
});
