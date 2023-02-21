import {Request,Response} from 'express'
import { StatusCodes } from 'http-status-codes'
import { User } from '../models/User'
import { generateToken } from '../utils/tokenGenerator'
import jwt from 'jsonwebtoken'
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
                const user = await User.create({
                    name:name,
                    email:email,
                    password:password,
                    dob:new Date(dob),
                    gender : gender,
                    bio:bio,
                    avatar:avatar
                })
                
                //const {accessToken,refreshToken} = await generateToken(user._id)
                const token = await generateToken(user._id)
                res.status(StatusCodes.CREATED).json({
                    user : {
                        id : user._id,
                        name : user.name,
                        email : user.email,
                        dob : user.dob,
                        gender : user.gender,
                        bio : user.bio,
                        avatar:user.avatar,
                        followings : user.followings,
                        followers : user.followers,
                        token:token
                        //accessToken : accessToken,
                        //refreshToken : refreshToken
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
            const user = await User.findOne({
                email : email
            })
            if(!user){
                res.status(StatusCodes.BAD_REQUEST).json({
                    "errorMessage":"No user with provided email."
                })
            }
            else{
                const correctCredentials = await user.comparePassword(password)
                if(correctCredentials){
                    const token = await generateToken(user._id)
                    //const {accessToken,refreshToken} = await generateToken(user._id)
                    res.status(StatusCodes.OK).json({
                        user : {
                            id : user._id,
                            name : user.name,
                            email : user.email,
                            dob : user.dob,
                            gender : user.gender,
                            bio : user.bio,
                            avatar : user.avatar,
                            followings : user.followings,
                            followers : user.followers,
                            token:token
                            //accessToken : accessToken,
                            //refreshToken : refreshToken
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