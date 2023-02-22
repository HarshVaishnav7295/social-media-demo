import { Box, Img, Input, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../Navbar";
import Profile from "../Profile";
import { IoReorderThreeOutline } from "react-icons/io5";
import { chatAction } from "../../Redux/chatReducer";
import FollowingUser from "../FollowingUser";
import { RiSendPlaneFill } from "react-icons/ri";
import { BsEmojiSmileFill } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import { addOneChatAsync, setAllChatAsync } from "../../Redux/chatAction";
import { setFollowingAsync } from "../../Redux/userAction";

const ChatContainer = () => {
  const dispatch = useDispatch();
  const displayedUser = useSelector((state) => state.user.displayedUser);
  const user = useSelector((state) => state.user.user);

  const [clickedFollowingUser, setClickedFollowingUser] = useState("");
  const isProfileOpen = useSelector((state) => state.user.isProfileOpen);
  const following = useSelector((state) => state.user.following);

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box
        display="flex"
        flexDir="column"
        width="100vw"
        margin="auto"
        height="90vh"
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
              width={isFollowerShowing ? "25%" : "fit-content"}
              height="100%"
              // border="1px solid grey"
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
                      width="100%"
                      height="fit-content"
                      // border="0.5px solid lightgrey"
                      boxShadow="0px 1px 5px -2px grey "
                      backgroundColor={
                        clickedFollowingUser._id === followingUser._id
                          ? "lightgrey"
                          : ""
                      }
                      onClick={() => setClickedFollowingUser(followingUser)}
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
              display="flex"
              width={isFollowerShowing ? "75%" : "100%"}
              height="100%"
              flexDir="column"
              // border="2px solid lightgrey"
            >
              {/* Main Chat Container */}
              <Box width="100%" height="100%">
                {clickedFollowingUser && (
                  <AllChatContainer
                    clickedFollowingUser={clickedFollowingUser}
                    user={user}
                    isUserAuthenticated={isUserAuthenticated}
                  />
                )}
              </Box>

              {/* Box for Input Chat Container */}
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
// *******************************************************************************************************

const InputContainer = ({ clickedFollowingUser, user }) => {
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
        receiverId: clickedFollowingUser._id,
        token: user.token,
      };
      dispatch(addOneChatAsync(data));
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
// *******************************************************************************************************
export const AllChatContainer = ({
  clickedFollowingUser,
  user,
  isUserAuthenticated,
}) => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chat);
  useEffect(() => {
    const data = {
      receiverId: clickedFollowingUser._id,
      senderId: user._id,
      token: user.token,
    };
    dispatch(setAllChatAsync(data));
  }, [clickedFollowingUser._id, user.token, dispatch, user._id]);

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
            <Box width="3.5rem" height="3.5rem" borderRadius="50%">
              <Img src={clickedFollowingUser.avatar} borderRadius="50%" />
            </Box>
            <Box width="fit-content" display="flex" flexDir="column">
              <Text width="fit-content" fontSize="1.2rem" height="fit-content">
                {clickedFollowingUser.name}
              </Text>
              <Text
                width="fit-content"
                fontSize="0.8rem"
                color="grey"
                height="fit-content"
              >
                {clickedFollowingUser.bio}kfffff
              </Text>
            </Box>

            {/* Box for show follower and followings */}
          </Box>

          {/* User Name */}
          {/* Followers and Post Container */}
          <Box
            width="fit-content"
            display="flex"
            flexDir="row"
            justifyContent="space-evenly"
            gap="1rem"
            // backgroundColor="lightgray"
          >
            {/* posts */}
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
                  "0.7rem",
                  "0.7rem",
                  "0.7rem",
                  "0.9rem",
                  "0.9rem",
                  "0.9rem",
                ]}
              >
                {0}
              </Box>
              <Box
                fontSize={[
                  "0.6rem",
                  "0.6rem",
                  "0.6rem",
                  "0.8rem",
                  "0.8rem",
                  "0.8rem",
                ]}
                color="grey"
              >
                Posts
              </Box>
            </Box>

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
                  "0.7rem",
                  "0.7rem",
                  "0.7rem",
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
                  "0.6rem",
                  "0.6rem",
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
                  "0.7rem",
                  "0.7rem",
                  "0.7rem",
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
                  "0.6rem",
                  "0.6rem",
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
                  {/* Time stamp Box */}
                  {/* 2023-02-20T09:28:41.985Z */}
                  <Box fontSize="0.57rem" textColor="darkgrey">
                    {chat.createdAt.split("T")[1].split(":")[0]}:
                    {chat.createdAt.split("T")[1].split(":")[1]}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
        {clickedFollowingUser && (
          <Box
            width="100%"
            height="10%"
            backgroundColor="lightgray"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <InputContainer
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
