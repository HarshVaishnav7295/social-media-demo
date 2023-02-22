import { createSlice } from "@reduxjs/toolkit";

const initialUserState = {
  isUserAuthenticated: JSON.parse(localStorage.getItem("CLONE")) ? true : false,
  isProfileOpen: false,
  user: JSON.parse(localStorage.getItem("CLONE"))
    ? JSON.parse(localStorage.getItem("CLONE"))
    : {},
  follower: [],
  following: [],
  displayedUser: JSON.parse(localStorage.getItem("CLONE")),
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    addUserToStorage: (state, action) => {
      state.isUserAuthenticated = true;
      localStorage.setItem("CLONE", JSON.stringify(action.payload));
      const newUser = JSON.parse(localStorage.getItem("CLONE"));
      state.user = newUser;
    },
    deleteUserFromStorage: (state, action) => {
      state.isUserAuthenticated = false;
      state.isProfileOpen = false;
      localStorage.removeItem("CLONE");
      state.user = {};
    },
    changeProfileVisiblity: (state) => {
      state.isProfileOpen = !state.isProfileOpen;
      state.displayedUser = state.user;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      state.isUserAuthenticated = true;
    },
    setFollower: (state, action) => {
      state.follower = action.payload;
    },
    setFollowing: (state, action) => {
      state.following = action.payload;
    },
    setDisplayedUser: (state, action) => {
      state.displayedUser = action.payload;
    },
    updateUserFollowings: (state, action) => {
      state.user = {
        ...state.user,
        followings: action.payload,
      };
      localStorage.setItem("CLONE", JSON.stringify(state.user));
      state.isUserAuthenticated = true;
    },
  },
});

export const userAction = userSlice.actions;

export default userSlice;
