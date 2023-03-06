import { Box, Input, Text } from "@chakra-ui/react";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { IoReorderThreeOutline } from "react-icons/io5";
import { chatAction } from "../../Redux/chatReducer";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { IUser } from "../../types/reduxTypes";
import FollowingUser from "../FollowingUser";

interface IUserChatProps {
  followingUserState: IUser[] | undefined;
  followerVisibilityHandler: ()=>void,
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  SetRoom: (followingUserProp: IUser) => Promise<void>;
  clickedFollowingUser: IUser | undefined;
}

const UserChat = ({
  followingUserState,
  searchValue,
  followerVisibilityHandler,
  setSearchValue,
  SetRoom,
  clickedFollowingUser,
}: IUserChatProps) => {
  const dispatch = useAppDispatch();
  const isFollowerShowing = useAppSelector(
    (state) => state.chat.isFollowerShowing
  );


  return (
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
        {followingUserState ? (
          followingUserState.map((followingUser, i) => {
            return (
              <Box
                key={i}
                width="100%"
                height="fit-content"
                // border="0.5px solid lightgrey"
                boxShadow="0px 0px 6px -3px black "
                backgroundColor={
                  clickedFollowingUser?._id === followingUser._id
                    ? "lightgrey"
                    : ""
                }
                onClick={() => {
                  SetRoom(followingUser);
                  dispatch(chatAction.changeFollowerShowing());
                }}
              >
                <FollowingUser
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
  );
};

export default UserChat;
