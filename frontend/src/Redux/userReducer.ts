import { createSlice } from "@reduxjs/toolkit";
import { IInitialUserState, IUser } from "../types/reduxTypes";
import {
  followUnfollowAsync,
  setAllUserAsync,
  setFollowerAsync,
  setFollowingAsync,
  updateUserAsync,
} from "./userAction";

const initialUserState: IInitialUserState = {
  isUserAuthenticated: localStorage.getItem("CLONE") ? true : false,
  isProfileOpen: false,
  user:
    localStorage.getItem("CLONE") === null
      ? undefined
      : JSON.parse(localStorage.getItem("CLONE")!),
  follower: [],
  following: [],
  displayedUser:
    localStorage.getItem("CLONE") === null
      ? undefined
      : JSON.parse(localStorage.getItem("CLONE")!),
  followerOfDisp: [],
  followingOfDisp: [],
  allUser: [],
  isLoading: false,
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
    setDisplayedUser: (state, action: { payload: IUser }) => {
      state.displayedUser = action.payload;
    },
    setFollowerOfDisp: (state, action: { payload: IUser }) => {
      state.followerOfDisp.push(action.payload);
      state.followerOfDisp.filter(function (item, pos, self) {
        return self.indexOf(item) === pos;
      });
    },
    setFollowingOfDisp: (state, action: { payload: IUser }) => {
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
  extraReducers: {
    // ExtraReducer for UpdateUser
    [updateUserAsync.pending.type]: (state) => {
      state.isLoading = true;
    },
    [updateUserAsync.fulfilled.type]: (state, action: { payload: IUser }) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.removeItem("CLONE");
      localStorage.setItem("CLONE", JSON.stringify(state.user));
      state.isUserAuthenticated = true;
      state.isLoading = false;
    },
    [updateUserAsync.rejected.type]: (state) => {
      state.isLoading = false;
    },
    // ExtraReducers for setFollowings
    [setFollowingAsync.pending.type]: (state, action: { payload: IUser[] }) => {
      state.isLoading = true;
    },
    [setFollowingAsync.fulfilled.type]: (
      state,
      action: { payload: IUser[] }
    ) => {
      state.following = action.payload;

      state.isLoading = false;
    },
    [setFollowingAsync.rejected.type]: (
      state,
      action: { payload: IUser[] }
    ) => {
      state.isLoading = false;
    },
    // ExtraReducer for setFollowerz
    [setFollowerAsync.pending.type]: (state) => {
      state.isLoading = true;
    },
    [setFollowerAsync.fulfilled.type]: (
      state,
      action: { payload: IUser[] }
    ) => {
      state.follower = action.payload;
      state.isLoading = false;
    },
    [setFollowerAsync.rejected.type]: (state) => {
      state.isLoading = false;
    },
    // ExtraReducers for Follow unFollow
    [followUnfollowAsync.pending.type]: (state) => {
      state.isLoading = true;
    },
    [followUnfollowAsync.fulfilled.type]: (
      state,
      action: {
        payload: {
          followings: IUser[];
          isFollowing: boolean;
          message: string;
          status: boolean;
        };
      }
    ) => {
      if (state.user) {
        state.user = {
          ...state.user,
          followings: action.payload.followings,
        };
        localStorage.setItem("CLONE", JSON.stringify(state.user));
        state.isUserAuthenticated = true;
      }

      state.isLoading = true;
    },
    [followUnfollowAsync.rejected.type]: (state) => {
      state.isLoading = false;
    },
    // ExtraReducer for getAllUser
    [setAllUserAsync.pending.type]: (state) => {
      state.isLoading = true;
    },
    [setAllUserAsync.fulfilled.type]: (state, action: { payload: IUser[] }) => {
      state.allUser = action.payload;

      state.isLoading = false;
    },
    [setAllUserAsync.rejected.type]: (state) => {
      state.isLoading = false;
    },
  },
});

export const userAction = userSlice.actions;

export default userSlice;
