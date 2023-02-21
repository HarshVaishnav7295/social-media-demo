import { NextFunction,Request,Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt,{decode} from 'jsonwebtoken'
import { User } from "../models/User";
//import { accessTokenSecretKey,refreshTokenSecretKey } from "../utils/tokenGenerator";
import { PK } from "../utils/tokenGenerator";
interface JwtPayload{
    data:{
        id:string
    }
}

export const authenticaton = async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')){
        res.status(StatusCodes.UNAUTHORIZED).json({
            "errorMessage":"Please provide correct bearer token"
        })
    }
    else{
        const token = authHeader.split(' ')[1]
        if(!token){
            res.status(StatusCodes.UNAUTHORIZED).json({
                "errorMessage":"Please provide authentication token"
            })
        }
        else{
            const {data : {id:id}} = jwt.verify(token,PK) as JwtPayload
            const user = await User.findById(id)
            if(!user){
                res.status(StatusCodes.UNAUTHORIZED).json({
                    "errorMessage":"You are not authorized to use this route"
                })
            }
            else{
                req.body['user'] = {
                    id : id
                }
                next()
            }
            /*
            let dataPayload
            jwt.verify(token,accessTokenSecretKey,async function(error,payload){
                if(error){
                    if(error.message === 'jwt expired'){
                        res.status(StatusCodes.BAD_REQUEST).json({
                            "errorMessage":"Jwt is expired"
                        })
                    }else{
                        res.status(StatusCodes.BAD_REQUEST).json({
                            "errorMessage":error.message
                        })
                    }
                }else{
                    dataPayload = payload
                    const id = dataPayload.data.id
                    const user = await User.findById(id)
                    if(!user){
                        res.status(StatusCodes.UNAUTHORIZED).json({
                            "errorMessage":"You are not authorized to use this route"
                        })
                    }
                    else{
                        req.body['user'] = {
                            id : id
                        }
                        next()
                    }
                }
            })*/
        }
    }
}