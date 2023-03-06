/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllUserAsync } from "../../Redux/userAction";
import Navbar from "../Navbar";
import Profile from "../Profile";
import SearchBar from "./SearchBar";
import SearchContent from "./SearchContent";

const Search = () => {
  const allUser = useSelector((state) => state.user.allUser);
  const user = useSelector((state) => state.user.user);
  const isUserAuthenticated = useSelector(
    (state) => state.user.isUserAuthenticated
  );
  const dispatch = useDispatch();
  const isProfileOpen = useSelector((state) => state.user.isProfileOpen);
  const displayedUser = useSelector((state) => state.user.displayedUser);
  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    if (isUserAuthenticated) {
      dispatch(setAllUserAsync(user.accessToken));
    }
  }, []);

  useEffect(() => {
    allUser.filter((user) => user.name.indexOf(searchValue) === 0);
  }, [searchValue, allUser.length]);

  return (
    <>
      {/* Home Page Container */}
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
            justifyContent="flex-start"
            margin="auto"
            width={["100%", "80%", "80%", "70%", "60%", "60%"]}
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
            <SearchBar
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />
            <SearchContent allUser={allUser} searchValue={searchValue} />
          </Box>
          {/* Profile Box */}
          <Box
            width={["80%", "50%", "38%", "25%", "25%", "25%"]}
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

export default Search;
