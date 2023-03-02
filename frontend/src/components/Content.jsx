import { Box, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeedAsync, getPersonalPostAsync } from "../Redux/postAction";
import { setFollowerAsync, setFollowingAsync } from "../Redux/userAction";
import Loading from "./Loading";
import PostContainer from "./PostContainer";

const Content = () => {
  const dispatch = useDispatch();
  const allPosts = useSelector((state) => state.post.allPosts);
  const [isLoading, setIsLoading] = useState(true);

  const isUserAuthenticated = useSelector(
    (state) => state.user.isUserAuthenticated
  );

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (isUserAuthenticated && user) {
      setIsLoading(true);
      dispatch(getPersonalPostAsync(user.token));
      dispatch(getFeedAsync(user.token));
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, user]);

  useEffect(() => {
    if (isUserAuthenticated) {
      setIsLoading(true);

      dispatch(setFollowingAsync(user.token));
      dispatch(setFollowerAsync(user.token));
      setIsLoading(false);
    }
  }, [dispatch, isUserAuthenticated, user]);

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
        {isLoading && isUserAuthenticated ? (
          <Loading />
        ) : allPosts.length !== 0 && isUserAuthenticated ? (
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
          <Text>Posts not Found</Text>
        )}
      </Box>
    </>
  );
};

export default Content;
