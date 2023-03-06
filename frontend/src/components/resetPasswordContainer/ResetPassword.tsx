import { Box } from "@chakra-ui/react";
import React, { useState } from "react";
import NewPassword from "./NewPassword";
import Email from "./Email";

const ResetPassword = () => {
  // const [state, setState] = useState('email') // OTP and reset
  const [isEmailEntered, setIsEmailEntered] = useState<boolean>(false);
  return (
    <Box
      width={['90%', '90%', '35%','24%','24%','24%']}
      border="1px solid transparent"
      boxShadow="md"
      borderRadius=".5rem"
      margin="auto"
      my="10rem"
    >
      {isEmailEntered ? (
        <NewPassword resetConform={() => console.log("resetConform called")} />
      ) : (
        <Email onReset={setIsEmailEntered} />
      )}
    </Box>
  );
};

export default ResetPassword;
