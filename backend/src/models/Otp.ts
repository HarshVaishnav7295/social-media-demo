import mongoose, { Schema,Document } from "mongoose";

const otpSchema = new Schema({
    text : String
},{timestamps:true})

export interface IOtp extends Document{
    text : string
}

export const Otp = mongoose.model<IOtp>('otp',otpSchema)