import { createSlice } from "@reduxjs/toolkit";
import { IInitialChatState, IChat } from "../types/reduxTypes";

const initialChatState: IInitialChatState = {
  chat: [],
  isFollowerShowing: true,
  roomId: "",
  notificationCount: 0,
};

const chatSlice = createSlice({
  name: "chat",
  initialState: initialChatState,
  reducers: {
    changeFollowerShowing: (state) => {
      state.isFollowerShowing = !state.isFollowerShowing;
    },
    addOneChat: (state, action: { payload: IChat }) => {
      state.chat.push(action.payload);
    },
    setAllChat: (state, actions: { payload: IChat[] }) => {
      state.chat = actions.payload;
    },
    setRoomId: (state, action: { payload: string }) => {
      state.roomId = action.payload;
    },
    setNotificationCount: (state, action: { payload: number }) => {
      state.notificationCount = action.payload;
    },
  },
});

export const chatAction = chatSlice.actions;

export default chatSlice;
