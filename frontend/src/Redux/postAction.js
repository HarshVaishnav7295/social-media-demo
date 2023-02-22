import axios from "axios";
import {
  GetAllPost,
  GetMyPost,
  LikeUnLikeApi,
  UploadPost,
} from "../utils/ApiRoutes";
import { postAction } from "./postReducer";

export const getPersonalPostAsync = (token) => {
  return async (dispatch) => {
    const userPosts = await axios.get(GetMyPost, {
      headers: { Authorization: `Bearer ${token}` },
    });
    //   console.log(userPosts.data.posts);
    dispatch(postAction.setPersonalPost(userPosts.data.posts));
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
    const newdata = await newPost.json();
    console.log(newdata.post);
    dispatch(postAction.setNewPost(newdata.post));
  };
};

export const getAllPostAsync = (token) => {
  return async (dispatch) => {
    try {
      const newPosts = await fetch(GetAllPost, {
        headers: { Authorization: `Bearer ${token}` },
        "Content-Type": "application/json",
      });
      const posts = await newPosts.json();
      dispatch(postAction.setAllPost(posts.posts));
    } catch (error) {
      console.log(error);
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

      const isLiked = await newData.json();
      return isLiked.message;
    } catch (error) {
      console.log(error);
    }
  };
};
