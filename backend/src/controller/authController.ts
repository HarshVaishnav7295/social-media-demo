import {Request,Response} from 'express'
import { StatusCodes } from 'http-status-codes'
import { User } from '../models/User'
import { generateToken, refreshTokenSecret } from '../utils/tokenGenerator'
import jwt, { JwtPayload } from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import otpGenerator from 'otp-generator'
import hbs from 'nodemailer-express-handlebars'
import fs from 'fs'
import path from 'path'
import ejs from 'ejs'
import { Otp } from '../models/Otp'
import https from 'https'
import {OAuth2Client} from 'google-auth-library'
import {google} from 'googleapis'
export const CLIENT_ID = '988673980743-dk1gmto7c74rktvdbvo2tg77uk2v78tg.apps.googleusercontent.com'
export const API_KEY = 'AIzaSyA8-3vRKvF9CC1jHZBWeNWUdL-NCZkaNBY'
import imageToBase64 from 'image-to-base64';
//const SEND_GRID_KEY = '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'
//import sgMail from '@sendgrid/mail'
interface ISignupRequest{
    name : string
    email : string
    password : string
    dob : string
    gender : string
    bio : string
    avatar : string
}

interface ILoginRequest{
    email : string
    password : string
}

export const signupUser = async(req:Request,res:Response):Promise<void>=>{
    try{
        const {name,email,password,dob,gender,bio,avatar} = req.body as ISignupRequest
        if(!name || !email || !password || !dob){
            res.status(StatusCodes.BAD_REQUEST).json({
                "errorMessage":"name,email,password,dob are required."
            })
        }else{
            const userExists = await User.findOne({
                email : email
            })
            if(userExists){
                res.status(StatusCodes.BAD_REQUEST).json({
                    "errorMessage":"Email is already in user,Try different one."
                })
            }
            else{
                const userWithoutToken = await User.create({
                    name:name,
                    email:email,
                    password:password,
                    dob:new Date(dob),
                    gender : gender,
                    bio:bio,
                    avatar:avatar
                })
                
                const {accessToken,refreshToken} = await generateToken(userWithoutToken._id)
                const user = await User.findByIdAndUpdate(userWithoutToken._id,{
                    refreshToken : refreshToken
                })
                //const token = await generateToken(user._id)
                res.status(StatusCodes.CREATED).json({
                    user : {
                        _id : user?._id,
                        name : user?.name,
                        email : user?.email,
                        dob : user?.dob,
                        gender : user?.gender,
                        bio : user?.bio,
                        avatar:user?.avatar,
                        followings : user?.followings,
                        followers : user?.followers,
                        accessToken : accessToken,
                        refreshToken : refreshToken
                    }
                })
            }
        }
    }
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage":error
        })
    }
}

export const loginUser = async(req:Request,res:Response):Promise<void>=>{
    try{
        const {email,password} = req.body as ILoginRequest
        if(!email || !password ){
            res.status(StatusCodes.BAD_REQUEST).json({
                "errorMessage":"email,password are required."
            })
        }else{
            const userWithoutToken = await User.findOne({
                email : email
            })
            if(!userWithoutToken){
                res.status(StatusCodes.BAD_REQUEST).json({
                    "errorMessage":"No user with provided email."
                })
            }
            else{
                const correctCredentials = await userWithoutToken.comparePassword(password)
                if(correctCredentials){
                    const {accessToken,refreshToken} = await generateToken(userWithoutToken._id)
                    const user = await User.findByIdAndUpdate(userWithoutToken._id,{
                        refreshToken : refreshToken
                    })
                    res.status(StatusCodes.OK).json({
                        user : {
                            _id : user?._id,
                            name : user?.name,
                            email : user?.email,
                            dob : user?.dob,
                            gender : user?.gender,
                            bio : user?.bio,
                            avatar : user?.avatar,
                            followings : user?.followings,
                            followers : user?.followers,
                            accessToken : accessToken,
                            refreshToken : refreshToken
                        }
                    })
                }
                else{
                    res.status(StatusCodes.FORBIDDEN).json({
                        "errorMessage":"Invalid Credentials"
                    })
                }
            }
        }
    }
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage":error
        })
    }
}

export const checkProtectedRoute = async(req:Request,res:Response):Promise<void>=>{
    res.status(StatusCodes.OK).json({
        "message":"Protected route"
    })
}

export const getOTP = async(req:Request,res:Response):Promise<void>=>{
    try{
        const {email} = req.body as {email:string}
        var transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "e2c2f71f40facb",
              pass: "75c47b6bad2d32"
            }
        });
        const otp = otpGenerator.generate(6,{digits:true})
        const otps = await Otp.deleteMany({})
        const otpObj = await Otp.create({
            text : otp
        })
        const data = await ejs.renderFile(path.join(__dirname,'../../public/index.ejs'),{otp: otpObj.text})
        let mailOptions = {
            from: 'Harsh <adminproject@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "OTP for password reset", // Subject line
            html : data
          }
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    "errorMessage":error
                })
            }else{
                //console.log('Message sent : ',info.messageId)
                res.status(StatusCodes.OK).json({
                    "status":info.messageId
                })
            }
        })
        /*onst msg = {
            to: email, // Change to your recipient
            from: 'ram21636519@gmail.com', // Change to your verified sender
            subject: 'OTP for forgot password',
            text: 'OTP'
        }
        sgMail.setApiKey(SEND_GRID_KEY)
        sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
            res.status(StatusCodes.OK).json({
                "status":"Email sent"
            })
        })
        .catch((error) => {
            console.error(error)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                "errorMessage":error
            })
        })*/

    }catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage":error
        })
    }
}

/*
export const refreshToken = async(req:Request,res:Response):Promise<void>=>{
    try{
        const {accessToken,refreshToken} = req.body as {accessToken:string,refreshToken:string}
        if(!accessToken || !refreshToken){
            res.status(StatusCodes.BAD_REQUEST).json({
                "errorMessage":"please provide both tokens"
            })
        }else{
            const {data:{id:id}} = jwt.verify(refreshToken,refreshTokenSecretKey)
            const user = await User.findById(id)
            if(user){
                const {accessToken,refreshToken} = await generateToken(id)
                res.status(StatusCodes.OK).json({
                    "accessToken":accessToken,
                    "refreshToken":refreshToken
                })
            }else{
                res.status(StatusCodes.BAD_REQUEST).json({
                    "errorMessage":"please provide correct referesh token"
                })
            }

        }
    }catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage":error
        })
    }
}*/


export const getNewAccessToken = async(req:Request,res:Response):Promise<void>=>{
    try{
        const {refreshToken} = req.body as {refreshToken:string}
        const decoded = jwt.verify(refreshToken,refreshTokenSecret) as JwtPayload
        if(decoded.data.id){
            const {accessToken} = await generateToken(decoded.data.id)

            console.log('New token generated')
            res.status(StatusCodes.OK).json({
                "accessToken":accessToken,
                "refreshToken":refreshToken
            })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                "errorMessage":"Invalid refresh token"
            })
        }

    }catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage":error
        })
    }
}

export const resetPassword = async(req:Request,res:Response):Promise<void>=>{
    try{
        console.log('called')
        const {email,otp,newPassword} = req.body as {email:string,otp : string,newPassword:string}
            
            console.log('otp : ',otp)
            console.log('email',email)
            console.log(newPassword)
        if(!otp || !newPassword){
            res.status(StatusCodes.BAD_REQUEST).json({
                "errorMessage":"Please provide otp and newPassword"
            })
        }else{
            const otps = await Otp.find({})
            const storedOtp = otps[0]
            console.log('Stored : ',storedOtp)
            console.log('otp : ',otp)
            console.log('email',email)
            if(storedOtp.text.toString() === otp.toString()){
                const user = await User.findOne({
                    email : email
                })
                if(user){
                    user.password = newPassword
                    await user?.save()
                    console.log('password changed')
                    res.status(StatusCodes.OK).json({
                        message: "Password changed.!",
                        isPasswordChanged: true,
                    });
                }
            }
            else{
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: "Invalid OTP"
                });
            }
        }
    }catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage":error
        })
    }
}

export const loginWithGoogle = async(req:Request,res:Response):Promise<void>=>{
    try{
        const {idToken} = req.body as {idToken:string}
        const client = new OAuth2Client(CLIENT_ID)
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        
        const userWithoutToken = await User.findOne({
            email : payload?.email
        })
        if(userWithoutToken){
            const {accessToken,refreshToken} = await generateToken(userWithoutToken._id)
            const user = await User.findByIdAndUpdate(userWithoutToken._id,{
                refreshToken : refreshToken
            })
            res.status(StatusCodes.OK).json({
                user : {
                    _id : user?._id,
                    name : user?.name,
                    email : user?.email,
                    dob : user?.dob,
                    gender : user?.gender,
                    bio : user?.bio,
                    avatar : user?.avatar,
                    followings : user?.followings,
                    followers : user?.followers,
                    accessToken : accessToken,
                    refreshToken : refreshToken
                }
            })
        }else{
            
            const img = await imageToBase64(payload?.picture.toString()) // Path to the image
            .then(
                (response) => {
                    return response
                }
            )
           
            const userWithoutToken = await User.create({
                name:payload?.name,
                email:payload?.email,
                avatar : "data:image/png;base64,"+img
            })
            const {accessToken,refreshToken} = await generateToken(userWithoutToken._id)
            const user = await User.findByIdAndUpdate(userWithoutToken._id,{
                refreshToken : refreshToken
            })
            //const token = await generateToken(user._id)
            res.status(StatusCodes.CREATED).json({
                user : {
                    _id : user?._id,
                    name : user?.name,
                    email : user?.email,
                    dob : user?.dob,
                    gender : user?.gender,
                    bio : user?.bio,
                    avatar:user?.avatar,
                    followings : user?.followings,
                    followers : user?.followers,
                    accessToken : accessToken,
                    refreshToken : refreshToken
                }
            })
        }
    }catch(error){
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage":error
        })
    }
}