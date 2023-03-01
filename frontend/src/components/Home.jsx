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
          width="95%"
          height="100%"
          justifyContent="center"
          alignItems={["start", "start", "start", "center", "center", "center"]}
          gap="1rem"
        >
          {/* Content Box */}
          <Box
            display={
              isProfileOpen
                ? ["none", "none", "none", "flex", "flex", "flex"]
                : "flex"
            }
            flexDir="column"
            justifyContent="center"
            margin="auto"
            width={isProfileOpen ? "100%" : "70%"}
            height="90%"
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
            width={["80%", "40%", "35%", "30%", "30%", "30%"]}
            display={isProfileOpen ? "flex" : "none"}
            justifyContent="center"
            alignItems="center"
            // height={["90%", "90%", "90%", "100%", "100%", "100%"]}
            height="100%"

            // border="2px"
          >
            <Profile showUser={displayedUser} />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Home;
