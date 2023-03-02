import axios from "axios";
import {
  GetFeedApi,
  GetMyPost,
  GetUserPostApi,
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

      const feed = await feeddata.json();
      dispatch(postAction.setAllPost(feed.feed));
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
    const newdata = await newPost.json();
    //console.log(newdata.post);
    dispatch(postAction.setNewPost(newdata.post));
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
      const posts = await userPosts.json();
      return posts;
    } catch (error) {}
  };
};
