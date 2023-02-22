import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/User";
import { generateToken } from "../utils/tokenGenerator";

interface ISignupRequest {
  name: string;
  email: string;
  password: string;
  dob: string;
  gender: string;
  bio: string;
  avatar: string;
}

interface ILoginRequest {
  email: string;
  password: string;
}

export const signupUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // const {name,email,password,dob,gender,bio,avatar} = req.body as ISignupRequest
    const { name, email, password, dob, gender, bio, avatar }: ISignupRequest =
      req.body;
    if (!name || !email || !password || !dob) {
      res.status(StatusCodes.BAD_REQUEST).json({
        errorMessage: "name,email,password,dob are required.",
      });
    } else {
      const userExists = await User.findOne({
        email: email,
      });
      if (userExists) {
        res.status(StatusCodes.BAD_REQUEST).json({
          errorMessage: "Email is already in user,Try different one.",
        });
      } else {
        const user = await User.create({
          name: name,
          email: email,
          password: password,
          dob: new Date(dob),
          gender: gender,
          bio: bio,
          avatar: avatar,
        });
        const token = await generateToken(user._id);
        res.status(StatusCodes.CREATED).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            dob: user.dob,
            gender: user.gender,
            bio: user.bio,
            avatar: user.avatar,
            followings: user.followings,
            followers: user.followers,
            token: token,
          },
        });
      }
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorMessage: error,
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // const { email, password } = req.body as ILoginRequest;
    const { email, password }: ILoginRequest = req.body;
    if (!email || !password) {
      res.status(StatusCodes.BAD_REQUEST).json({
        errorMessage: "email,password are required.",
      });
    } else {
      const user = await User.findOne({
        email: email,
      });
      if (!user) {
        res.status(StatusCodes.BAD_REQUEST).json({
          errorMessage: "No user with provided email.",
        });
      } else {
        const correctCredentials = await user.comparePassword(password);
        if (correctCredentials) {
          const token = await generateToken(user._id);
          res.status(StatusCodes.OK).json({
            user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              dob: user.dob,
              gender: user.gender,
              bio: user.bio,
              avatar: user.avatar,
              followings: user.followings,
              followers: user.followers,
              token: token,
            },
          });
        } else {
          res.status(StatusCodes.FORBIDDEN).json({
            errorMessage: "Invalid Credentials",
          });
        }
      }
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorMessage: error,
    });
  }
};
