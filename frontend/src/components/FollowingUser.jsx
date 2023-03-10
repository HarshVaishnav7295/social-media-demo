/* eslint-disable no-unused-vars */
import { Box, Img, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userAction } from "../Redux/userReducer";

const FollowingUser = ({ userdata, wantToNavigate, showChatIcon }) => {
  //const [unReadCount, setunReadCount] = useState(10);
  const isProfileOpen = useSelector((state) => state.user.isProfileOpen);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userClicked = () => {
    if (wantToNavigate) {
      navigate("/chat");
      if (isProfileOpen) {
        dispatch(userAction.changeProfileVisiblity());
      }
    }
  };
  return (
    <>
      <Box
        display="flex"
        flexDir="row"
        width="100%"
        cursor="pointer"
        gap="0.3rem"
        justifyContent="space-between"
        alignItems="center"
        color="white"
        px={["3px", "3px", "3px", "0.3rem", "0.3rem", "0.3rem"]}
      >
        {/*Image Box  */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="fit-content"
          flexDirection="row"
          height="3.5rem"
          borderRadius="50%"
          gap="0.7rem"
        >
          <Img
            src={
              userdata.avatar
                ? userdata.avatar
                : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-260nw-1725655669.jpg"
            }
            // src="https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-260nw-1725655669.jpg"
            borderRadius="50%"
            width="3.5rem"
            border="1px solid #636363"
            p="3px"
            gap="0.5rem"
            height="3.5rem"
          />

          {/* User Info like Name and Bio */}
          <Box
            display="flex"
            flexDir="column"
            justifyContent="center"
            width="fit-content"
          >
            <Text fontSize="0.8rem" fontWeight="medium">
              {userdata.name}
            </Text>
            <Text fontSize="0.7rem" color="grey">
              {userdata.bio}
            </Text>
          </Box>
        </Box>

        {/* Chat User Icon */}
        {showChatIcon && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            fontSize="2xl"
            px="5px"
            width="fit-content"
            onClick={userClicked}
            color="black"
          >
            <RiSendPlaneFill />
          </Box>
        )}
      </Box>
    </>
  );
};

export default FollowingUser;
