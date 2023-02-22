import { Box, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeedAsync, getPersonalPostAsync } from "../Redux/postAction";
import { setFollowerAsync, setFollowingAsync } from "../Redux/userAction";
import PostContainer from "./PostContainer";

const Content = () => {
  const dispatch = useDispatch();
  const allPosts = useSelector((state) => state.post.allPosts);

  const isUserAuthenticated = useSelector(
    (state) => state.user.isUserAuthenticated
  );

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (isUserAuthenticated && user) {
      dispatch(getPersonalPostAsync(user.token));
      dispatch(getFeedAsync(user.token));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, user]);

  useEffect(() => {
    if (isUserAuthenticated) {
      dispatch(setFollowingAsync(user.token));
      dispatch(setFollowerAsync(user.token));
    }
  }, [dispatch, isUserAuthenticated, user.token]);

  return (
    <>
      <Box
        width="100%"
        maxHeight="90%"
        // flexWrap="wrap"
        display="flex"
        flexDir="column"
        alignItems="center"
        // justifyContent="center"
        gap={["1rem", "1rem", "1rem", "3rem", "3rem", "3rem"]}
      >
        {isUserAuthenticated && allPosts.length > 0 ? (
          allPosts.map((post) => {
            return (
              <PostContainer
                key={post._id}
                post={post}
                image={post.image}
                user={user}
                description={post.description}
              />
            );
          })
        ) : (
          <Text>Post not Found</Text>
        )}
      </Box>
    </>
  );
};

export default Content;
