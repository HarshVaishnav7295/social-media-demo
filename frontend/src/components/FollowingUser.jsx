import { Box, Img, Text } from "@chakra-ui/react";
import React from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const FollowingUser = ({ border, userdata, wantToNavigate }) => {
  const navigate = useNavigate();

  const userClicked = () => {
    if (wantToNavigate) {
      navigate("/chat");
    }
  };
  return (
    <>
      <Box
        display="flex"
        flexDir="row"
        width="100%"
        cursor="pointer"
        border={border ? "2px" : "0px"}
        gap="0.3rem"
        justifyContent="space-between"
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
        >
          <Img
            src={
              userdata.avatar
                ? userdata.avatar
                : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-260nw-1725655669.jpg"
            }
            // src="https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-260nw-1725655669.jpg"
            borderRadius="50%"
            width="80%"
            border="1px solid red"
            p="3px"
            gap="0.5rem"
            height="80%"
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
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          fontSize="2xl"
          width="fit-content"
          onClick={userClicked}
        >
          <RiSendPlaneFill />
        </Box>
      </Box>
    </>
  );
};

export default FollowingUser;
