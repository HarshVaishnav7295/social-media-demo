import { Box, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { getFeedAsync, getPersonalPostAsync } from "../Redux/postAction";
import { useAppDispatch, useAppSelector } from "../Redux/store";
import { setFollowerAsync, setFollowingAsync } from "../Redux/userAction";
import PostContainer from "./PostContainer";

const Content = () => {
  const dispatch = useAppDispatch();
  const allPosts = useAppSelector((state) => state.post.allPosts);

  const isUserAuthenticated = useAppSelector(
    (state) => state.user.isUserAuthenticated
  );

  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    if (isUserAuthenticated && user) {
      dispatch(getPersonalPostAsync(user.token));
      dispatch(getFeedAsync(user.token));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, user]);

  useEffect(() => {
    if (isUserAuthenticated && user) {
      dispatch(setFollowingAsync(user.token));
      dispatch(setFollowerAsync(user.token));
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
        {isUserAuthenticated &&
        allPosts?.length !== 0 &&
        isUserAuthenticated ? (
          allPosts.map((post) => {
            return <PostContainer key={post._id} post={post} user={user} />;
          })
        ) : (
          <Text>Posts not Found</Text>
        )}
      </Box>
    </>
  );
};

export default Content;
