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
import { setNewAccessToken } from "../utils/setNewAccessToken";
import { Dispatch } from "@reduxjs/toolkit";
export const updateUserAsync = (data: {token:string,name:string,avatar:string,bio:string}) => {
  return async (dispatch:Dispatch) => {
    try {
      //console.log(data);
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
      if(newUser.status === 401){
        const error =await newUser.json()
        if(error.errorMessage === 'jwt expired'){
          const newToken = await setNewAccessToken(dispatch)
          const newProp = {
            token: newToken,
            name: data.name,
            avatar: data.avatar,
            bio: data.bio
          }
          // @ts-ignore
          dispatch(updateUserAsync(newProp))
        }
        console.log(error.errorMessage)
      }else{
        const newData = await newUser.json();
        dispatch(userAction.updateUser(newData.updatedUser));
        return newData.updatedUser
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateUserPasswordAsync = (data: {token:string, oldPassword: string, newPassword:string}) => {
  return async (dispatch:Dispatch) => {
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
      if(updatedUser.status === 401){
        const error =await updatedUser.json()
        if(error.errorMessage === 'jwt expired'){
          const newToken:string = await setNewAccessToken(dispatch)
          const newProp = {
            ...data,
            token:newToken
          }
          // @ts-ignore
          dispatch(updateUserPasswordAsync(newProp))
        }
        else{
          return error.errorMessage;
        }
      }else{
        const newData = await updatedUser.json();
        if (newData.isPasswordChanged) {
          return newData.message;
        } else {
          return newData.errorMessage;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const setFollowingAsync = (token:string) => {
  return async (dispatch:Dispatch) => {
    try {
      const following = await fetch(GetFollowingApi, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      if(following.status === 401){
        const error =await following.json()
        if(error.errorMessage === 'jwt expired'){
          const newToken = await setNewAccessToken(dispatch)
          // @ts-ignore
          dispatch(setFollowingAsync(newToken))
        }
      }else{

        let data = await following.json();
        dispatch(userAction.setFollowing(data.Myfollowings));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const setFollowerAsync = (token:string) => {
  return async (dispatch:Dispatch) => {
    try {
      const follower = await fetch(GetFollowerApi, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      if(follower.status === 401){
        const error =await follower.json()
        if(error.errorMessage === 'jwt expired'){
          const newToken = await setNewAccessToken(dispatch)
          // @ts-ignore
          dispatch(setFollowerAsync(newToken))
        }
      }else{

        let data = await follower.json();
        dispatch(userAction.setFollower(data.MyFollowers));
      }
    } catch (error) {}
  };
};

export const followUnfollowAsync = (data:{token: string, id: string}) => {
  return async(dispatch:Dispatch) => {
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
      if(newData.status === 401){
        const error =await newData.json()
        if(error.errorMessage === 'jwt expired'){
          const newToken = await setNewAccessToken(dispatch)
          const newPorp = {
            ...data,
            token: newToken
          }
          // @ts-ignore
          dispatch(followUnfollowAsync(newPorp))
        }
      }else{

        const isFollowed = await newData.json();
        dispatch(userAction.updateUserFollowings(isFollowed.followings));
        return isFollowed;
      }
    } catch (error) {
      console.log(error);
      
    }
  };
};

export const findUserByIdAsync = (data: {token: string,id:string}) => {
  return async (dispatch:Dispatch) => {
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
      if(postUser.status === 401){
        const error =await postUser.json()
        if(error.errorMessage === 'jwt expired'){
          const newToken = await setNewAccessToken(dispatch)
          const newProp = {
            ...data,
            token:newToken
          }
          // @ts-ignore
          dispatch(findUserByIdAsync(newProp))
        }
      }else{
        const user = await postUser.json();
        return user.user;
      }
    } catch (error) {
      return error;
    }
  };
};

export const setAllUserAsync = (token:string) => {
  return async (dispatch:Dispatch) => {
    try {
      const allUserData = await fetch(setAllUserApi, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      if(allUserData.status === 401){
        const error =await allUserData.json()
        if(error.errorMessage === 'jwt expired'){
          const newToken:string = await setNewAccessToken(dispatch)
          // @ts-ignore
          dispatch(setAllUserAsync(newToken))
        }
      }else{

        const data = await allUserData.json();
        dispatch(userAction.setAllUser(data.allUser));
      }
    } catch (error) {
      console.log(error);
    }
  };
};