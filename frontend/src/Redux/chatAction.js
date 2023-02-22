import { chatAction } from "./chatReducer";

export const setAllChatAsync = (data) => {
  return async (dispatch) => {
    try {
      dispatch(chatAction.setAllChat(data));
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

export const setChatIdAsync = (data) => {
  return async (dispatch) => {
    try {
      //console.log('Data:',data)
      dispatch(chatAction.setChatId(data));
    } catch (error) {
      console.log(error);
    }
  };
};
