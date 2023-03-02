import express,{Request,Response} from 'express'
import cors from 'cors'
import { connectDB } from '../dbSettings/dbConnect'
import { StatusCodes } from 'http-status-codes'
import {router as AuthRouter} from '../routers/authRouter' 
import {router as UserRouter} from '../routers/userRouter'
import {router as PostRouter} from '../routers/postRouter'
import {router as chatRouter} from '../routers/chatRouter'
import { authenticaton } from '../middleware/AuthenticationMiddleware'
import http from 'http'
import { Server } from 'socket.io'
import { Chat } from '../models/Chat'
import { Message } from '../models/Message'
import mongoose, { ObjectId } from 'mongoose'
const app = express()
app.use(express.json())
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cors())
app.use('/api/auth',AuthRouter)
app.use('/api/user',authenticaton,UserRouter)
app.use('/api/post',authenticaton,PostRouter)
app.use('/api/chat',authenticaton,chatRouter)

const server = http.createServer(app)
const io = new Server(server,{
    cors: {
        origin: "http://localhost:3000",
        methods : ["GET","POST","PATCH"]
    }
})

io.on('connection',(socket)=>{
    //console.log('Connection successful with : ',socket.id)

    socket.on('setup',(id:string)=>{
        // creating room for current user
        socket.join(id)
        //console.log("User : ",id," has joined the room : ",id)
        //console.log(data)
    })
    socket.on('Leave Room',(data:string)=>{
        socket.leave(data)
        //console.log('User has left the room : ',data)
    })

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
    socket.on('Join Room',async function(data:{roomId:string}){
        socket.join(data.roomId)
        //console.log("User has joined the room : ",data.roomId)
        /*const messages = await Message.find({
            sender : { $in : [ data.roomId,data.currUserId ] },
            receiver : { $in : [ data.roomId,data.currUserId ] }
        })
        //console.log(messages)
        cb(messages)*/
        //io.to(data.currUserId).emit('MessagesUpdated',{"roomId":data.roomId,"messages" : messages})
    })

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
    socket.on('sendMessage',async function(data:{text:string,sender:mongoose.Types.ObjectId,receiver:mongoose.Types.ObjectId},cb){
        
        //console.log(data)
        
        const message = await Message.create({
            text : data.text,
            sender : data.sender,
            receiver :  data.receiver
        })
        io.to(data.receiver.toString()).emit('MessagesUpdated',{"newMessage":message}) 
        
        cb(message)
        /*console.log("Message : ",message)
        console.log("RoomID : ",roomId)
        const messages = await Message.find({
            sender : { $in : [ data.sender,data.receiver ] },
            receiver : { $in : [ data.sender,data.receiver ] }
        })
        */
        // io.to(data.sender.toString()).emit('MessagesUpdated',{"roomId":roomId,"newMessage":message,"messages":messages}) 
        //console.log(messages)
    })

})

const port = 8000 || process.env.PORT
const startServer = async()=>{
    try{        
        // atlas -> 
        // special char are encoded so @ -> %40
        //mongodb+srv://root:<password>@cluster0.mm6h4yu.mongodb.net/?retryWrites=true&w=majority
        // replace <password> with real password : here, root12341234 (erase the <>)
        connectDB('mongodb+srv://root:root12341234@cluster0.mm6h4yu.mongodb.net/?retryWrites=true&w=majority')
        // compass ->connectDB('mongodb://127.0.0.1:27017/InstaDB')
        server.listen(port,()=>{
            console.log('Server is running on port : ',port)
        })
    }
    catch(error){
        console.log('Error in starting server.')
    }
}

startServer()

app.get('/isServerOn',(req:Request,res:Response)=>{
    res.status(StatusCodes.OK).json({
        "message":"server is listening"
    })
})