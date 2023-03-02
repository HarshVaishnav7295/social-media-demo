/* eslint-disable react-hooks/exhaustive-deps */

import { Box } from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import Navbar from "../Navbar";
import Profile from "../Profile";
import { chatAction } from "../../Redux/chatReducer";
import { setFollowingAsync, setFollowerAsync } from "../../Redux/userAction";
import io, { Socket } from "socket.io-client";
import { Text } from "@chakra-ui/react";
import { setAllChatAsync } from "../../Redux/chatAction";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { IUser } from "../../types/reduxTypes";
import AllChatContainer from "./AllChatContainer";
import UserChat from "./UserChat";
const ChatContainer = () => {
  const dispatch = useAppDispatch();
  const displayedUser = useAppSelector((state) => state.user.displayedUser);

  const user = useAppSelector((state) => state.user.user);
  const isProfileOpen = useAppSelector((state) => state.user.isProfileOpen);
  const following = useAppSelector((state) => state.user.following);
  const [socket, setSocket] = useState<Socket>();
  const [searchValue, setSearchValue] = useState<string>("");
  const [followingUserState, setFollowingUserState] = useState<IUser[]>();
  const [clickedFollowingUser, setClickedFollowingUser] = useState<IUser>();

  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    if (socket === undefined) {
      setSocket(io("http://localhost:8000"));
      //console.log('Connection made')
    }
    setTimeout(() => {
      if (socket != null) {
        //console.log('setup called')
        if (user) socket.emit("setup", user._id);
      }
    }, 200);
  }, [socket]);

  useEffect(() => {
    if (searchValue.trim() === "") {
      setFollowingUserState(following);
    } else {
      const tempUser = following.filter(
        (user) => user.name.indexOf(searchValue) === 0
      );
      setFollowingUserState(tempUser);
    }
  }, [following, searchValue]);

  const SetRoom = useCallback(
    async (followingUserProp: IUser) => {
      if (socket) {
        socket.emit("Leave Room", roomId);
      }
      console.log("FollowingUserId:", followingUserProp._id);
      setRoomId(followingUserProp._id);
      console.log("RoomId:", followingUserProp._id);

      setClickedFollowingUser(followingUserProp);
      if (socket) {
        //console.log(followingUserProp._id)
        setTimeout(() => {
          socket.emit("Join Room", { roomId: roomId });
          console.log(roomId);
        }, 500);
      }
      if (user) {
        const resp = await fetch("http://localhost:8000/api/chat/accessChat", {
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
          // console.log(data.chat)
          if (socket) {
            socket.emit("Join Room", roomId);
          }
          dispatch(setAllChatAsync(data.chat));
        }
      }
    },
    [roomId]
  );
  const isUserAuthenticated = useAppSelector(
    (state) => state.user.isUserAuthenticated
  );
  const isFollowerShowing = useAppSelector(
    (state) => state.chat.isFollowerShowing
  );

  useEffect(() => {
    if (!isFollowerShowing) {
      dispatch(chatAction.changeFollowerShowing());
    }
    if (isUserAuthenticated) {
      if (user) {
        dispatch(setFollowingAsync(user.token));
        dispatch(setFollowerAsync(user.token));
      }
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
          <Navbar showBell={true} notificationCount={0} />
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
            <UserChat
              followingUserState={followingUserState}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              SetRoom={SetRoom}
              clickedFollowingUser={clickedFollowingUser}
            />

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

export default ChatContainer;
