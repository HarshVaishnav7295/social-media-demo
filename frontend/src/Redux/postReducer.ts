import { createSlice } from "@reduxjs/toolkit";
import { IPost, IInitialPostState } from "../types/reduxTypes";
import { getFeedAsync } from "./postAction";
const initialPostState: IInitialPostState = {
  personalPosts: [],
  allPosts: [],
  isLoading: false,
};

const postSlice = createSlice({
  name: "post",
  initialState: initialPostState,
  reducers: {
    setNewPost: (state, action: { payload: IPost }) => {
      state.allPosts.push(action.payload);
      state.personalPosts.push(action.payload);
    },
    setAllPost: (state, action: { payload: IPost[] }) => {
      state.allPosts = action.payload;
    },
  },
  // extraReducers: {
  //   [getFeedAsync.pending.type]: (state) => {
  //     state.isLoading = true;
  //   },
  //   [getFeedAsync.fulfilled.type]: (state, action: { payload: IPost[] }) => {
  //     state.allPosts = action.payload;
  //     state.isLoading = true;
  //   },
  //   [getFeedAsync.rejected.type]: (state) => {
  //     state.isLoading = false;
  //   },
  // },
});

export const postAction = postSlice.actions;

export default postSlice;
