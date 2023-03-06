import axios from "axios";
import {
  GetFeedApi,
  GetMyPost,
  GetUserPostApi,
  LikeUnLikeApi,
  UploadPost,
} from "../utils/ApiRoutes";
import { postAction } from "./postReducer";

import { setNewAccessToken } from "../utils/setNewAccessToken";
import { Dispatch } from "@reduxjs/toolkit";
export const getPersonalPostAsync = (token:string) => {
  return async (dispatch:Dispatch) => {
    const userPosts = await axios.get(GetMyPost, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if(userPosts.status === 401){
      const error = userPosts.data
      if(error.errorMessage === 'jwt expired'){
        const newToken:string = await setNewAccessToken(dispatch)
        // @ts-ignore
        dispatch(getPersonalPostAsync(newToken))
      }
    }
    else{

      //   console.log(userPosts.data.posts);
      dispatch(postAction.setPersonalPost(userPosts.data.posts));
    }
  };
};

export const getFeedAsync = (token:string) => {
  return async (dispatch:Dispatch) => {
    try {
      const feeddata = await fetch(GetFeedApi, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      if(feeddata.status === 401){
        const error =await feeddata.json()
        if(error.errorMessage === 'jwt expired'){
          const newToken:string = await setNewAccessToken(dispatch)
          // @ts-ignore
          dispatch(getFeedAsync(newToken))
        }
      }else{

        const feed = await feeddata.json();
        console.log("feedd : ",feeddata)
        dispatch(postAction.setAllPost(feed.feed));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const setNewPostAsync = (data:{token:string, img:string, desc: string}) => {
  return async (dispatch:Dispatch) => {
    const newPost = await fetch(UploadPost, {
      headers: {
        Authorization: `Bearer ${data.token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        img: data.img,
        desc: data.desc ? data.desc : " ",
      }),
    });
    if(newPost.status === 401){
      const error =await newPost.json()
      if(error.errorMessage === 'jwt expired'){
        const newToken:string = await setNewAccessToken(dispatch)
        const newProp = {
          token: newToken,
          img: data.img,
          desc: data.desc
        }
        // @ts-ignore
        dispatch(setNewPostAsync(newProp))
      }
    }
    else{

      const newdata = await newPost.json();
      //console.log(newdata.post);
      dispatch(postAction.setNewPost(newdata.post));
    }
  };
};

export const likeUnLikeAsync = (data: {id:string, token:string}) => {
  return async (dispatch:Dispatch) => {
    try {
      const newData = await fetch(LikeUnLikeApi + data.id, {
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      if(newData.status === 401){
        const error =await newData.json()
        if(error.errorMessage === 'jwt expired'){
          const newToken:string = await setNewAccessToken(dispatch)
          const newProp = {
            token: newToken,
            id:data.id
          }
          // @ts-ignore
          dispatch(likeUnLikeAsync(newProp))
        }
      }else{

        const isLiked = await newData.json();
        return isLiked.message;
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const getUserPostAsync = (data:{token: string,_id:string}) => {
  return async (dispatch:Dispatch) => {
    try {
      const userPosts = await fetch(GetUserPostApi, {
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          _id: data._id,
        }),
      });
      if(userPosts.status === 401){
        const error =await userPosts.json()
        if(error.errorMessage === 'jwt expired'){
          const newToken = await setNewAccessToken(dispatch)
          const newProp = {
            token: newToken,
            _id: data._id
          }
          // @ts-ignore
          dispatch(getUserPostAsync(newProp))
        }
      }else{

        const posts = await userPosts.json();
        return posts;
      }
    } catch (error) {
      console.log(error);
      
    }
  };
};