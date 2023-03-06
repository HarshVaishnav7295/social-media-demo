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
export const getPersonalPostAsync = (token) => {
  return async (dispatch) => {
    const userPosts = await axios.get(GetMyPost, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if(userPosts.status === 401){
      const error = userPosts.json()
      if(error.errorMessage === 'jwt expired'){
        const newToken = await setNewAccessToken(dispatch)
        dispatch(getPersonalPostAsync(newToken))
      }
    }
    else{

      //   console.log(userPosts.data.posts);
      dispatch(postAction.setPersonalPost(userPosts.data.posts));
    }
  };
};

export const getFeedAsync = (token) => {
  return async (dispatch) => {
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
          const newToken = await setNewAccessToken(dispatch)
          
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

export const setNewPostAsync = (data) => {
  return async (dispatch) => {
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
        const newToken = await setNewAccessToken(dispatch)
        data.token = newToken
        dispatch(setNewPostAsync(data))
      }
    }
    else{

      const newdata = await newPost.json();
      //console.log(newdata.post);
      dispatch(postAction.setNewPost(newdata.post));
    }
  };
};

export const likeUnLikeAsync = (data) => {
  return async (dispatch) => {
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
          const newToken = await setNewAccessToken(dispatch)
          data.token = newToken
          dispatch(likeUnLikeAsync(data))
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

export const getUserPostAsync = (data) => {
  return async (dispatch) => {
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
          data.token = newToken
          dispatch(getUserPostAsync(data))
        }
      }else{

        const posts = await userPosts.json();
        return posts;
      }
    } catch (error) {}
  };
};
