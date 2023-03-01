import { Box } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import Profile from "./Profile";

const AddPost = () => {
  // const user = useSelector((state) => state.user.user);
  const isProfileOpen = useSelector((state) => state.user.isProfileOpen);

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
          gap="1rem"
        >
          {/* Content Box */}
          <Box
            display="flex"
            flexDir="column"
            justifyContent="center"
            width={isProfileOpen ? "70%" : "100%"}
            height="90vh"
            p="1.5rem"
          >
            add post here ..
          </Box>
          {/* Profile Box */}
          <Box
            width="25%"
            display={isProfileOpen ? "flex" : "none"}
            justifyContent="center"
            alignItems="center"
            transition="250ms"
          >
            <Profile />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AddPost;
