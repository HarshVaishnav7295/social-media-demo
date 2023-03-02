import { createSlice } from "@reduxjs/toolkit";

// const storedUserString = localStorage.getItem("CLONE");
// const storedUser = () => {
//   if (typeof storedUserString === "string") {
//     const user = JSON.parse(storedUserString);
//     return user;
//   }
// };

const initialUserState = {
  isUserAuthenticated: JSON.parse(localStorage.getItem('CLONE')) ? true : false,
  isProfileOpen: false,
  user: JSON.parse(localStorage.getItem('CLONE')),
  follower: [],
  following: [],
  displayedUser: JSON.parse(localStorage.getItem('CLONE')),
  followerOfDisp: [],
  followingOfDisp: [],
  allUser: [],
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    addUserToStorage: (state, action) => {
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
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.removeItem("CLONE");
      localStorage.setItem("CLONE", JSON.stringify(state.user));
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
      if (state.user) {
        state.user = {
          ...state.user,
          followings: action.payload,
        };
        localStorage.setItem("CLONE", JSON.stringify(state.user));
        state.isUserAuthenticated = true;
      }
    },
    setAllUser: (state, action) => {
      state.allUser = action.payload;
    },
    setFollowerOfDisp: (state, action) => {
      state.followerOfDisp.push(action.payload);
      state.followerOfDisp.filter(function (item, pos, self) {
        return self.indexOf(item) === pos;
      });
    },
    setFollowingOfDisp: (state, action) => {
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
