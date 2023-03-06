import { Dispatch } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Socket } from "socket.io-client";
import { IChat, IUser } from "../types/reduxTypes";
import { FindUserByIdApi,  } from "../utils/ApiRoutes";
import { setNewAccessToken } from "../utils/setNewAccessToken";
import { chatAction } from "./chatReducer";

export const setAllChatAsync = (data: IChat[]) => {
  return async (dispatch:Dispatch) => {
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

export const addOneChatAsync = (data: IChat) => {
  return async (dispatch:Dispatch) => {
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

export const addMessageToChatAsync = (data:IChat) => {
  return async (dispatch:Dispatch) => {
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

export const accessChatAsync = (prop:{socket: Socket | undefined,followingUserProp: IUser,user: IUser | undefined})=>{
  return async(dispatch:Dispatch)=>{
    try{
      let resp = await fetch("http://localhost:8000/api/chat/accessChat", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${prop.user?.accessToken}`,
        },
        method: "POST",
        body: JSON.stringify({
          users: [prop.followingUserProp._id, prop.user?._id],
        }),
      });
      if(resp.status === 401){
        const error = await resp.json()
        if (error.errorMessage === 'jwt expired') {
          const newToken = await setNewAccessToken(dispatch)
          const newProp = {
            socket: prop.socket,
            user: { ...prop.user, accessToken: newToken },
            followingUserProp: prop.followingUserProp
          }
          //@ts-ignore
          dispatch(accessChatAsync(newProp))
        }
      }
      if (resp.status === 500) {
        let error = await resp.json();
        console.log(error.errorMessage);
      } else if (resp.status === 200) {
        let data: {chat:IChat[]} = await resp.json();
        // console.log(data.chat)
        if (prop.socket) {
          if(prop.followingUserProp._id !== undefined){
            prop.socket.emit("Join Room", {roomId : prop.followingUserProp._id});
          }
        }
        console.log('Data', data.chat)
        //@ts-ignore
        dispatch(setAllChatAsync(data.chat));
      }
    }catch(error){
      console.log(error)
    }
  }
}

export const setNotificationAsync = (prop:{data: {newMessage: IChat},user: IUser | undefined})=>{
  return async(dispatch: Dispatch)=>{
    try{
      //console.log(data.newMessage)
      const resp = await fetch(FindUserByIdApi, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${prop.user?.accessToken}`,
        },
        method: "POST",
        body: JSON.stringify({
          id: prop.data.newMessage.sender,
        }),
      });
      if(resp.status === 401){
        const error = await resp.json()
        if (error.errorMessage === 'jwt expired') {
          const newToken = await setNewAccessToken(dispatch)
          const newProp = {
            data: prop.data,
            user: { ...prop.user, accessToken: newToken }
          }
          //@ts-ignore
          dispatch(setNotificationAsync(newProp))
        }
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

export const markReadAsync = (prop:{data: {newMessage: IChat},user: IUser | undefined,setIsRead: React.Dispatch<React.SetStateAction<boolean>>})=>{
  return async(dispatch:Dispatch)=>{
    try{
      let resp = await fetch("http://localhost:8000/api/chat/markRead", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${prop.user?.accessToken}`,
          },
          method: "POST",
          body: JSON.stringify({
            id: prop.data.newMessage._id,
          }),
      });
   
        if(resp.status === 401){
          const error = await resp.json()
          if (error.errorMessage === 'jwt expired') {
            const newToken = await setNewAccessToken(dispatch)
            const newProp = {
              data: prop.data,
              setIsRead: prop.setIsRead,
              user: { ...prop.user, accessToken: newToken }
            }
            // @ts-ignore
            dispatch(markReadAsync(newProp))
          }
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