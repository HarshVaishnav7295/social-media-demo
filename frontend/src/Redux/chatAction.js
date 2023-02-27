import { GetAllChatApi, UploadMessage } from "../utils/ApiRoutes";
import { chatAction } from "./chatReducer";

export const setAllChatAsync = (data) => {
  return async (dispatch) => {
    try {
      //console.log(data)
      /*const newData = await fetch(GetAllChatApi, {
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          chatId : data.chatId,
          sender : data.sender,
          receiver : data.receiver
        }),
      });
      
      const chats = await newData.json();*/
      dispatch(chatAction.setAllChat(data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const addOneChatAsync = (data) => {
  return async (dispatch) => {
    try {
      /*const newPost = await fetch(UploadMessage, {
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          text: data.text,
          sender : data.sender,
          receiver: data.receiver,
          chatId : data.chatId
        }),
      });*/
      //const post = await newPost.json();
      dispatch(chatAction.addOneChat(data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const addMessageToChatAsync = (data) => {
  return async (dispatch) => {
    try {
      dispatch(chatAction.addOneChat(data));
    } catch (error) {
      console.log(error);
    }
  };
};
/*
export const setRoomIdAsync = (data) => {
  return async (dispatch) => {
    try {
      //console.log('Data:',data)
      dispatch(chatAction.setChatId(data));
    } catch (error) {
      console.log(error);
    }
  };
};*/