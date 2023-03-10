/* eslint-disable react-hooks/exhaustive-deps */

import { Box, Input } from "@chakra-ui/react";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../Navbar";
import Profile from "../Profile";
import { IoReorderThreeOutline } from "react-icons/io5";
import { chatAction } from "../../Redux/chatReducer";
import FollowingUser from "../FollowingUser";
import { RiSendPlaneFill } from "react-icons/ri";
import { BsEmojiSmileFill, BsCheck2All, BsCheck } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import { addOneChatAsync, markReadAsync, setNotificationAsync,accessChatAsync } from "../../Redux/chatAction";
import { setFollowingAsync, setFollowerAsync } from "../../Redux/userAction";
import { io } from "socket.io-client";
import { Img, Text } from "@chakra-ui/react";
import { setAllChatAsync } from "../../Redux/chatAction";
import { AiOutlineSearch } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import { FindUserByIdApi } from "../../utils/ApiRoutes";
import { setNewAccessToken } from "../../utils/setNewAccessToken";
const ChatContainer = () => {
  const dispatch = useDispatch();
  const displayedUser = useSelector((state) => state.user.displayedUser);

  const user = useSelector((state) => state.user.user);
  //const roomId = useSelector((state)=>state.chat.roomId)
  const isProfileOpen = useSelector((state) => state.user.isProfileOpen);
  const following = useSelector((state) => state.user.following);
  const [socket, setSocket] = useState(null);
  //const [roomId, setroomId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [followingUserState, setFollowingUserState] = useState([]);
  const [clickedFollowingUser, setClickedFollowingUser] = useState({});
  const roomId = useSelector((state)=>state.chat.roomId)
  //const [roomId, setRoomId] = useState("");
  const chats = useSelector((state)=>state.chat.chat)

  useEffect(() => {
    if (socket === null) {
      setSocket(io.connect("http://localhost:8000"));
      //console.log('Connection made')
    }
    setTimeout(() => {
      if (socket != null) {
        //console.log('setup called')
        socket.emit("setup", user._id);
      }
    }, 200);
  }, [socket]);

  useEffect(() => {
    if (searchValue.trim(" ") === "") {
      setFollowingUserState(following);
    } else {
      const tempUser = following.filter(
        (user) => user.name.indexOf(searchValue) === 0
      );
      setFollowingUserState(tempUser);
    }
  }, [following, searchValue]);

  const SetRoom = async (followingUserProp) => {
      if (socket) {
        if(clickedFollowingUser._id){
          socket.emit("Leave Room", clickedFollowingUser._id);
        }
      }
      //console.log("FollowingUserId:", followingUserProp._id);
      dispatch(chatAction.setRoomId(followingUserProp._id));
      //console.log("RoomId:", followingUserProp._id);

      setClickedFollowingUser(followingUserProp);
      // if (socket) {
      //   //console.log(followingUserProp._id)
      //   setTimeout(() => {
      //     socket.emit("Join Room", { roomId: roomId });
      //     console.log(roomId);
      //   }, 500);
      // }
      
      dispatch(accessChatAsync({socket,followingUserProp,user}))
      console.log(chats)
    }
  const isUserAuthenticated = useSelector(
    (state) => state.user.isUserAuthenticated
  );
  const isFollowerShowing = useSelector(
    (state) => state.chat.isFollowerShowing
  );

  const followerVisibilityHandler = () => {
    dispatch(chatAction.changeFollowerShowing());
  };
  useEffect(() => {
    if (!isFollowerShowing) {
      dispatch(chatAction.changeFollowerShowing());
    }
    if (isUserAuthenticated) {
      dispatch(setFollowingAsync(user.accessToken));
      dispatch(setFollowerAsync(user.accessToken));
    }
  }, [dispatch]);

  return (
    <>
      <Box
        display="flex"
        flexDir="column"
        width="100vw"
        margin="auto"
        height="100vh"
        alignItems="center"
      >
        {/* Navbar Box */}
        <Box
          width={["100%", "100%", "100%", "95%", "95%", "95%"]}
          // backgroundColor="grey"
          py="0.3rem"
        >
          <Navbar showBell={true} />
        </Box>
        <Box
          display="flex"
          flexDir="row"
          width={["100%", "100%", "100%", "95%", "95%", "95%"]}
          justifyContent="center"
          alignItems="center"
          boxShadow="0px 0px 15px -7px grey"
          gap="1rem"
          height="100%"
        >
          {/* Content Box */}
          <Box
            gap="0.2rem"
            justifyContent="space-between"
            backgroundColor="whiteAlpha.900"
            p="1rem"
            display={
              isProfileOpen
                ? ["none", "none", "none", "flex", "flex", "flex"]
                : "flex"
            }
            flexDir="row"
            margin="auto"
            width={
              isProfileOpen
                ? "100%"
                : ["90%", "85%", "80%", "80%", "80%", "85%"]
            }
            height={["80vh", "85vh", "85vh", "90vh", "90vh", "90vh"]}
          >
            {/* All Followers Section */}
            <Box
              width={
                isFollowerShowing
                  ? ["80%", "80%", "25%", "25%", "25%", "25%"]
                  : "fit-content"
              }
              height="100%"
              position="relative"
              // bgGradient="linear(to-b, #797EF6,#b5b7fa)"
              // borderRadius="10px"
              backgroundColor="darkgray"
              borderBottomRadius="10px"
              borderTopRadius="5px"
              boxShadow="0px 0px 10px -3px grey"
            >
              <Box
                position="absolute"
                top="0.5rem"
                left="0.5rem"
                boxShadow="0px 0px 10px -6px grey"
                fontSize="3xl"
                width="fit-content"
                cursor="pointer"
                height="fit-content"
                onClick={followerVisibilityHandler}
                color={isFollowerShowing ? "white" : "black"}
              >
                <IoReorderThreeOutline />
              </Box>
              {/* Search Box for following User in Chat */}
              {isFollowerShowing && (
                <Box
                  position="relative"
                  top="3rem"
                  width="97%"
                  display="flex"
                  boxShadow="0px 0px 5px -1px white"
                  flexDir="row"
                  justifyContent="center"
                  alignItems="center"
                  cursor="pointer"
                  borderRadius="3px"
                  border="0px solid transparent"
                  backgroundColor="white"
                  // mx="7px"
                  margin="auto"
                  color="black"
                >
                  <Input
                    width="90%"
                    height="1.7rem"
                    focusBorderColor="transparent"
                    borderRadius="3px"
                    pl="5px"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  <AiOutlineSearch size="1.3rem" />
                </Box>
              )}

              <Box
                position="relative"
                top="3rem"
                height="80%"
                width="100%"
                mt="1rem"
                display={isFollowerShowing ? "flex" : "none"}
                flexDir="column"
                gap="0.5rem"
                alignItems="center"
                px="2px"
                overflowY="scroll"
                css={{
                  "&::-webkit-scrollbar": {
                    width: "3px",
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
                {/* Call Api here */}
                {followingUserState.length > 0 ? (
                  followingUserState.map((followingUser, i) => {
                    return (
                      <Box
                        key={i}
                        width="100%"
                        height="fit-content"
                        // border="0.5px solid lightgrey"
                        boxShadow="0px 0px 6px -3px black "
                        backgroundColor={
                          clickedFollowingUser._id === followingUser._id
                            ? "lightgrey"
                            : ""
                        }
                        onClick={() => {
                          SetRoom(followingUser);
                          dispatch(chatAction.changeFollowerShowing());
                        }}
                      >
                        <FollowingUser
                          border={false}
                          userdata={followingUser}
                          wantToNavigate={false}
                          showChatIcon={false}
                        />
                      </Box>
                    );
                  })
                ) : (
                  <Text
                    marginTop="20px"
                    fontSize="0.7rem"
                    color="gray"
                    fontStyle="italic"
                  >
                    No User Found.
                  </Text>
                )}
              </Box>
            </Box>

            {/* Main Parent Component for Input and Chats */}
            <Box
              display={
                isFollowerShowing
                  ? ["none", "flex", "flex", "flex", "flex", "flex"]
                  : "flex"
              }
              width={
                isFollowerShowing
                  ? ["0%", "60%", "75%", "75%", "75%", "75%"]
                  : "100%"
              }
              height="100%"
              flexDir="column"
              // border="2px solid lightgrey"
            >
              {/* Main Chat Container */}
              <Box width="100%" height="100%">
                {clickedFollowingUser && roomId ? (
                  <AllChatContainer
                    roomId={roomId}
                    socket={socket}
                    clickedFollowingUser={clickedFollowingUser}
                    user={user}
                    isUserAuthenticated={isUserAuthenticated}
                  />
                ) : (
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    flexDir="column"
                    justifyContent="center"
                    alignItems="center"
                    textAlign="center"
                    color="grey"
                    fontStyle="italic"
                  >
                    <Text fontSize="0.8rem" height="fit-content" mb="-7px">
                      Hello {user?.name}.
                    </Text>
                    <Text height="fit-content">
                      Click User to chat with them.
                    </Text>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {/* Profile Box */}
          <Box
            width={["80%", "40%", "35%", "30%", "30%", "30%"]}
            display={isProfileOpen ? "flex" : "none"}
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Profile showUser={displayedUser} />
          </Box>
        </Box>
      </Box>
    </>
  );
};

const InputContainer = ({ socket, roomId, clickedFollowingUser, user }) => {
  //const roomId = useSelector((state)=>state.chat.roomId)

  const dispatch = useDispatch();
  const [showEmojji, setShowEmoji] = useState(false);
  const [msg, setMsg] = useState("");
  const enterKeyPressed = (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      submitMessage();
    }
  };
  const newMessage = (e) => {
    setMsg(e.target.value);
  };

  const emojiClicked = (e, emoji) => {
    setShowEmoji(!showEmojji);
    const emojiMessage = emoji.emoji;
    setMsg(msg + emojiMessage);
  };
  const submitMessage = () => {
    if (msg.trim() === "") {
    } else {
      // Call dispatch here for send msg
      const data = {
        text: msg,
        sender: user._id,
        //roomId:roomId,
        receiver: clickedFollowingUser._id,
        //token: user.token,
      };
      //dispatch(addOneChatAsync(data));
      socket.emit(
        "sendMessage",
        {
          text: data.text,
          sender: data.sender,
          receiver: data.receiver,
        },
        (data) => {
          dispatch(addOneChatAsync(data));
        }
      );
      setMsg("");
    }
  };

  return (
    <>
      <Box
        width="100%"
        height="100%"
        // border="1.5px solid black"
        borderRadius="3px"
        display="flex"
        flexDir="row"
        justifyContent="space-evenly"
        alignItems="center"
        position="relative"
        boxShadow="0px 0px 6px -3px grey"
      >
        <Box width="fit-content" height="fit-content">
          <BsEmojiSmileFill
            cursor="pointer"
            fontSize={[
              "0.8rem",
              "1rem",
              "1.1rem",
              "1.3rem",
              "1.3rem",
              "1.3rem",
            ]}
            onClick={() => setShowEmoji(!showEmojji)}
          />
        </Box>

        <Box
          position="absolute"
          bottom="80%"
          left="0%"
          display={["none", "block", "block", "block", "block", "block"]}
          className="emoji"
        >
          {showEmojji && (
            <EmojiPicker
              width="20rem"
              height="20rem"
              onEmojiClick={emojiClicked}
            />
          )}
        </Box>

        <Input
          placeholder="Aa"
          variant="flushed"
          width={["60%", "65%", "65%", "70%", "70%", "70%"]}
          borderRadius="5px"
          height="50%"
          backgroundColor="white"
          pl="5px"
          value={msg}
          onChange={(e) => newMessage(e)}
          onKeyDown={enterKeyPressed}
        />
        <Box
          display="flex"
          width="fit-content"
          justifyContent="center"
          alignItems="center"
          fontSize={["1rem", "1rem", "1.2rem", "1.5rem", "1.5rem", "1.5rem"]}
          transition="100ms"
          cursor="pointer"
          _hover={{ fontSize: "1.7rem" }}
          onClick={submitMessage}
        >
          <RiSendPlaneFill />
        </Box>
      </Box>
    </>
  );
};

const AllChatContainer = ({
  roomId,
  socket,
  clickedFollowingUser,
  user,
  isUserAuthenticated,
}) => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chat);
  const [isRead, setIsRead] = useState(false);
  useEffect(() => {
    //console.log('Current Room : ',roomId)
    socket.on("MessagesUpdated", async (data) => {
      console.log(data.newMessage);
      //console.log('Current Room : ',roomId)
      //console.log('sender id : ',data.newMessage.sender)
      if (
        data.newMessage.sender.toString() === roomId &&
        data.newMessage.receiver.toString() === user._id.toString()
      ) {
        dispatch(addOneChatAsync(data.newMessage));
        dispatch(markReadAsync({data,user,setIsRead}))
      } else {
        //console.log('New message from user : ',data.newMessage.sender.toString())
        //setNotification(data.newMessage.sender.toString())
        //dispatch(chatAction.setNotificationCount(parseInt(notificationCount)+1))
        if (
          data.newMessage.sender.toString() !== user._id.toString() &&
          data.newMessage.receiver.toString() === user._id.toString()
        ) {
          dispatch(setNotificationAsync({data,user}))
        }
      }
    });
    return () => {
      socket.off("MessagesUpdated");
    };
  }, [clickedFollowingUser]);

  const getTime = (createdAt) => {
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

  const scrollRef = useRef();
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  return (
    <>
      <ToastContainer autoClose={2000}></ToastContainer>
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
            {chats.map((chat, i) => {
              return (
                <Box
                  key={i}
                  width="100%"
                  height="fit-content"
                  display="flex"
                  alignItems={
                    chat.sender === user._id ? "flex-end" : "flex-start"
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
                      {chat.sender === user._id ? (
                        <Box fontSize="0.8rem" ml="0px" mr="-2px" mb="1px">
                          <BsCheck />
                        </Box>
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
              roomId={roomId}
              clickedFollowingUser={clickedFollowingUser}
              user={user}
            />
          </Box>
        )}
      </Box>
    </>
  );
};

export default ChatContainer;
