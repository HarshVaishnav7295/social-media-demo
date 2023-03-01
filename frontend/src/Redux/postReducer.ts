import { createSlice } from "@reduxjs/toolkit";
import { IPost, IInitialPostState } from "../types/reduxTypes";
const initialPostState: IInitialPostState = {
  personalPosts: [],
  allPosts: [],
};

const postSlice = createSlice({
  name: "post",
  initialState: initialPostState,
  reducers: {
    setPersonalPost: (state, action: { payload: IPost[] }) => {
      // if (state.personalPosts === action.payload) {
      state.personalPosts = [...action.payload];
      // } else {
      //   state.personalPosts = [...action.payload, ...state.personalPosts];
      // }
    },
    setNewPost: (state, action: { payload: IPost }) => {
      state.allPosts.push(action.payload);
      state.personalPosts.push(action.payload);
    },
    setAllPost: (state, action: { payload: IPost[] }) => {
      state.allPosts = action.payload;
    },
  },
});

export const postAction = postSlice.actions;

export default postSlice;
