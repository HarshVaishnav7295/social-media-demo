import { createAsyncThunk } from "@reduxjs/toolkit";
import { IUser } from "../types/reduxTypes";
import axios from "axios";
import {
  FindUserByIdApi,
  FollowUnFollowApi,
  GetFollowerApi,
  GetFollowingApi,
  setAllUserApi,
  UpdateUserApi,
  UpdateUserPasswordApi,
} from "../utils/ApiRoutes";

export const updateUserAsync = createAsyncThunk(
  "user/updateUserAsync",
  async (data: {
    token: string;
    name: string;
    avatar: string;
    bio: string;
  }) => {
    const newUser = await axios
      .patch(
        UpdateUserApi,
        JSON.stringify({
          name: data.name,
          avatar: data.avatar,
          bio: data.bio ? data.bio : "",
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
        }
      )
      .then((res) => res.data)
      .catch((error) => error);

    return newUser.updatedUser;
  }
);

export const updateUserPasswordAsync = createAsyncThunk(
  "user/updateUserPasswordAsync",
  async (data: { token: string; oldPassword: string; newPassword: string }) => {
    const updatedUser = await axios
      .patch(
        UpdateUserPasswordApi,
        JSON.stringify({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        }),
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => res.data)
      .catch((error) => error);
    return updatedUser;
  }
);

export const setFollowingAsync = createAsyncThunk(
  "user/setFollowingAsync",
  async (token: string) => {
    const followingData = await axios
      .get(GetFollowingApi, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.data)
      .catch((error) => error);

    return followingData.Myfollowings;
  }
);

export const setFollowerAsync = createAsyncThunk(
  "user/setFollowerAsync",
  async (token: string) => {
    const followerData = await axios
      .get(GetFollowerApi, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.data)
      .catch((error) => error);

    return followerData.MyFollowers;
  }
);

export const followUnfollowAsync = createAsyncThunk(
  "user/followUnfollowAsync",
  async (data: { token: string; id: string }) => {
    const followData: {
      followings: IUser[];
      isFollowing: boolean;
      message: string;
      status: boolean;
    } = await axios
      .post(
        FollowUnFollowApi,
        JSON.stringify({
          id: data.id,
        }),
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => res.data)
      .catch((error) => error);

    return followData;
  }
);

export const findUserByIdAsync = createAsyncThunk(
  "user/findUserByIdAsync",
  async (data: { token: string | undefined; id: string }) => {
    const userData: { user: IUser } = await axios
      .post(
        FindUserByIdApi,
        JSON.stringify({
          id: data.id,
        }),
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => res.data)
      .catch((error) => error);
    return userData.user;
  }
);

export const setAllUserAsync = createAsyncThunk(
  "user/setAllUserAsync",
  async (token: string) => {
    const allUserData: { allUser: IUser[] } = await axios
      .get(setAllUserApi, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.data)
      .catch((error) => error);

    return allUserData.allUser;
  }
);
