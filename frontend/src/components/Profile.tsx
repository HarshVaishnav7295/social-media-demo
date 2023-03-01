import { Box, Button, Img, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import FollowingUser from "./FollowingUser";
import { BsPower } from "react-icons/bs";
import { userAction } from "../Redux/userReducer";
import { useNavigate } from "react-router-dom";
import {
  followUnfollowAsync,
  setFollowerAsync,
  setFollowingAsync,
} from "../Redux/userAction";
import { ToastOption } from "./Register";
import { toast } from "react-toastify";
import { getUserPostAsync } from "../Redux/postAction";
import { postAction } from "../Redux/postReducer";
import { IFollow, IPost, IUser } from "../types/reduxTypes";
import { useAppDispatch, useAppSelector } from "../Redux/store";

export interface IProfileProps {
  showUser: IUser | undefined;
}

const Profile = ({ showUser }: IProfileProps) => {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const [showUserPost, setShowUserPost] = useState<IPost[]>([]);

  const isUserAuthenticated: boolean = useAppSelector(
    (state) => state.user.isUserAuthenticated
  );

  const follower = useAppSelector((state) => state.user.follower);
  const following = useAppSelector((state) => state.user.following);

  const [isFollowerSelected, setIsFollowerSelected] = useState<boolean>(true);

  useEffect(() => {
    if (isUserAuthenticated && showUser && user) {
      // eslint-disable-next-line array-callback-return
      user?.followings.map((followingId) => {
        if (followingId._id.toString() === showUser?._id) {
          setIsFollowed(true);
        }
      });
      if (user) {
        const data = {
          token: user.token,
          _id: showUser._id,
        };
        dispatch(getUserPostAsync(data)).then((res) => {
          if (res?.status) {
            setShowUserPost(res?.posts);
          } else {
            setShowUserPost([]);
          }
        });
      }
    }
  }, [user, showUser, isUserAuthenticated, dispatch]);

  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(userAction.deleteUserFromStorage());
    navigate("/");
  };
  const handleUserClick = (followUser: IUser) => {
    dispatch(userAction.setDisplayedUser(followUser));
    if (user) {
      dispatch(setFollowingAsync(user.token));
      dispatch(setFollowerAsync(user.token));
    }
  };

  return (
    <>
      <Box
        width="100%"
        height="100%"
        display="flex"
        flexDir="column"
        alignItems="center"
        // bgGradient="linear(to-b, #797EF6,#b5b7fa)"
        backgroundColor="darkgray"
        borderBottomRadius="10px"
        borderTopRadius="5px"
        boxShadow="0px 0px 10px -3px grey"
        // backgroundColor="#1AA7EC"
        justifyContent={[
          "space-evenly",
          "space-evenly",
          "space-evenly",
          "space-evenly",
          "space-evenly",
          "space-evenly",
        ]}
      >
        {/* Profile Pic Box */}
        <Box
          border="2px solid #636363"
          display="flex"
          width={["3.5rem", "3.5rem", "3.5rem", "4.5rem", "4.5rem", "4.5rem"]}
          height={["3.5rem", "3.5rem", "3.5rem", "4.5rem", "4.5rem", "4.5rem"]}
          justifyContent="center"
          alignItems="center"
          // p="3px"
          borderRadius="50%"
          overflow="hidden"
          cursor="pointer"
          color="white"
        >
          <Img
            src={
              isUserAuthenticated && showUser?.avatar
                ? showUser.avatar
                : "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
            }
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
          color="white"
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
            onClick={() => {
              dispatch(postAction.setAllPost(showUserPost));
              dispatch(userAction.changeProfileVisiblity());
            }}
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
              {showUserPost?.length}
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
              color="white"
              fontWeight="semibold"
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
            onClick={() => {
              setIsFollowerSelected(true);
            }}
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
              color="white"
              fontWeight="semibold"
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
            onClick={() => {
              setIsFollowerSelected(false);
            }}
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
              color="white"
              fontWeight="semibold"
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
          width="93%"
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
                  if (showUser?._id !== user?._id) {
                    setIsFollowed(false);
                    if (user && showUser) {
                      const followdata = {
                        token: user.token,
                        id: showUser._id,
                      };
                      dispatch(followUnfollowAsync(followdata)).then(
                        (
                          res:
                            | {
                                status: boolean;
                                errorMessage: string;
                                followings: IFollow[];
                              }
                            | undefined
                        ) => {
                          if (res?.status) {
                            setIsFollowed(!isFollowed);
                            dispatch(setFollowingAsync(followdata.token));
                          } else {
                            setIsFollowed(isFollowed);
                            toast.error(res?.errorMessage, ToastOption);
                          }
                        }
                      );
                    }
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
                  if (showUser?._id !== user?._id) {
                    setIsFollowed(true);
                    if (user && showUser) {
                      const followdata = {
                        token: user.token,
                        id: showUser._id,
                      };
                      dispatch(followUnfollowAsync(followdata)).then(
                        (
                          res:
                            | {
                                status: boolean;
                                errorMessage: string;
                                followings: IFollow[];
                              }
                            | undefined
                        ) => {
                          if (res?.status) {
                            setIsFollowed(!isFollowed);
                            dispatch(setFollowingAsync(followdata.token));
                          } else {
                            setIsFollowed(isFollowed);
                            toast.error(res?.errorMessage, ToastOption);
                          }
                        }
                      );
                    }
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
              onClick={() => {
                navigate("/editProfile");
                dispatch(userAction.changeProfileVisiblity());
              }}
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
          pl="1rem"
        >
          {/* Name Box */}
          <Box
            fontSize={[
              "0.8rem",
              "0.8rem",
              "0.8rem",
              "0.9rem",
              "0.9rem",
              "0.9rem",
            ]}
            fontWeight="semibold"
            color="white"
          >
            {isUserAuthenticated ? showUser?.name : ""}
          </Box>
          <Box
            fontSize={[
              "0.7rem",
              "0.7rem",
              "0.7rem",
              "0.8rem",
              "0.8rem",
              "0.8rem",
            ]}
            color="white"
            mt="-5px"
          >
            {isUserAuthenticated ? showUser?.bio : ""}
          </Box>
        </Box>

        {/* All Followers and Following List and LogOut */}
        <Box
          width="100%"
          display="flex"
          // justifyContent="space-between"
          alignItems="center"
          flexDir="column"
          // gap="1rem"
          height="50%"
        >
          {/* Box for change Follower and followings */}
          <Box
            display="flex"
            flexDir="row"
            justifyContent="space-evenly"
            width="95%"
            position="relative"
            color="white"
          >
            <Box
              width="50%"
              px="0.5rem"
              py="0.2rem"
              cursor="pointer"
              textAlign="center"
              // border="2px solid lightgrey"
              // borderRight="1px solid lightgray"
              fontWeight={isFollowerSelected ? "medium" : "normal"}
              fontSize={["0.7rem", "0.8rem", "0.9rem", "1rem", "1rem", "1rem"]}
              borderBottomColor={!isFollowerSelected ? "" : "transparent"}
              onClick={() => setIsFollowerSelected(true)}
            >
              Followers
            </Box>
            <Box
              width="50%"
              px="0.5rem"
              py="0.2rem"
              cursor="pointer"
              textAlign="center"
              fontWeight={isFollowerSelected ? "normal" : "medium"}
              fontSize={["0.7rem", "0.8rem", "0.9rem", "1rem", "1rem", "1rem"]}
              borderBottomColor={!isFollowerSelected ? "transparent" : ""}
              onClick={() => setIsFollowerSelected(false)}
            >
              Followings
            </Box>
          </Box>
          {/* Followes */}
          <Box
            width="95%"
            p="10px"
            display="flex"
            height="100%"
            flexDir="column"
            gap="0.8rem"
            overflowY="scroll"
            alignItems="center"
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
                      boxShadow="0px 1px 7px -2px grey"
                      key={i.toString()}
                      onClick={() => {
                        handleUserClick(item);
                      }}
                    >
                      <FollowingUser
                        userdata={item}
                        wantToNavigate={true}
                        showChatIcon={true}
                      />
                    </Box>
                  );
                })
              : following.map((item, i) => {
                  return (
                    <Box
                      width="100%"
                      boxShadow="0px 1px 7px -2px grey"
                      height="fit-content"
                      key={i.toString()}
                      onClick={() => {
                        handleUserClick(item);
                      }}
                    >
                      <FollowingUser
                        userdata={item}
                        wantToNavigate={true}
                        showChatIcon={true}
                      />
                    </Box>
                  );
                })}
          </Box>

          <Box>
            {showUser?._id === user?._id && (
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
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Profile;