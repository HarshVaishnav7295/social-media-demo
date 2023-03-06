/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Box, Text, Image } from "@chakra-ui/react";
import { userAction } from "../../Redux/userReducer";
import { useDispatch } from "react-redux";
import { IUser } from "../../types/reduxTypes";
interface ISearchContentProps {
  allUser: IUser[];
  searchValue: string;
}
const SearchContent = ({ allUser, searchValue }: ISearchContentProps) => {
  const [showUser, setShowUser] = useState<IUser[]>(allUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (searchValue.trim() === "" || searchValue.length === 0) {
      setShowUser(allUser);
    } else {
      const tempUser = allUser.filter(
        (user: IUser) => user.name.indexOf(searchValue) === 0
      );
      setShowUser(tempUser);
    }
  }, [searchValue]);

  const userProfileHandler = (user: IUser) => {
    dispatch(userAction.changeProfileVisiblity());
    dispatch(userAction.setDisplayedUser(user));
  };

  return (
    <Box
      w={["80%", "80%", "80%", "70%", "70%", "70%"]}
      marginInline="auto"
      mt="4rem"
      boxShadow="lg"
      display="flex"
      flexDirection="column"
      cursor="pointer"
      gap="0.2rem"
      // h="10rem"
    >
      {
        showUser ? showUser?.map((user) => {
        return (
          <Box
            onClick={() => {
              userProfileHandler(user);
            }}
            key={user._id}
            padding="0.5rem"
            backgroundColor="darkgray"
            borderRadius="5px"
            width="100%"
            boxShadow="0px 0px 5px -2px black"
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
              <Box width="4rem" height="4rem">
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
                  border="1.5px solid white"
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
                  color="black"
                  textAlign="center"
                >
                  Username
                </Text>
                <Text
                  color="white"
                  fontWeight="medium"
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
                  color="black"
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
                  color="white"
                  fontWeight="medium"
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
                  color="black"
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
                  color="white"
                  fontWeight="medium"
                  textAlign="center"
                >
                  {user.followers.length}
                </Text>
              </Box>
            </Box>
          </Box>
        );
      }) : <Text fontSize="0.8rem" color="gray" fontStyle="italic">Search users above.</Text>
      }
    </Box>
  );
};

export default SearchContent;