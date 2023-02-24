import { createSlice } from "@reduxjs/toolkit";

const initialChatState = {
  chat: [],
  isFollowerShowing: true,
  chatId: "",
  notificationCount: 0,
  // newNotification: [],
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
    setNotificationCount: (state, action) => {
      state.notificationCount = action.payload;
    },
    // setNewNotification: (state, action) => {
    //   if (
    //     state.newNotification.find((newMsg) => newMsg.id === action.payload.id)
    //   ) {
    //     state.newNotification.map((newMsg) => {
    //       if (newMsg.id === action.payload.id) {
    //         newMsg.count = newMsg.count + 1;
    //       }
    //     });
    //   } else {
    //     state.newNotification.push({
    //       id: action.payload.id,
    //       count: 1,
    //     });
    //   }
    // },
  },
});

export const chatAction = chatSlice.actions;

export default chatSlice;
