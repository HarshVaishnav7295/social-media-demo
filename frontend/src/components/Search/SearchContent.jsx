import React, { useEffect, useState } from "react";
import { BiGhost } from "react-icons/bi";
import { Box, Text, Image } from "@chakra-ui/react";

const SearchContent = ({ allUser, searchValue }) => {
  const [showUser, setShowUser] = useState([]);
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
  return (
    <Box
      w={["80%", "80%", "80%", "50%", "50%", " 50%"]}
      margin="auto"
      border="1px solid black"
      h="10rem"
    >
      {showUser.map((user) => {
        return <Box key={user._id}>{user.name}</Box>;
      })}
    </Box>
  );
};

export default SearchContent;
