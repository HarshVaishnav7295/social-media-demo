/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Input } from "@chakra-ui/react";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../Navbar";
import Profile from "../Profile";
import { IoReorderThreeOutline } from "react-icons/io5";
import { chatAction } from "../../Redux/chatReducer";
import FollowingUser from "../FollowingUser";
import { RiSendPlaneFill } from "react-icons/ri";
import { BsEmojiSmileFill } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import { setFollowerAsync, setFollowingAsync } from "../../Redux/userAction";
import { io } from "socket.io-client";
import { Img, Text } from "@chakra-ui/react";
import { setAllChatAsync } from "../../Redux/chatAction";

const ChatContainer = () => {
  const dispatch = useDispatch();
  const displayedUser = useSelector((state) => state.user.displayedUser);
  const user = useSelector((state) => state.user.user);
  //const chatId = useSelector((state)=>state.chat.chatId)
  const [clickedFollowingUser, setClickedFollowingUser] = useState("");
  const isProfileOpen = useSelector((state) => state.user.isProfileOpen);
  const following = useSelector((state) => state.user.following);
  const [socket, setSocket] = useState(null);
  const [chatId, setChatId] = useState("");

  useEffect(() => {
    if (socket === null) {
      setSocket(io.connect("http://localhost:8000"));
    }
  }, [socket]);

  const SetRoom = useCallback(
    async (followingUserProp) => {
      setClickedFollowingUser(followingUserProp);
      if (socket) {
        socket.emit("Leave Room", chatId);
      }
      let resp = await fetch("http://localhost:8000/api/chat/accessChat", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        method: "POST",
        body: JSON.stringify({
          users: [followingUserProp._id, user._id],
        }),
      });
      if (resp.status === 500) {
        let error = await resp.json();
        console.log(error.errorMessage);
      } else if (resp.status === 200) {
        let data = await resp.json();
        setChatId(data.chat[0]._id);

        if (socket) {
          socket.emit("Join Room", {
            chatId: data.chat[0]._id,
            users: data.chat[0].users,
          });
        }
      }
    },
    [chatId]
  );
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
    if (isUserAuthenticated) {
      dispatch(setFollowingAsync(user.token));
      dispatch(setFollowerAsync(user.token));
    }
  }, [dispatch]);

  return (
    <>
      <Box
        display="flex"
        flexDir="column"
        width="100vw"
        margin="auto"
        height={["80vh", "80vh", "90vh", "90vh", "90vh", "90vh"]}
        alignItems="center"
      >
        {/* Navbar Box */}
        <Box
          width={["100%", "100%", "100%", "95%", "95%", "95%"]}
          // backgroundColor="grey"
          py="0.3rem"
        >
          <Navbar />
        </Box>
        <Box
          display="flex"
          flexDir="row"
          width={["100%", "100%", "100%", "95%", "95%", "95%"]}
          justifyContent="center"
          alignItems="center"
          boxShadow="0px 0px 15px -7px grey"
          gap="1rem"
          backgroundColor="whiteAlpha.300"
        >
          {/* Content Box */}
          <Box
            display="flex"
            flexDir="row"
            gap="0.2rem"
            justifyContent="space-between"
            width={isProfileOpen ? "70%" : "90%"}
            height="90vh"
            backgroundColor="whiteAlpha.900"
            // border="2px"
            p="1.5rem"
          >
            {/* All Followers Section */}
            <Box
              width={
                isFollowerShowing
                  ? ["80%", "80%", "25%", "25%", "25%", "25%"]
                  : "fit-content"
              }
              height="100%"
              // border="1px solid grey"
              boxShadow="0px 0px 10px -6px grey"
              position="relative"
            >
              <Box
                // position="absolute"
                top="0.5rem"
                left="0.5rem"
                fontSize="3xl"
                width={isFollowerShowing ? "100%" : "fit-content"}
                cursor="pointer"
                height="7%"
                onClick={followerVisibilityHandler}
              >
                <IoReorderThreeOutline />
              </Box>
              <Box
                height="93%"
                width="100%"
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

                {following.map((followingUser, i) => {
                  return (
                    <Box
                      key={i}
                      width={["100%", "60%", "100%", "100%", "100%", "100%"]}
                      height="fit-content"
                      // border="0.5px solid lightgrey"
                      boxShadow="0px 1px 5px -2px grey "
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
                      />
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* Main Parent Component for Input and Chats */}
            <Box
              display={
                isFollowerShowing
                  ? ["none", "none", "flex", "flex", "flex", "flex"]
                  : "flex"
              }
              width={
                isFollowerShowing
                  ? ["0%", "0%", "75%", "75%", "75%", "75%"]
                  : "100%"
              }
              height="100%"
              flexDir="column"
              // border="2px solid lightgrey"
            >
              {/* Main Chat Container */}
              <Box width="100%" height="100%">
                {clickedFollowingUser && chatId && (
                  <AllChatContainer
                    chatId={chatId}
                    socket={socket}
                    clickedFollowingUser={clickedFollowingUser}
                    user={user}
                    isUserAuthenticated={isUserAuthenticated}
                  />
                )}
              </Box>
            </Box>
          </Box>

          {/* Profile Box */}
          <Box
            width="25%"
            display={isProfileOpen ? "flex" : "none"}
            justifyContent="center"
            alignItems="center"
            transition="250ms"
            height="100%"
          >
            <Profile showUser={displayedUser} />
          </Box>
        </Box>
      </Box>
    </>
  );
};

const InputContainer = ({ socket, chatId, clickedFollowingUser, user }) => {
  //const chatId = useSelector((state)=>state.chat.chatId)
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
        chatId: chatId,
        receiver: clickedFollowingUser._id,
        token: user.token,
      };
      //dispatch(addOneChatAsync(data));
      socket.emit("sendMessage", {
        text: data.text,
        sender: data.sender,
        receiver: data.receiver,
        chatId: data.chatId,
      });
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
        <BsEmojiSmileFill
          cursor="pointer"
          fontSize="1.3rem"
          onClick={() => setShowEmoji(!showEmojji)}
        />

        <Box position="absolute" bottom="80%" left="0%" className="emoji">
          {showEmojji && (
            <EmojiPicker
              width="20rem"
              height="30rem"
              onEmojiClick={emojiClicked}
            />
          )}
        </Box>

        <Input
          placeholder="Aa"
          variant="flushed"
          width="70%"
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
          fontSize="1.5rem"
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
  chatId,
  socket,
  clickedFollowingUser,
  user,
  isUserAuthenticated,
}) => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chat);

  useEffect(() => {
    socket.on("MessagesUpdated", (data) => {
      if (!data.message) {
        dispatch(setAllChatAsync(data));
      } else {
        if (data.message.chat === chatId) {
          dispatch(setAllChatAsync(data.messages));
        }
      }
    });
  }, [chats, clickedFollowingUser, chatId]);

  return (
    <>
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
          width="85%"
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
            // backgroundColor="lightgray"
          >
            {/* posts
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
                {0}
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
                Posts
              </Box>
            </Box> */}

            {/* Followers */}
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
          {/* Map here */}
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
                  height="2rem"
                  display="flex"
                  alignItems={
                    chat.sender === user._id ? "flex-end" : "flex-start"
                  }
                  flexDir="column"
                >
                  <Box
                    width="fit-content"
                    maxWidth="40%"
                    minWidth="7%"
                    height="fit-content"
                    backgroundColor="lightgrey"
                    px="10px"
                    py="3px"
                    display="flex"
                    justifyContent="center"
                    borderRadius="3px"
                    fontSize="0.9rem"
                    mb="-2px"
                    cursor="pointer"
                  >
                    {chat.text}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
        {clickedFollowingUser && chatId && (
          <Box
            width="100%"
            height="10%"
            backgroundColor="lightgray"
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt="0.2rem"
          >
            <InputContainer
              socket={socket}
              chatId={chatId}
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
