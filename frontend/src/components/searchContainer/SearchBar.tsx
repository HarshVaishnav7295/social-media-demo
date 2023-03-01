import { Box, FormControl, Input } from "@chakra-ui/react";
import React from "react";
interface ISearchBarProps {
  searchValue: string;
  setSearchValue: (arg0: string) => void;
}
const SearchBar = ({ searchValue, setSearchValue }: ISearchBarProps) => {
  return (
    <Box display="flex" justifyContent="center" bg="white" zIndex="1">
      <FormControl pt="2rem" width="50%" position="fixed" bg="white">
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
