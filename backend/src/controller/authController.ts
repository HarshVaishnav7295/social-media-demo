import {Request,Response} from 'express'
import { StatusCodes } from 'http-status-codes'
import { User } from '../models/User'
import { generateToken, refreshTokenSecret } from '../utils/tokenGenerator'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
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

export const forgotPassword = async(req:Request,res:Response):Promise<void>=>{
    try{
        const {email} = req.body as {email:string}
        let transporter = nodemailer.createTransport({
            host: "ram21636519@gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: 'ram21636519@gmail.com', // generated ethereal user
              pass: 'nodemailer@123@pass', // generated ethereal password
            },
          });

          let mailOptions = {
            from: '"Harsh" <ram21636519@gmail.com>', // sender address
            to: "ram21636519@gmail.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
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
        const {accessToken,refreshToken} = req.body as {accessToken:string,refreshToken:string}
        const decoded = jwt.verify(refreshToken, refreshTokenSecret)
        if (decoded.data.id) {
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