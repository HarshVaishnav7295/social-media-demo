import { GetAllChatApi, UploadMessage } from "../utils/ApiRoutes";
import { chatAction } from "./chatReducer";

export const setAllChatAsync = (data) => {
  return async (dispatch) => {
    try {
      const newData = await fetch(GetAllChatApi, {
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          receiverId: data.receiverId,
          senderId: data.senderId,
        }),
      });

      const chats = await newData.json();
      dispatch(chatAction.setAllChat(chats.Chat));
    } catch (error) {
      console.log(error);
    }
  };
};

export const addOneChatAsync = (data) => {
  return async (dispatch) => {
    try {
      const newPost = await fetch(UploadMessage, {
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          text: data.text,
          receiverId: data.receiverId,
        }),
      });
      const post = await newPost.json();
      dispatch(chatAction.addOneChat(post.message));
    } catch (error) {
      console.log(error);
    }
  };
};

export const setChatIdAsync = (data) => {
  return async (dispatch) => {
    try {
      dispatch(chatAction.setChatId(data));
    } catch (error) {
      console.log(error);
    }
  };
};
