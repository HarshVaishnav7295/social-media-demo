import { Dispatch } from "@reduxjs/toolkit";
import { IChat } from "../types/reduxTypes";
import { chatAction } from "./chatReducer";

export const setAllChatAsync = (data: IChat[]) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(chatAction.setAllChat(data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const addOneChatAsync = (data: IChat) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(chatAction.addOneChat(data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const addMessageToChatAsync = (data: IChat) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(chatAction.addOneChat(data));
    } catch (error) {
      console.log(error);
    }
  };
};
