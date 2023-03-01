import React from "react";
import { Box, Button } from "@chakra-ui/react";

const SubmitBtn = (props) => {
  return (
    <Box display="flex" gap="1rem" my="1rem" mx="2rem">
      {/* profile */}
      <Box flex="20%"></Box>
      {/* textarea */}
      <Box flex="80%" float="left">
        <Button
          colorScheme="telegram"
          variant="solid"
          marginLeft="15px"
          isDisabled={props.disabled}
          onClick={props.onClick}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default SubmitBtn;
