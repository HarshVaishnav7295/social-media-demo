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
    console.log('Connection successful with : ',socket.id)

    socket.on('setup',(data:string)=>{
        // this is for current user only
        //socket.join(data)
        //console.log(data)
        socket.emit("connected")
    })

    socket.on('Join Room',async(data:{chatId : string,users:{_id : string}[]})=>{
        socket.join(data.chatId)
        /*console.log("chatid:",data.chatId)*/
        const u1 = data.users[0]
        const u2 = data.users[1]
        const messages = await Message.find({
            chat : data.chatId,
            sender : { $in : [ u1._id,u2._id ] },
            receiver : { $in : [ u1._id,u2._id ] }
        })
        io.to(data.chatId).emit('MessagesUpdated',messages)
    })

    socket.on('sendMessage',async(data:{text:string,sender:mongoose.Types.ObjectId,receiver:mongoose.Types.ObjectId,chatId:string})=>{
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
            //console.log(messages)
            chat.users.forEach((user)=>{
                //console.log('Updated sent')
                io.to(chatId).emit('MessagesUpdated',{message,messages})  
            })
       }
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