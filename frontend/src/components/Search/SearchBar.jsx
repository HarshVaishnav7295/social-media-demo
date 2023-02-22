import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import React from "react";

const SearchBar = ({ searchValue, setSearchValue }) => {
  return (
    <Box display="flex" justifyContent="center">
      <FormControl mt="2rem" width="70%">
        {/* <FormLabel>Email address</FormLabel> */}
        <Input
          type="email"
          placeholder="Search here ..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
      </FormControl>
      <br />
    </Box>
  );
};

export default SearchBar;
