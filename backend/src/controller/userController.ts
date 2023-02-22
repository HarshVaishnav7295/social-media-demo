import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { IUserRef, User, IUserModel } from "../models/User";

interface IUpdateReq {
  name: string;
  bio: string;
  avatar: string;
}
interface IChangePassReq {
  oldPassword: string;
  newPassword: string;
}
interface IUserForResponse {
  _id: number;
  name: string;
  email: string;
  dob: Date;
  gender: string;
  bio: string;
  avatar: string;
}

export const followUnfollowUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.body.id;
    const currUserId = req.body.user.id;
    if (id === currUserId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        errorMessage: "You can not follow/unfollow yourself",
        status: false,
      });
    } else {
      const user = await User.findById(id);
      const currUser = await User.findById(currUserId);
      if (!user) {
        res.status(StatusCodes.BAD_REQUEST).json({
          errorMessage: "No user with this id",
        });
      } else {
        let currUsersFollowings = currUser?.followings;
        let usersFollowers = user?.followers;
        let isFollowing: boolean = false;
        currUsersFollowings?.map((item) => {
          if (item._id.toString() == id) {
            isFollowing = true;
          }
        });
        if (isFollowing) {
          // following so need to remove
          currUsersFollowings = currUsersFollowings?.filter(
            (item) => item._id.toString() != id
          );
          usersFollowers = usersFollowers.filter(
            (item) => item._id != currUserId
          );
          const updatedCurrUser = await User.findByIdAndUpdate(currUserId, {
            followings: currUsersFollowings,
          });
          const updatedUser = await User.findByIdAndUpdate(id, {
            followers: usersFollowers,
          });
          isFollowing = false;
        } else {
          currUsersFollowings?.push(id);
          usersFollowers?.push(currUserId);
          const updatedCurrUser = await User.findByIdAndUpdate(currUserId, {
            followings: currUsersFollowings,
          });
          const updatedUser = await User.findByIdAndUpdate(id, {
            followers: usersFollowers,
          });
          isFollowing = true;
        }
        const updatedLoggedUser = await User.findById(currUserId);

        if (isFollowing) {
          res.status(StatusCodes.OK).json({
            isFollowing: true,
            followings: updatedLoggedUser?.followings,
            status: true,
            message: "Following successful",
          });
        } else {
          res.status(StatusCodes.OK).json({
            isFollowing: false,
            followings: updatedLoggedUser?.followings,
            status: true,
            message: "UnFollowing successful",
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

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, bio, avatar } = req.body as IUpdateReq;
    /*const user = await User.findByIdAndUpdate(req.body.user.id,{
            name:name,
            bio:bio,
            avatar:avatar
        })
        need to use one and update, made pre on findoneandupdate*/
    const user = await User.findById(req.body.user.id);
    if (!user) {
      res.status(StatusCodes.BAD_REQUEST).json({
        errorMessage: "No user with this id",
      });
    } else {
      user.name = name;
      user.bio = bio;
      user.avatar = avatar;
      await user.save();
      const updatedUser = await User.findById(user?._id);

      res.status(StatusCodes.OK).json({
        updatedUser: {
          name: updatedUser?.name,
          bio: updatedUser?.bio,
          avatar: updatedUser?.avatar,
        },
      });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorMessage: error,
    });
  }
};

export const getMyFollowings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    //const curruser = await User.findById(req.body.user.id).populate('followings').exec()

    const currUser = await User.findById(req.body.user.id);
    var myFollowings: IUserForResponse[] = [];
    currUser?.followings.forEach(async (item) => {
      const temp = await User.findById(item._id);
      if (temp) {
        const obj = {
          _id: temp._id,
          name: temp.name,
          email: temp.email,
          dob: new Date(temp.dob),
          gender: temp.gender,
          bio: temp.bio,
          avatar: temp.avatar,
          followers: temp.followers,
          followings: temp.followings,
        };
        myFollowings.push(obj);
      }
      /** here, added this, bcz when control foes out of foreach, bcz of async the my followings is not getting any
       * updated value as the sync process make it empty
       *
       * so added this as when all the items are pushed just send the response
       */
      if (myFollowings.length === currUser.followings.length) {
        res.status(StatusCodes.OK).json({
          Myfollowings: myFollowings,
        });
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorMessage: error,
    });
  }
};
export const getMyFollowers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const currUser = await User.findById(req.body.user.id);
    var myFollowers: IUserForResponse[] = [];
    currUser?.followers.forEach(async (item) => {
      const temp = await User.findById(item._id);
      if (temp) {
        const obj = {
          _id: temp._id,
          name: temp.name,
          email: temp.email,
          dob: new Date(temp.dob),
          gender: temp.gender,
          bio: temp.bio,
          avatar: temp.avatar,
          followers: temp.followers,
          followings: temp.followings,
        };
        myFollowers.push(obj);
      }
      if (myFollowers.length === currUser.followers.length) {
        res.status(StatusCodes.OK).json({
          MyFollowers: myFollowers,
        });
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorMessage: error,
    });
  }
};

export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { oldPassword, newPassword } = req.body as IChangePassReq;
    if (!oldPassword || !newPassword) {
      res.status(StatusCodes.BAD_REQUEST).json({
        errorMessage: "Please provide both old and new passwords",
        isPasswordChanged: false,
      });
    } else {
      const user = await User.findById(req.body.user.id);
      const match = await user?.comparePassword(oldPassword);
      if (!match) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          errorMessage: "Invalid Credentials",
          isPasswordChanged: false,
        });
      } else {
        if (user) {
          user.password = newPassword;
          await user?.save();
          res.status(StatusCodes.OK).json({
            message: "Password changed.!",
            isPasswordChanged: true,
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

export const findUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // const loggedUserId: string = req.body.user.id;
    const { id }: { id: string } = req.body;

    const user = await User.findById(id);
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({
        errorMessage: "user not found",
      });
    } else {
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
        },
      });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorMessage: error,
    });
  }
};
