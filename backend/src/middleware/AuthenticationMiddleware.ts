import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { VerifyErrors, VerifyOptions } from "jsonwebtoken";
import { User } from "../models/User";
import { accessTokenSecret } from "../utils/tokenGenerator";
interface JwtPayload {
  data: {
    id: string;
  };
}

export const authenticaton = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      errorMessage: "Please provide correct bearer token",
    });
  } else {
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        errorMessage: "Please provide authentication token",
      });
    } else {
      let id
      jwt.verify(token, accessTokenSecret,async(err,decoded)=>{
        if(err){
          res.status(StatusCodes.UNAUTHORIZED).json({
            "errorMessage":err.message
          })
        }
        else{
          const jwtPayloadData = decoded as JwtPayload
          id = jwtPayloadData.data.id
          
          const user = await User.findById(id);
          if (!user) {
            res.status(StatusCodes.UNAUTHORIZED).json({
              errorMessage: "You are not authorized to use this route",
            });
          } else {
            req.body["user"] = {
              id: id,
            };

            next();
          }
        }
      })
      
    }
  }
};
