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
export const updateUserAsync = (data) => {
  return async (dispatch) => {
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
          data.token = newToken
          dispatch(updateUserAsync(data))
        }
        console.log(error.errorMessage)
      }else{
        const newData = await newUser.json();
        dispatch(userAction.updateUser(newData.updatedUser));
      }
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
      if(updatedUser.status === 401){
        const error =await updatedUser.json()
        if(error.errorMessage === 'jwt expired'){
          const newToken = await setNewAccessToken(dispatch)
          data.token = newToken
          dispatch(updateUserPasswordAsync(data))
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
      if(following.status === 401){
        const error =await following.json()
        if(error.errorMessage === 'jwt expired'){
          const newToken = await setNewAccessToken(dispatch)
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
      if(follower.status === 401){
        const error =await follower.json()
        if(error.errorMessage === 'jwt expired'){
          const newToken = await setNewAccessToken(dispatch)
          dispatch(setFollowerAsync(newToken))
        }
      }else{

        let data = await follower.json();
        dispatch(userAction.setFollower(data.MyFollowers));
      }
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
      if(newData.status === 401){
        const error =await newData.json()
        if(error.errorMessage === 'jwt expired'){
          const newToken = await setNewAccessToken(dispatch)
          data.token = newToken
          dispatch(followUnfollowAsync(data))
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
      if(postUser.status === 401){
        const error =await postUser.json()
        if(error.errorMessage === 'jwt expired'){
          const newToken = await setNewAccessToken(dispatch)
          data.token = newToken
          dispatch(findUserByIdAsync(data))
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

export const setAllUserAsync = (token) => {
  return async (dispatch) => {
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
          const newToken = await setNewAccessToken(dispatch)
          
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
