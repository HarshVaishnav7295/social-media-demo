import { createSlice } from "@reduxjs/toolkit";

const initialChatState = {
  chat: [],
  isFollowerShowing: true,
  chatId : ""
};

const chatSlice = createSlice({
  name: "chat",
  initialState: initialChatState,
  reducers: {
    changeFollowerShowing: (state) => {
      state.isFollowerShowing = !state.isFollowerShowing;
    },
    addOneChat: (state, action) => {
      state.chat.push(action.payload);
    },
    setAllChat: (state, actions) => {
      state.chat = actions.payload;
    },
    setChatId: (state, action) => {
      state.chatId = action.payload;
    },
  },
});

export const chatAction = chatSlice.actions;

export default chatSlice;
