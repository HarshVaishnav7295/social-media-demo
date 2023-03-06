import { Box, Img, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { BsCheck, BsCheck2All } from "react-icons/bs";
import {  ToastContainer } from "react-toastify";
import { Socket } from "socket.io-client";
import { addOneChatAsync, markReadAsync, setNotificationAsync } from "../../Redux/chatAction";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { IChat, IUser } from "../../types/reduxTypes";
import InputContainer from "./InputContainer";

interface IAllChatContainerProps {
  roomId: string;
  socket: Socket | undefined;
  clickedFollowingUser: IUser;
  user: IUser | undefined;
  isUserAuthenticated: boolean;
}

const AllChatContainer = ({
  roomId,
  socket,
  clickedFollowingUser,
  user,
  isUserAuthenticated,
}: IAllChatContainerProps) => {
   const dispatch = useAppDispatch();
  const chats = useAppSelector((state) => state.chat.chat);
  const [isRead, setIsRead] = useState(false);
  useEffect(() => {
    //console.log('Current Room : ',roomId)
    socket?.on("MessagesUpdated", async (data:{newMessage: IChat}) => {
      console.log(data.newMessage);
      //console.log('Current Room : ',roomId)
      //console.log('sender id : ',data.newMessage.sender)
      if (
        data.newMessage.sender.toString() === roomId &&
        data.newMessage.receiver.toString() === user?._id.toString()
      ) {
        dispatch(addOneChatAsync(data.newMessage));
        dispatch(markReadAsync({data,user,setIsRead}))
      } else {
        //console.log('New message from user : ',data.newMessage.sender.toString())
        //setNotification(data.newMessage.sender.toString())
        //dispatch(chatAction.setNotificationCount(parseInt(notificationCount)+1))
        if (
          data.newMessage.sender.toString() !== user?._id.toString() &&
          data.newMessage.receiver.toString() === user?._id.toString()
        ) {
          dispatch(setNotificationAsync({data,user}))
        }
      }
    });
    return () => {
      socket?.off("MessagesUpdated");
    };
  }, [clickedFollowingUser]);

  const getTime = (createdAt:string) => {
    const hours = new Date(createdAt).getHours();
    const minutes = new Date(createdAt).getMinutes();
    if (hours <= 12) {
      const time = `${hours}:${minutes < 10 ? "0" + minutes : minutes} AM`;
      return time;
    } else {
      const time = `${hours - 12}:${minutes < 10 ? "0" + minutes : minutes} PM`;
      return time;
    }
  };
  const scrollRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  return (
    <>
      <ToastContainer autoClose={2000} />
      {/* Main Box for chats */}
      <Box
        width="100%"
        height="100%"
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Box for Following User Ingo */}

        <Box
          display="flex"
          flexDir="row"
          justifyContent="space-evenly"
          alignItems="center"
          width="100%"
          height="17%"
        >
          {/* Box for Following User Avatar amd Name, Bio */}
          <Box
            width="fit-content"
            height="100%"
            display="flex"
            alignItems="center"
            flexDir="row"
            gap="0.5rem"
            pl="0.5rem"
          >
            <Box
              width={[
                "2.5rem",
                "2.5rem",
                "3.5rem",
                "3.5rem",
                "3.5rem",
                "3.5rem",
              ]}
              height={[
                "2.5rem",
                "2.5rem",
                "3.5rem",
                "3.5rem",
                "3.5rem",
                "3.5rem",
              ]}
              borderRadius="50%"
            >
              <Img src={clickedFollowingUser.avatar} borderRadius="50%" />
            </Box>
            <Box width="fit-content" display="flex" flexDir="column">
              <Text
                width="fit-content"
                fontSize={[
                  "0.8rem",
                  "0.8rem",
                  "1rem",
                  "1.2rem",
                  "1.2rem",
                  "1.2rem",
                ]}
                height="fit-content"
              >
                {clickedFollowingUser.name}
              </Text>
              <Text
                width="fit-content"
                fontSize={[
                  "0.6rem",
                  "0.6rem",
                  "0.8rem",
                  "0.8rem",
                  "0.8rem",
                  "0.8rem",
                ]}
                color="grey"
                height="fit-content"
              >
                {clickedFollowingUser.bio}
              </Text>
            </Box>

            {/* Box for show follower and followings */}
          </Box>

          {/* User Name */}
          {/* Followers and Followings Container */}
          <Box
            width="fit-content"
            display="flex"
            flexDir="row"
            justifyContent="space-evenly"
            gap={["0.6rem", "0.7rem", "0.8rem", "1rem", "1rem", "1rem"]}
          >
            <Box
              display="flex"
              flexDir="column"
              gap="0"
              alignItems="center"
              cursor="pointer"
            >
              <Box
                fontWeight="bold"
                fontSize={[
                  "0.6rem",
                  "0.7rem",
                  "0.8rem",
                  "0.9rem",
                  "0.9rem",
                  "0.9rem",
                ]}
              >
                {isUserAuthenticated
                  ? clickedFollowingUser?.followers.length
                  : "0"}
              </Box>
              <Box
                fontSize={[
                  "0.5rem",
                  "0.5rem",
                  "0.6rem",
                  "0.8rem",
                  "0.8rem",
                  "0.8rem",
                ]}
                color="grey"
              >
                Followers
              </Box>
            </Box>

            {/* Following */}
            <Box
              display="flex"
              flexDir="column"
              gap="0"
              alignItems="center"
              cursor="pointer"
            >
              <Box
                fontWeight="bold"
                fontSize={[
                  "0.6rem",
                  "0.7rem",
                  "0.8rem",
                  "0.9rem",
                  "0.9rem",
                  "0.9rem",
                ]}
              >
                {isUserAuthenticated
                  ? clickedFollowingUser?.followings.length
                  : "0"}
              </Box>
              <Box
                fontSize={[
                  "0.5rem",
                  "0.5rem",
                  "0.6rem",
                  "0.8rem",
                  "0.8rem",
                  "0.8rem",
                ]}
                color="grey"
              >
                Following
              </Box>
            </Box>
          </Box>
        </Box>
        {/* ******************************************************************************************************************** */}
        {/* Box for chats between users */}

        <Box
          width="100%"
          height="83%"
          display="flex"
          flexDir="column"
          justifyContent="flex-end"
          px="1rem"
          overflow="hidden"
          overflowY="scroll"
          css={{
            "&::-webkit-scrollbar": {
              width: "2px",
            },
            "&::-webkit-scrollbar-track": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "lightgrey",
              borderRadius: "24px",
            },
          }}
        >
          {/* all chats being Map here */}
          <Box
            width="100%"
            height="100%"
            display="flex"
            gap="0.9rem"
            flexDir="column"
          >
            {chats.map((chat: IChat) => {
              return (
                <Box
                  key={chat._id}
                  width="100%"
                  height="fit-content"
                  display="flex"
                  alignItems={
                    chat.sender === user?._id ? "flex-end" : "flex-start"
                  }
                  flexDir="column"
                >
                  <Box
                    width="fit-content"
                    maxWidth="65%"
                    minWidth="10%"
                    height="fit-content"
                    backgroundColor="#ebebeb"
                    px="10px"
                    py="3px"
                    // display="flex"
                    // justifyContent="center"
                    borderRadius="3px"
                    fontSize="0.9rem"
                    mb="-2px"
                    cursor="pointer"
                  >
                    {chat.text}
                    <Box
                      display="flex"
                      flexDir="row"
                      justifyContent="flex-end"
                      alignItems="end"
                      fontSize="0.65rem"
                      mt="-5px"
                      mr="-5px"
                    >
                      {/* {new Date(chat.createdAt).getHours()}:
                      {new Date(chat.createdAt).getMinutes() < 10
                        ? `0${new Date(chat.createdAt).getMinutes()}`
                        : new Date(chat.createdAt).getMinutes()} */}
                      {getTime(chat.createdAt)}
                      {chat.sender === user?._id ? (
                        isRead ? (
                          <Box fontSize="0.8rem" ml="0px" mr="-2px" mb="1px">
                            <BsCheck2All color="#00a3e6" />
                          </Box>
                        ) : (
                          <Box fontSize="0.8rem" ml="0px" mr="-2px" mb="1px">
                            <BsCheck />
                          </Box>
                        )
                      ) : null}
                    </Box>
                  </Box>
                </Box>
              );
            })}
            <div ref={scrollRef} />
          </Box>
        </Box>

        {clickedFollowingUser && roomId && (
          <Box
            width={["90%", "95%", "95%", "100%", "100%", "100%"]}
            height="10%"
            backgroundColor="lightgray"
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt="0.2rem"
          >
            <InputContainer
              socket={socket}
              clickedFollowingUser={clickedFollowingUser}
              user={user}
            />
          </Box>
        )}
      </Box>
    </>
  );
};

export default AllChatContainer;
