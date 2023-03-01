import { createSlice } from "@reduxjs/toolkit";
import { IFollow, IInitialUserState, IUser } from "../types/reduxTypes";

const storedUserString = localStorage.getItem("CLONE");
const storedUser = (): IUser | undefined => {
  if (typeof storedUserString === "string") {
    const user: IUser = JSON.parse(storedUserString);
    return user;
  }
};

const initialUserState: IInitialUserState = {
  isUserAuthenticated: storedUser() ? true : false,
  isProfileOpen: false,
  user: storedUser() ? storedUser() : undefined,
  follower: [],
  following: [],
  displayedUser: storedUser() ? storedUser() : undefined,
  allUser: [],
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    addUserToStorage: (state, action: { payload: IUser }) => {
      state.isUserAuthenticated = true;
      localStorage.setItem("CLONE", JSON.stringify(action.payload));
      const newUser: IUser = JSON.parse(localStorage.getItem("CLONE") || "");
      state.user = newUser;
    },
    deleteUserFromStorage: (state) => {
      state.isUserAuthenticated = false;
      state.isProfileOpen = false;
      localStorage.removeItem("CLONE");
      state.user = undefined;
    },
    changeProfileVisiblity: (state) => {
      state.isProfileOpen = !state.isProfileOpen;
      state.displayedUser = state.user;
    },
    updateUser: (state, action: { payload: IUser }) => {
      state.user = { ...state.user, ...action.payload };
      state.isUserAuthenticated = true;
    },
    setFollower: (state, action: { payload: IUser[] }) => {
      state.follower = action.payload;
    },
    setFollowing: (state, action: { payload: IUser[] }) => {
      state.following = action.payload;
    },
    setDisplayedUser: (state, action: { payload: IUser }) => {
      state.displayedUser = action.payload;
    },
    updateUserFollowings: (state, action: { payload: IFollow[] }) => {
      if (state.user) {
        state.user = {
          ...state.user,
          followings: action.payload,
        };
        localStorage.setItem("CLONE", JSON.stringify(state.user));
        state.isUserAuthenticated = true;
      }
    },
    setAllUser: (state, action: { payload: IUser[] }) => {
      state.allUser = action.payload;
    },
  },
});

export const userAction = userSlice.actions;

export default userSlice;
