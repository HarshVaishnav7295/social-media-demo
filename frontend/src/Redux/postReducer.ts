import { createSlice } from "@reduxjs/toolkit";
import { IInitialPostState, IPost } from "../types/reduxTypes";
const initialPostState:IInitialPostState = {
  personalPosts: [],
  allPosts: [],
};

const postSlice = createSlice({
  name: "post",
  initialState: initialPostState,
  reducers: {
    setPersonalPost: (state, action: {payload: IPost[]}) => {
      state.personalPosts = [...action.payload];
    },
    setNewPost: (state, action: {payload: IPost}) => {
      state.allPosts.push(action.payload);
      state.personalPosts.push(action.payload);
    },
    setAllPost: (state, action: {payload: IPost[]}) => {
      state.allPosts = action.payload;
    },
  },
});

export const postAction = postSlice.actions;

export default postSlice;