import { createSlice } from "@reduxjs/toolkit";
import { IInitialUserState, IUser } from "../types/reduxTypes";

const storedUserString = localStorage.getItem("CLONE");
const storedUser = () => {
  if (typeof storedUserString === "string") {
    const user = JSON.parse(storedUserString);
    return user;
  }
};

const initialUserState: IInitialUserState = {
  isUserAuthenticated: storedUser() ? true : false,
  isProfileOpen: false,
  user: storedUser(),
  follower: [],
  following: [],
  displayedUser:storedUser(),
  followerOfDisp: [],
  followingOfDisp: [],
  allUser: [],
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    addUserToStorage: (state, action: {payload: IUser}) => {
      state.isUserAuthenticated = true;
      localStorage.setItem("CLONE", JSON.stringify(action.payload));
      const newUser = JSON.parse(localStorage.getItem("CLONE") || "");
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
    updateUser: (state, action: { payload: IUser | { accessToken: string, refreshToken: string } }) => {
      if (state.user)
      {
        
        state.user = { ...state.user, ...action.payload };
        localStorage.removeItem("CLONE");
        localStorage.setItem("CLONE", JSON.stringify(state.user));
        state.isUserAuthenticated = true;
      }
    },
    setFollower: (state, action:{payload: IUser[]}) => {
      state.follower = action.payload;
       state.follower.filter(function (item, pos, self) {
        return self.indexOf(item) === pos;
      });
    },
    setFollowing: (state, action:{payload: IUser[]}) => {
      state.following = action.payload;
       state.following.filter(function (item, pos, self) {
        return self.indexOf(item) === pos;
      });
    },
    setDisplayedUser: (state, action: {payload: IUser}) => {
      state.displayedUser = action.payload;
    },
    updateUserFollowings: (state, action: {payload: IUser[]}) => {
      if (state.user) {
        state.user = {
          ...state.user,
          followings: action.payload,
        };
        localStorage.setItem("CLONE", JSON.stringify(state.user));
        
        state.isUserAuthenticated = true;
      }
    },
    setAllUser: (state, action: {payload: IUser[]}) => {
      state.allUser = action.payload;
    },
    setFollowerOfDisp: (state, action: {payload:IUser}) => {
      state.followerOfDisp.push(action.payload);
      state.followerOfDisp.filter(function (item, pos, self) {
        return self.indexOf(item) === pos;
      });
    },
    setFollowingOfDisp: (state, action: {payload: IUser}) => {
      state.followingOfDisp.push(action.payload);
      state.followingOfDisp.filter(function (item, pos, self) {
        return self.indexOf(item) === pos;
      });
    },
    setDispFollowerFollowingEmpty: (state) => {
      state.followerOfDisp = [];
      state.followingOfDisp = [];
    },
  },
});

export const userAction = userSlice.actions;

export default userSlice;