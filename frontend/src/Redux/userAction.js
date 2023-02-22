import {
  FindUserByIdApi,
  FollowUnFollowApi,
  GetFollowerApi,
  GetFollowingApi,
  UpdateUserApi,
  UpdateUserPasswordApi,
} from "../utils/ApiRoutes";
import { userAction } from "./userReducer";

export const updateUserAsync = (data) => {
  return async (dispatch) => {
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
          bio: data.bio,
        }),
      });
      const newData = await newUser.json();
      dispatch(userAction.updateUser(newData.updatedUser));
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateUserPasswordAsync = (data) => {
  return async (dispatch) => {
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
      const newData = await updatedUser.json();
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

export const setFollowingAsync = (token) => {
  return async (dispatch) => {
    try {
      const following = await fetch(GetFollowingApi, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      let data = await following.json();
      dispatch(userAction.setFollowing(data.Myfollowings));
    } catch (error) {
      console.log(error);
    }
  };
};

export const setFollowerAsync = (token) => {
  return async (dispatch) => {
    try {
      const follower = await fetch(GetFollowerApi, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      let data = await follower.json();
      dispatch(userAction.setFollower(data.MyFollowers));
    } catch (error) {}
  };
};

export const followUnfollowAsync = (data) => {
  return async (dispatch) => {
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
      const isFollowed = await newData.json();
      dispatch(userAction.updateUserFollowings(isFollowed.followings));
      return isFollowed;
    } catch (error) {
      console.log(error);
    }
  };
};

export const findUserByIdAsync = (data) => {
  return async (dispatch) => {
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
      const user = await postUser.json();
      return user.user;
    } catch (error) {
      return error;
    }
  };
};
