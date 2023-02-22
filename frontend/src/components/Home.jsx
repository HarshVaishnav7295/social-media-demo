import { Box } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import Content from "./Content";
import Navbar from "./Navbar";
import Profile from "./Profile";

const Home = () => {
  const isProfileOpen = useSelector((state) => state.user.isProfileOpen);
  const displayedUser = useSelector((state) => state.user.displayedUser);

  return (
    <>
      {/* Home Page Container */}
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

        {/* main Body Box */}
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
            margin="auto"
            width={isProfileOpen ? "100%" : "70%"}
            height="90vh"
            // p="1.5rem"
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
            <Content />
          </Box>
          {/* Profile Box */}
          <Box
            width={["70%", "70%", "70%", "30%", "30%", "30%"]}
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

export default Home;
