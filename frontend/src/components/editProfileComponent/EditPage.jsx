import { Box, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import Navbar from "../Navbar";
import EditProfile from "./EditProfile";
import EditPassword from "./EditPassword";
import { useSelector } from "react-redux";
import Profile from "../Profile";

const EditPage = () => {
  const displayedUser = useSelector((state) => state.user.displayedUser);
  const [isActive, setIsActive] = useState("editProfile"); // changePassword
  const user = useSelector((state) => state.user.user);
  const isProfileOpen = useSelector((state) => state.user.isProfileOpen);
  // const dispatch = useDispatch();

  return (
    <>
      <Navbar />
      <Box
        width="100%"
        height="90vh"
        display="flex"
        flexDir="row"
        justifyContent="space-around"
        alignItems="center"
      >
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
          height="90vh"
        >
          <Box
            display="flex"
            margin="auto"
            w="80%"
            flexDirection={["column", "column", "column", "row", "row", "row"]}
            height="90vh"
            borderRadius=".4rem"
            marginTop="2rem"
          >
            {/* left */}
            <Box
              display="flex"
              flexDirection={[
                "row",
                "row",
                "row",
                "column",
                "column",
                "column",
              ]}
              flexBasis={["5%", "5%", "5%", "20%", "20%", "20%"]}
              // border={['none','none','none','1px solid gray','1px solid gray','1px solid gray']}
              // borderBottom={['1px solid gray','1px solid gray','1px solid gray','none','none','none',]}
              // borderBottom='1px solid gray'
            >
              <Text
                px=".9rem"
                py="1rem"
                fontWeight={isActive === "editProfile" ? "700" : "500"}
                borderLeft={isActive === "editProfile" ? "2px solid" : "none"}
                borderLeftColor={[
                  "none",
                  "none",
                  "none",
                  "gray",
                  "gray",
                  "gray",
                ]}
                borderTopRadius=".2rem"
                _hover={{ cursor: "pointer" }}
                onClick={() => setIsActive("editProfile")}
              >
                Edit Profile
              </Text>

              <Text
                px=".9rem"
                py="1rem"
                fontWeight={isActive === "changePassword" ? "700" : "500"}
                borderLeft={
                  isActive === "changePassword" ? "2px solid" : "none"
                }
                borderLeftColor={[
                  "none",
                  "none",
                  "none",
                  "gray",
                  "gray",
                  "gray",
                ]}
                borderRadius=".1rem"
                _hover={{ cursor: "pointer" }}
                onClick={() => setIsActive("changePassword")}
              >
                Change Password
              </Text>
            </Box>

            {/* right */}
            {isActive === "editProfile" ? (
              <EditProfile user={user} />
            ) : (
              <EditPassword user={user} />
            )}
          </Box>
        </Box>

        {/* Profile Box */}
        <Box
          width={["80%", "40%", "35%", "30%", "30%", "30%"]}
          display={isProfileOpen ? "flex" : "none"}
          justifyContent="center"
          alignItems="center"
          // height={["90%", "90%", "90%", "100%", "100%", "100%"]}
          height="100%"
        >
          <Profile showUser={displayedUser} />
        </Box>
      </Box>
    </>
  );
};

export default EditPage;
