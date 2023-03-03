import { createAsyncThunk, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { IPost } from "../types/reduxTypes";
import {
  GetFeedApi,
  GetMyPost,
  GetUserPostApi,
  LikeUnLikeApi,
  UploadPost,
} from "../utils/ApiRoutes";
import { postAction } from "./postReducer";

export const getFeedAsync = (token: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const feeddata = await fetch(GetFeedApi, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      });

      const feed: { feed: IPost[] } = await feeddata.json();
      dispatch(postAction.setAllPost(feed.feed));
    } catch (error) {
      console.log(error);
    }
  };
};

// export const getFeedAsync = createAsyncThunk(
//   "post/getFeedAsync",
//   async (token: string) => {
//     const feedData = await axios
//       .get(GetFeedApi, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       })
//       .then((res) => res.data)
//       .catch((error) => error);

//     console.log(feedData.feed);
//     return feedData.feed;
//   }
// );

export const setNewPostAsync = (data: {
  token: string;
  img: string;
  desc: string;
}) => {
  return async (dispatch: Dispatch) => {
    const newPost = await fetch(UploadPost, {
      headers: {
        Authorization: `Bearer ${data.token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        img: data.img,
        desc: data.desc ? data.desc : "",
      }),
    });
    const newdata = await newPost.json();
    console.log(newdata.post);
    dispatch(postAction.setNewPost(newdata.post));
  };
};

export const likeUnLikeAsync = (data: { token: string; id: string }) => {
  return async (dispatch: Dispatch) => {
    try {
      const newData = await fetch(LikeUnLikeApi + data.id, {
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const isLiked: { message: string } = await newData.json();
      return isLiked.message;
    } catch (error) {
      console.log(error);
    }
  };
};

export const getUserPostAsync = (data: { token: string; _id: string }) => {
  return async (dispatch: Dispatch) => {
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
      const posts: { status: boolean; posts: IPost[] } = await userPosts.json();
      return posts;
    } catch (error) {
      console.log(error);
    }
  };
};
