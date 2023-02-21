import mongoose,{Schema,Document} from "mongoose";
import { IMessage } from "./Message";
import { IUserRef } from "./User";

interface IChat{
    users : IUserRef[],
    messages : IMessage[]
}

const chatSchema = new Schema({
    users : [{
        user : {
            type : mongoose.Types.ObjectId,
            ref : 'User'
        }
    }]
},{timestamps:true})

interface IChatModel extends IChat,Document{}

export const Chat = mongoose.model<IChatModel>('Chat',chatSchema)
