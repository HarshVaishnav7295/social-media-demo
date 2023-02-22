/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Img, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { FcLike } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlinePlus } from "react-icons/ai";
import { BsCheck2 } from "react-icons/bs";
import { userAction } from "../Redux/userReducer";
import {
  findUserByIdAsync,
  followUnfollowAsync,
  setFollowingAsync,
} from "../Redux/userAction";
import { toast, ToastContainer } from "react-toastify";
import { ToastOption } from "./Register";
import { likeUnLikeAsync } from "../Redux/postAction";

const PostContainer = ({ image, description, post, user }) => {
  const [postUser, setPostUser] = useState({});
  const dispatch = useDispatch();
  const [isFollowed, setIsFollowed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likedCount, setLikedCount] = useState(post?.likedBy.length);
  const isUserAuthenticated = useSelector(
    (state) => state.user.isUserAuthenticated
  );

  useEffect(() => {
    const data = {
      id: post.createdBy,
      token: user.token,
    };
    dispatch(findUserByIdAsync(data)).then((postUser) => {
      setPostUser(postUser);
    });
  }, []);

  const userProfileHandler = () => {
    dispatch(userAction.changeProfileVisiblity());
    dispatch(userAction.setDisplayedUser(postUser));
    console.log("postUser", postUser);
  };

  useEffect(() => {
    if (isUserAuthenticated) {
      user.followings.map((followingId) => {
        if (followingId._id === post.createdBy) {
          setIsFollowed(true);
        }
      });

      post.likedBy.map((likedId) => {
        if (user._id === likedId._id) {
          setIsLiked(true);
        }
      });
    }
  }, [post, user]);

  const likeDisLikeHandler = () => {
    const data = {
      id: post._id,
      token: user.token,
    };
    dispatch(likeUnLikeAsync(data)).then((res) => {
      if (res === "Like successful") {
        setIsLiked(true);
        setLikedCount(likedCount + 1);
      } else if (res === "Unlike successful") {
        setIsLiked(false);
        setLikedCount(likedCount - 1);
      } else {
        setIsLiked(false);
        setLikedCount(post?.likedBy.length);
      }
    });
  };

  return (
    <>
      {/* Main Post container */}
      <ToastContainer />
      <Box
        // width={["30rem", "30rem", "30rem", "40rem", "40rem", "40rem"]}
        width={["80%", "80%", "80%", "70%", "70%", "70%"]}
        height="35rem"
        display="flex"
        alignItems="center"
        justifyContent="space-evenly"
        boxShadow="0px 0px 7px -2px grey"
        flexDir="column"
        borderRadius="5px"
        px="5px"
        pt="5px"
        mb={["0.2rem", "0.2rem", "0.2rem", "1.5rem", "1.5rem", "1.5rem"]}
      >
        {/* Post's User Info */}
        <Box
          display="flex"
          flexDir="row"
          width="100%"
          height="5%"
          justifyContent="space-between"
          alignItems="center"
          px="2rem"
        >
          {/* Avatar */}
          <Box
            width="fit-content"
            display="flex"
            flexDir="row"
            backgroundColor="transparent"
            alignItems="center"
            gap="0.2rem"
            cursor="pointer"
            onClick={() => userProfileHandler()}
          >
            <Img
              src={
                postUser?.avatar
                  ? postUser?.avatar
                  : "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
              }
              alt="user name"
              width="2.5rem"
              height="2.5rem"
              borderRadius="50%"
              p="0px"
            />
            <Text
              width="fit-content"
              fontSize={["0.8rem", "0.8rem", "0.8rem", "1rem", "1rem", "1rem"]}
            >
              {postUser?.name}
            </Text>
          </Box>
          {isFollowed && isUserAuthenticated ? (
            // UnFollow component
            <Box
              display="flex"
              flexDir="row"
              alignItems="center"
              fontSize={["0.8rem", "0.8rem", "0.8rem", "1rem", "1rem", "1rem"]}
              cursor="pointer"
              onClick={() => {
                if (postUser._id !== user._id) {
                  setIsFollowed(false);
                  const data = {
                    token: user.token,
                    id: post.createdBy,
                  };
                  dispatch(followUnfollowAsync(data)).then((res) => {
                    console.log(res);
                    if (res.status) {
                      setIsFollowed(!isFollowed);
                      dispatch(setFollowingAsync(user?.token));
                    } else {
                      setIsFollowed(isFollowed);
                      toast.error(res.errorMessage, ToastOption);
                    }
                  });
                }
              }}
              color={
                isUserAuthenticated && postUser._id !== user._id
                  ? "black"
                  : "lightgrey"
              }
            >
              <BsCheck2 />
              <Text width="fit-content">Followed</Text>
            </Box>
          ) : (
            // Follow Component
            <Box
              display="flex"
              flexDir="row"
              alignItems="center"
              fontSize={["0.8rem", "0.8rem", "0.8rem", "1rem", "1rem", "1rem"]}
              cursor="pointer"
              onClick={() => {
                if (postUser._id !== user._id) {
                  setIsFollowed(true);
                  const data = {
                    token: user.token,
                    id: post.createdBy,
                  };
                  dispatch(followUnfollowAsync(data)).then((res) => {
                    if (res.status) {
                      setIsFollowed(!isFollowed);
                      dispatch(setFollowingAsync(user?.token));
                    } else {
                      setIsFollowed(isFollowed);
                      toast.error(res.errorMessage, ToastOption);
                    }
                  });
                }
              }}
              color={
                isUserAuthenticated && postUser._id !== user._id
                  ? "black"
                  : "grey"
              }
            >
              <AiOutlinePlus />
              <Text width="fit-content">Follow</Text>
            </Box>
          )}
        </Box>
        {/* Post image Box */}
        <Box
          width="100%"
          minHeight="70%"
          maxHeight="70%"
          display="flex"
          justifyContent="center"
          px="1.5rem"
          py="1rem"
        >
          <Img
            src={image}
            // eslint-disable-next-line no-useless-concat
            alt={postUser.name + "'s" + " post"}
            width="100%"
            height="100%"
            borderRadius="8px"
          />
        </Box>
        {/* Post Description Box */}
        <Box
          width="100%"
          minHeight="10%"
          maxHeight="15%"
          display="flex"
          justifyContent="flex-start"
          flexDirection="column"
          overflowY="scroll"
          css={{
            "&::-webkit-scrollbar": {
              width: "2px",
            },
            "&::-webkit-scrollbar-track": {
              width: "2px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "lightgrey",
              borderRadius: "24px",
            },
          }}
        >
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
            height="-webkit-fit-content"
          >
            {postUser?.name}
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
            height="-webkit-fit-content"
          >
            {description}
          </Box>
        </Box>
        {/* Like Box */}
        {isUserAuthenticated && (
          <Box
            cursor="pointer"
            width="fit-content"
            alignSelf="start"
            display="flex"
            height="5%"
            justifyContent="flex-start"
            flexDir="row"
            gap="0.2rem"
            onClick={() => likeDisLikeHandler()}
          >
            {isLiked ? (
              <FcLike size="1.3rem" />
            ) : (
              <AiOutlineHeart size="1.3rem" />
            )}
            {/* Total likes */}
            <Box
              width="fit-content"
              fontSize={["0.9rem", "0.9rem", "0.9rem", "1rem", "1rem", "1rem"]}
            >
              {likedCount}
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default PostContainer;
