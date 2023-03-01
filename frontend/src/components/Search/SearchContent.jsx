/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
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
      cursor="pointer"
      // h="10rem"
    >
      {showUser.map((user) => {
        return (
          <Box
            onClick={() => {
              userProfileHandler(user);
            }}
            key={user._id}
            padding="0.5rem"
            width="100%"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {/* user avatar */}
            <Box
              display="flex"
              alignItems="center"
              gap={["0.3rem", "0.3rem", "0.4rem", "1rem", "1rem", "1rem"]}
            >
              <Box width="4rem">
                <Image
                  src={
                    user?.avatar
                      ? user?.avatar
                      : "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
                  }
                  borderRadius="50%"
                  width={[
                    "2.5rem",
                    "3rem",
                    "3rem",
                    "3.5rem",
                    "3.5rem",
                    "3.5rem",
                  ]}
                  height={[
                    "2.5rem",
                    "3rem",
                    "3rem",
                    "3.5rem",
                    "3.5rem",
                    "3.5rem",
                  ]}
                  border="1px solid transparent"
                />
              </Box>
              <Box>
                <Text
                  fontSize={[
                    "0.5rem",
                    "0.5rem",
                    ".7rem",
                    ".7rem",
                    ".7rem",
                    ".7rem",
                  ]}
                  color="gray"
                  textAlign="center"
                >
                  Username
                </Text>
                <Text
                  fontSize={[
                    "0.8rem",
                    "0.8rem",
                    "1rem",
                    "1rem",
                    "1rem",
                    "1rem",
                  ]}
                >
                  {user.name}
                </Text>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap="1rem">
              <Box>
                <Text
                  fontSize={[
                    "0.5rem",
                    "0.5rem",
                    ".7rem",
                    ".7rem",
                    ".7rem",
                    ".7rem",
                  ]}
                  color="gray"
                  textAlign="center"
                >
                  Followings
                </Text>
                <Text
                  fontSize={[
                    "0.8rem",
                    "0.8rem",
                    "1rem",
                    "1rem",
                    "1rem",
                    "1rem",
                  ]}
                  textAlign="center"
                >
                  {user.followings.length}
                </Text>
              </Box>
              <Box>
                <Text
                  fontSize={[
                    "0.5rem",
                    "0.5rem",
                    ".7rem",
                    ".7rem",
                    ".7rem",
                    ".7rem",
                  ]}
                  color="gray"
                  textAlign="center"
                >
                  Followers
                </Text>
                <Text
                  fontSize={[
                    "0.8rem",
                    "0.8rem",
                    "1rem",
                    "1rem",
                    "1rem",
                    "1rem",
                  ]}
                  textAlign="center"
                >
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
