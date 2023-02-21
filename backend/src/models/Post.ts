import express from 'express'
import mongoose,{Schema,Document} from 'mongoose'
import {IUserRef} from './User'
interface IPost{
    description:string
    img:string
    createdBy:IUserRef
    likedBy : IUserRef[]
    likes : number
}

const postSchema = new Schema({
    description : {
        type:String,
        required:[true,'Please provide description']
    },
    image:String,
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    likedBy:[
        {user:{
            type:mongoose.Types.ObjectId,
            ref:'User'
        }}
    ],
    likes : {
        type:Number,
        default:0
    }
},{timestamps:true})

interface IPostModel extends IPost,Document{}

export const Post = mongoose.model<IPostModel>('Post',postSchema)