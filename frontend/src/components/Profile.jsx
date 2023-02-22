/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import { Box, Button, Img, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import FollowingUser from "./FollowingUser";
import { BsPower } from "react-icons/bs";
import { userAction } from "../Redux/userReducer";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  followUnfollowAsync,
  setFollowerAsync,
  setFollowingAsync,
} from "../Redux/userAction";
import { ToastOption } from "./Register";
import { toast } from "react-toastify";

const Profile = ({ showUser }) => {
  const user = useSelector((state) => state.user.user);
  const [isFollowed, setIsFollowed] = useState(false);

  const isUserAuthenticated = useSelector(
    (state) => state.user.isUserAuthenticated
  );

  const follower = useSelector((state) => state.user.follower);
  const following = useSelector((state) => state.user.following);

  const [isFollowerSelected, setIsFollowerSelected] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isUserAuthenticated) {
      user?.followings.map((followingId) => {
        if (followingId?._id === showUser?._id) {
          setIsFollowed(true);
        }
      });
    }
  }, [user, showUser]);

  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(userAction.deleteUserFromStorage());
    navigate("/");
  };
  const handleUserClick = (followUser) => {
    dispatch(userAction.setDisplayedUser(followUser));
    dispatch(setFollowingAsync(user?.token));

    console.log("followUser", followUser);
  };

  return (
    <>
      <Box
        width="100%"
        height="100%"
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="space-evenly"
      >
        {/* Profile Pic Box */}
        <Box
          border="2px solid red"
          display="flex"
          width={["3.5rem", "3.5rem", "3.5rem", "4.5rem", "4.5rem", "4.5rem"]}
          height={["3.5rem", "3.5rem", "3.5rem", "4.5rem", "4.5rem", "4.5rem"]}
          justifyContent="center"
          alignItems="center"
          // p="3px"
          borderRadius="50%"
          overflow="hidden"
          cursor="pointer"
        >
          <Img
            src={
              isUserAuthenticated && showUser?.avatar
                ? showUser.avatar
                : "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
            }
            // src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
            width="100%"
            height="100%"
            backgroundColor="transparent"
            borderRadius="50%"
            transition="250ms"
          />
        </Box>

        {/* Followers and Post Container */}
        <Box
          width="100%"
          display="flex"
          flexDir="row"
          justifyContent="space-evenly"
          // backgroundColor="lightgray"
        >
          {/* posts */}
          <Box
            display="flex"
            flexDir="column"
            gap="0"
            alignItems="center"
            cursor="pointer"
          >
            <Box
              fontWeight="bold"
              fontSize={[
                "0.7rem",
                "0.7rem",
                "0.7rem",
                "0.9rem",
                "0.9rem",
                "0.9rem",
              ]}
            >
              {0}
            </Box>
            <Box
              fontSize={[
                "0.6rem",
                "0.6rem",
                "0.6rem",
                "0.8rem",
                "0.8rem",
                "0.8rem",
              ]}
              color="grey"
            >
              Posts
            </Box>
          </Box>

          {/* Followers */}
          <Box
            display="flex"
            flexDir="column"
            gap="0"
            alignItems="center"
            cursor="pointer"
            onClick={() => setIsFollowerSelected(true)}
          >
            <Box
              fontWeight="bold"
              fontSize={[
                "0.7rem",
                "0.7rem",
                "0.7rem",
                "0.9rem",
                "0.9rem",
                "0.9rem",
              ]}
            >
              {showUser?.followers?.length}
            </Box>
            <Box
              fontSize={[
                "0.6rem",
                "0.6rem",
                "0.6rem",
                "0.8rem",
                "0.8rem",
                "0.8rem",
              ]}
              color="grey"
            >
              Followers
            </Box>
          </Box>

          {/* Following */}
          <Box
            display="flex"
            flexDir="column"
            gap="0"
            alignItems="center"
            cursor="pointer"
            onClick={() => setIsFollowerSelected(false)}
          >
            <Box
              fontWeight="bold"
              fontSize={[
                "0.7rem",
                "0.7rem",
                "0.7rem",
                "0.9rem",
                "0.9rem",
                "0.9rem",
              ]}
            >
              {showUser?.followings?.length}
            </Box>
            <Box
              fontSize={[
                "0.6rem",
                "0.6rem",
                "0.6rem",
                "0.8rem",
                "0.8rem",
                "0.8rem",
              ]}
              color="grey"
            >
              Following
            </Box>
          </Box>
        </Box>

        {/* Follow Button */}
        <Box
          display="flex"
          flexDir="column"
          justifyContent="center"
          alignItems="center"
          width="100%"
          gap="0.5rem"
        >
          {showUser?._id !== user?._id ? (
            isFollowed ? (
              <Button
                variant="solid"
                colorScheme="twitter"
                width="100%"
                size="sm"
                onClick={() => {
                  if (showUser._id !== user._id) {
                    setIsFollowed(false);
                    const followdata = {
                      token: user.token,
                      id: showUser._id,
                    };
                    dispatch(followUnfollowAsync(followdata)).then((res) => {
                      console.log(res);
                      if (res.status) {
                        setIsFollowed(!isFollowed);
                        dispatch(setFollowingAsync(followdata.token));
                      } else {
                        setIsFollowed(isFollowed);
                        toast.error(res.errorMessage, ToastOption);
                      }
                    });
                  }
                }}
              >
                Following
              </Button>
            ) : (
              <Button
                variant="solid"
                colorScheme="twitter"
                width="100%"
                size="sm"
                onClick={() => {
                  if (showUser._id !== user._id) {
                    setIsFollowed(true);
                    const followdata = {
                      token: user.token,
                      id: showUser._id,
                    };
                    dispatch(followUnfollowAsync(followdata)).then((res) => {
                      if (res.status) {
                        setIsFollowed(!isFollowed);
                        dispatch(setFollowingAsync(followdata.token));
                      } else {
                        setIsFollowed(isFollowed);
                        toast.error(res.errorMessage, ToastOption);
                      }
                    });
                  }
                }}
              >
                Follow
              </Button>
            )
          ) : (
            <Button
              colorScheme="gray"
              size="xs"
              width="100%"
              onClick={() => navigate("/editProfile")}
            >
              Edit Profile
            </Button>
          )}
        </Box>

        {/* Name and Bio Box */}
        <Box
          width="100%"
          display="flex"
          flexDir="column"
          alignItems="flex-start"
          px="0.5rem"
          gap="0.3rem"
        >
          {/* Name Box */}
          <Box
            fontSize={[
              "0.7rem",
              "0.7rem",
              "0.7rem",
              "0.8rem",
              "0.8rem",
              "0.8rem",
            ]}
            fontWeight="semibold"
          >
            {isUserAuthenticated ? showUser?.name : ""}
          </Box>
          <Box
            fontSize={[
              "0.6rem",
              "0.6rem",
              "0.6rem",
              "0.7rem",
              "0.7rem",
              "0.7rem",
            ]}
          >
            {isUserAuthenticated ? showUser?.bio : "0"}
          </Box>
        </Box>

        {/* All Followers and Following List and LogOut */}
        <Box
          width="100%"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDir="column"
          gap="1rem"
        >
          {/* Followes */}
          <Box
            width="95%"
            p="10px"
            display="flex"
            height={["8rem", "8rem", "8rem", "14rem", "14rem", "14rem"]}
            flexDir="column"
            gap="0.8rem"
            overflowY="scroll"
            alignItems="center"
            border="2px solid lightgrey"
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
            {isFollowerSelected
              ? follower.map((item, i) => {
                  return (
                    <Box
                      width="100%"
                      height="fit-content"
                      key={i}
                      onClick={() => {
                        handleUserClick(item);
                      }}
                    >
                      <FollowingUser
                        userdata={item}
                        wantToNavigate={true}
                        border={true}
                      />
                    </Box>
                  );
                })
              : following.map((item, i) => {
                  return (
                    <Box
                      width="100%"
                      height="fit-content"
                      key={i}
                      onClick={() => {
                        handleUserClick(item);
                      }}
                    >
                      <FollowingUser
                        key={i}
                        userdata={item}
                        wantToNavigate={true}
                        border={true}
                      />
                    </Box>
                  );
                })}
          </Box>

          <Box>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              cursor="pointer"
              flexDir="row"
              fontSize="0.8rem"
              _hover={{ fontSize: "0.9rem" }}
              transition="200ms"
              onClick={logoutHandler}
              py="1.5px"
              px="2px"
              borderRadius="5px"
              fontWeight="medium"
              gap="3px"
              color="red.500"
            >
              <BsPower size="1rem" />
              <Text width="-moz-fit-content">LogOut</Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Profile;
