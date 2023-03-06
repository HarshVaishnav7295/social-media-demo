import React, { useState } from "react";
import {
  Box,
  Text,
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
  Button,
  useToast,
} from "@chakra-ui/react";
import { BsFillKeyFill } from "react-icons/bs";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

interface IEmailInput {
  onReset:React.Dispatch<React.SetStateAction<boolean>>
}

function EmailInput(props: IEmailInput) {
  const navigate = useNavigate()
  const toast = useToast();
  const [input, setInput] = useState("");
  const [isError, setIsError] = useState(false);

  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  function handleSubmit(e:React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    if (input === "") {
      toast({
        title: "Failed",
        description: "Enter a valid Email !",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setIsError(true);
      return;
    }
    toast({
      title: "OTP Sent",
      description: "Check your Email we sent an otp.",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
    });
    props.onReset(true);

    // email here
    setInput("");
    setIsError(false);
  }
  return (
    <FormControl isInvalid={isError}>
      <FormLabel fontSize=".9rem">Email</FormLabel>
      <Input
        type="email"
        value={input}
        onChange={handleInputChange}
        placeholder="Enter email ..."
      />
      {!isError ? null : ( // </FormHelperText> //   Enter the email you'd like to receive the newsletter on. // <FormHelperText>
        <FormErrorMessage>Email is required.</FormErrorMessage>
      )}
      <Button
        w="100%"
        bg="#a855f7"
        color="white"
        mt=".5rem"
        onClick={handleSubmit}
      >
        Reset Password
      </Button>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap=".3rem"
        mt=".7rem"
      >
        <IoIosArrowRoundBack />
        <Text fontSize=".7rem" color="gary" fontWeight="600" onClick={()=>navigate("/login")} cursor="pointer">
          Back to Login
        </Text>
      </Box>
    </FormControl>
  );
}

interface IEmail {
  onReset: React.Dispatch<React.SetStateAction<boolean>>
}

const Email = ({ onReset }: IEmail) => {
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
      <BsFillKeyFill width="100px" height="100px" />
      <Text fontSize="1.3rem" fontWeight="600">
        Forgot Password
      </Text>
      <Text
        textAlign="center"
        as="p"
        color="gray"
        fontSize=".8rem"
        fontWeight="semibold"
      >
        No worries we'll send you a reset mail
      </Text>

      <EmailInput onReset={onReset} />
    </Box>
  );
};

export default Email;
