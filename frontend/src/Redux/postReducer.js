import { createSlice } from "@reduxjs/toolkit";
const initialPostState = {
  personalPosts: [],
  allPosts: [],
};

const postSlice = createSlice({
  name: "post",
  initialState: initialPostState,
  reducers: {
    setPersonalPost: (state, action) => {
      // if (state.personalPosts === action.payload) {
      state.personalPosts = [...action.payload];
      // } else {
      //   state.personalPosts = [...action.payload, ...state.personalPosts];
      // }
    },
    setNewPost: (state, action) => {
      state.allPosts.push(action.payload);
      state.personalPosts.push(action.payload);
    },
    setAllPost: (state, action) => {
      state.allPosts = action.payload;
    },
  },
});

export const postAction = postSlice.actions;

export default postSlice;
