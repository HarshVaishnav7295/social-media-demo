import { Dispatch } from "@reduxjs/toolkit";
import { IFollow, IUser } from "../types/reduxTypes";
import {
  FindUserByIdApi,
  FollowUnFollowApi,
  GetFollowerApi,
  GetFollowingApi,
  setAllUserApi,
  UpdateUserApi,
  UpdateUserPasswordApi,
} from "../utils/ApiRoutes";
import { userAction } from "./userReducer";

export const updateUserAsync = (data: {
  token: string;
  name: string;
  avatar: string;
  bio: string;
}) => {
  return async (dispatch: Dispatch) => {
    try {
      console.log(data);
      const newUser = await fetch(UpdateUserApi, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
        method: "PATCH",
        body: JSON.stringify({
          name: data.name,
          avatar: data.avatar,
          bio: data.bio ? data.bio : "",
        }),
      });
      const newData: { updatedUser: IUser } = await newUser.json();
      dispatch(userAction.updateUser(newData.updatedUser));
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateUserPasswordAsync = (data: {
  token: string;
  oldPassword: string;
  newPassword: string;
}) => {
  return async (dispatch: Dispatch) => {
    try {
      const updatedUser = await fetch(UpdateUserPasswordApi, {
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        }),
      });
      const newData: {
        isPasswordChanged: boolean;
        message: string;
        errorMessage: string;
      } = await updatedUser.json();
      if (newData.isPasswordChanged) {
        return newData.message;
      } else {
        return newData.errorMessage;
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const setFollowingAsync = (token: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const following = await fetch(GetFollowingApi, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      const data: { Myfollowings: IUser[] } = await following.json();
      dispatch(userAction.setFollowing(data.Myfollowings));
    } catch (error) {
      console.log(error);
    }
  };
};

export const setFollowerAsync = (token: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const follower = await fetch(GetFollowerApi, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      let data: { MyFollowers: IUser[] } = await follower.json();
      dispatch(userAction.setFollower(data.MyFollowers));
    } catch (error) {}
  };
};

export const followUnfollowAsync = (data: { token: string; id: string }) => {
  return async (dispatch: Dispatch) => {
    try {
      const newData = await fetch(FollowUnFollowApi, {
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          id: data.id,
        }),
      });
      const isFollowed: {
        status: boolean;
        errorMessage: string;
        followings: IFollow[];
      } = await newData.json();
      dispatch(userAction.updateUserFollowings(isFollowed.followings));
      return isFollowed;
    } catch (error) {
      console.log(error);
    }
  };
};

export const findUserByIdAsync = (data: {
  token: string | undefined;
  id: string;
}) => {
  return async (dispatch: Dispatch) => {
    try {
      const postUser = await fetch(FindUserByIdApi, {
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          id: data.id,
        }),
      });
      const user: { user: IUser } = await postUser.json();
      return user.user;
    } catch (error) {
      return error;
    }
  };
};

export const setAllUserAsync = (token: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const allUserData = await fetch(setAllUserApi, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      const data: { allUser: IUser[] } = await allUserData.json();
      dispatch(userAction.setAllUser(data.allUser));
    } catch (error) {
      console.log(error);
    }
  };
};
