import React, { useEffect, useState } from "react";
import { BiGhost } from "react-icons/bi";
import { Box, Text, Image } from "@chakra-ui/react";
import { userAction } from "../../Redux/userReducer";
import { useDispatch } from "react-redux";

const SearchContent = ({ allUser, searchValue }) => {
  const [showUser, setShowUser] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (searchValue.trim(" ") === "" || searchValue.length === 0) {
      setShowUser([]);
    } else {
      const tempUser = allUser.filter(
        (user) => user.name.indexOf(searchValue) === 0
      );
      setShowUser(tempUser);
    }
  }, [searchValue]);

  const userProfileHandler = (user) => {
    dispatch(userAction.changeProfileVisiblity());
    dispatch(userAction.setDisplayedUser(user));
    console.log("user", user);
  };

  return (
    <Box
      w={["80%", "80%", "80%", "70%", "70%", "70%"]}
      marginInline="auto"
      mt="3rem"
      border="1px solid transparent"
      boxShadow="lg"
      display="flex"
      flexDirection="column"
      // h="10rem"
    >
      {showUser.map((user) => {
        return (
          <Box
            onClick={() => {
              userProfileHandler(user);
            }}
            key={user._id}
            padding=".5rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {/* user avatar */}
            <Box display="flex" alignItems="center" gap="1rem">
              <Box w="4rem">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    borderRadius="50%"
                    border="1px solid transparent"
                  />
                ) : (
                  <BiGhost />
                )}
              </Box>
              <Box>
                <Text fontSize=".7rem" color="gray" textAlign="center">
                  Username
                </Text>
                <Text fontSize="1rem">{user.name}</Text>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap="1rem">
              <Box>
                <Text fontSize=".7rem" color="gray" textAlign="center">
                  Followings
                </Text>
                <Text fontSize="1rem" textAlign="center">
                  {user.followings.length}
                </Text>
              </Box>
              <Box>
                <Text fontSize=".7rem" color="gray" textAlign="center">
                  Followers
                </Text>
                <Text fontSize="1rem" textAlign="center">
                  {user.followers.length}
                </Text>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default SearchContent;
