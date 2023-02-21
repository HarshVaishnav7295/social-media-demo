import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userReducer";
import postSlice from "./postReducer";
import chatSlice from "./chatReducer";

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    post: postSlice.reducer,
    chat: chatSlice.reducer,
  },
});

export default store;
