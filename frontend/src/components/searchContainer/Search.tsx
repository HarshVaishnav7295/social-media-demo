/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  setAllUserAsync,
  setFollowerAsync,
  setFollowingAsync,
} from "../../Redux/userAction";
import Navbar from "../Navbar";
import Profile from "../Profile";
import SearchBar from "./SearchBar";
import SearchContent from "./SearchContent";

const Search = () => {
  const allUser = useAppSelector((state) => state.user.allUser);
  const user = useAppSelector((state) => state.user.user);
  const isUserAuthenticated = useAppSelector(
    (state) => state.user.isUserAuthenticated
  );
  const dispatch = useAppDispatch();
  const isProfileOpen = useAppSelector((state) => state.user.isProfileOpen);
  const displayedUser = useAppSelector((state) => state.user.displayedUser);
  const [searchValue, setSearchValue] = useState<string>("");
  useEffect(() => {
    if (isUserAuthenticated && user) {
      dispatch(setAllUserAsync(user.accessToken));
      dispatch(setFollowerAsync(user.accessToken));
      dispatch(setFollowingAsync(user.accessToken));
    }
  }, []);

  useEffect(() => {
    allUser.filter((user) => user.name.indexOf(searchValue) === 0);
  }, [searchValue, allUser.length]);

  return (
    <>
      {/* Home Page Container */}
      <ToastContainer />
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
          <Navbar showBell={false} notificationCount={0} />
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
            height="100%"
          >
            <Profile showUser={displayedUser} />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Search;