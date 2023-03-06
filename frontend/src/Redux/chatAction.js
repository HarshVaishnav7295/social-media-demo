import { toast } from "react-toastify";
import { FindUserByIdApi, GetAllChatApi, UploadMessage } from "../utils/ApiRoutes";
import { setNewAccessToken } from "../utils/setNewAccessToken";
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

export const accessChatAsync = (prop)=>{
  return async(dispatch)=>{
    try{
      let resp = await fetch("http://localhost:8000/api/chat/accessChat", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${prop.user.token}`,
        },
        method: "POST",
        body: JSON.stringify({
          users: [prop.followingUserProp._id, prop.user._id],
        }),
      });
      if(resp.status === 401){
        const error = await resp.json()
        const newToken = await setNewAccessToken(dispatch)
        prop.user.token = newToken
        dispatch(accessChatAsync(prop))
      }
      if (resp.status === 500) {
        let error = await resp.json();
        console.log(error.errorMessage);
      } else if (resp.status === 200) {
        let data = await resp.json();
        // console.log(data.chat)
        if (prop.socket) {
          if(prop.followingUserProp._id !== undefined){
            prop.socket.emit("Join Room", {roomId : prop.followingUserProp._id});
          }
        }
        console.log('Data',data.chat)
        dispatch(setAllChatAsync(data.chat));
      }
    }catch(error){
      console.log(error)
    }
  }
}

export const setNotificationAsync = (prop)=>{
  return async(dispatch)=>{
    try{
      //console.log(data.newMessage)
      const resp = await fetch(FindUserByIdApi, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${prop.user.accessToken}`,
        },
        method: "POST",
        body: JSON.stringify({
          id: prop.data.newMessage.sender,
        }),
      });
      if(resp.status === 401){
        const error = await resp.json()
        const newToken = await setNewAccessToken(dispatch)
        prop.user.accessToken = newToken
        dispatch(setNotificationAsync(prop))
      }
      else{
        if (resp.status === 500) {
          console.log("Error");
        }
        const messageSenderUser = await resp.json();
        //console.log(messageSenderUser)
        toast.info(`New Message From : ${messageSenderUser.user.name}`);
        //console.log('not')
      }
      
    }catch(error){
      console.log(error)
    }
  }
}

export const markReadAsync = (prop)=>{
  return async(dispatch)=>{
    try{
      let resp = await fetch("http://localhost:8000/api/chat/markRead", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${prop.user.accessToken}`,
          },
          method: "POST",
          body: JSON.stringify({
            id: prop.data.newMessage._id,
          }),
        });
        if(resp.status === 401){
          const error = await resp.json()
          const newToken = await setNewAccessToken(dispatch)
          prop.user.accessToken = newToken
          dispatch(markReadAsync(prop))
        }
        else{
          if (resp.status === 500) {
            console.log("Error");
          } else if (resp.status === 200) {
            prop.setIsRead(true);
          }
        }
        
    }catch(error){
      console.log(error)
    }
  }
}