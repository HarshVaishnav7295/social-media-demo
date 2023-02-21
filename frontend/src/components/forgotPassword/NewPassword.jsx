import React, { useState } from "react";
import {
  Box,
  Text,
  FormControl,
  Input,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Button,
  useToast,
} from "@chakra-ui/react";
import { IoIosMailUnread } from "react-icons/io";
import { IoIosArrowRoundBack } from "react-icons/io";

function NewPasswordInput({ resetConform }) {
  const toast = useToast();
  const [OTP, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [isError, setIsError] = useState(false);

  const validateInput =
    OTP === "" ||
    password === "" ||
    confPassword === "" ||
    password.trim() !== confPassword.trim() ||
    password.trim().length < 6;

  const handleOTPChange = (e) => {
    setOtp(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfChange = (e) => {
    setConfPassword(e.target.value);
  };
  function handleSubmit(e) {
    console.log("called ");
    e.preventDefault();
    if (validateInput) {
      if(OTP === ""){
        toast({
            title: "OTP is required",
            description: "",
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "top",
          });
      }
      if(password === "" || confPassword === "" || password !== confPassword){
        toast({
            title: "password and Conform password is must and must be same !",
            description: "",
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "top",
          });
      }
      setIsError(true);
      return;
    }
    console.log(OTP, password, confPassword);
    // reset logic here
    resetConform();
    setOtp("");
    setPassword("");
    setConfPassword("");
    setIsError(false);
  }
  return (
    <FormControl isInvalid={isError}>
      <FormLabel mt=".3rem" fontSize=".9rem">
        OTP
      </FormLabel>
      <Input
        type="text"
        value={OTP}
        onChange={handleOTPChange}
        placeholder="Enter OTP ..."
        isInvalid={OTP === "" && isError}
      />
      {OTP === "" ? <FormErrorMessage>* OTP is must !</FormErrorMessage> : null}

      {/* NewPassword */}
      <FormLabel mt=".3rem" fontSize=".9rem">
        New Password
      </FormLabel>
      <Input
        type="text"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Enter New Password ..."
        isInvalid={password === "" && isError}
      />
      {password !== "" ? null : ( // </FormHelperText> //   Enter the email you'd like to receive the newsletter on. // <FormHelperText>
        <FormErrorMessage>* Conform Password is must</FormErrorMessage>
      )}

      {/* confPassword */}
      <FormLabel mt=".3rem" fontSize=".9rem">
        Conform Password
      </FormLabel>
      <Input
        type="email"
        value={confPassword}
        onChange={handleConfChange}
        placeholder="Enter password ..."
        isInvalid={confPassword === "" && isError}
      />
      {confPassword !== "" ? null : ( // </FormHelperText> //   Enter the email you'd like to receive the newsletter on. // <FormHelperText>
        <FormErrorMessage>* Conform Password is must</FormErrorMessage>
      )}
      <Button
        w="100%"
        bg="#a855f7"
        color="white"
        mt=".5rem"
        onClick={handleSubmit}
        isDisabled={validateInput}
      >
        submit
      </Button>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap=".3rem"
        mt=".7rem"
      >
        <IoIosArrowRoundBack />
        <Text fontSize=".7rem" color="gary" fontWeight="600">
          Back to Login
        </Text>
      </Box>
    </FormControl>
  );
}

const NewPassword = ({ resetConform }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      px=".5rem"
      gap=".3rem"
      py=".5rem"
    >
      <IoIosMailUnread width="100px" height="100px" />
      <Text fontSize="1.3rem" fontWeight="600">
        Change Password
      </Text>
      <Text textAlign='center' as="p" color="gray" fontSize=".8rem" fontWeight="semibold">
        we sent a password reset OTP to user@gmail.com
      </Text>
      <NewPasswordInput resetConform={resetConform} />
    </Box>
  );
};

export default NewPassword;
