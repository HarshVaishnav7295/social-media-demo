import React, { useState,useEffect } from "react";
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
import { IoIosMailUnread } from "react-icons/io";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function NewPasswordInput({ resetConform }: { resetConform: () => void }) {
  const navigate = useNavigate()
  const toast = useToast();
  const [OTP, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [isError, setIsError] = useState(false);
  // UseStates for timer Starts
 
  const [minutes, setMinutes] = useState(2);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  const resendOTP = () => {
    setMinutes(2);
    setSeconds(0);
    toast({
      title: "OTP Sent",
      description: "Check your Email we sent an otp.",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
    });
  };


  
  // UseStates for timer ends
  

  const validateInput =
    OTP === "" ||
    password === "" ||
    confPassword === "" ||
    password.trim() !== confPassword.trim() ||
    password.trim().length < 6;

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handlePasswordChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setConfPassword(e.target.value);
  };
  function handleSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    if (validateInput) {
      if (OTP === "") {
        toast({
          title: "OTP is required",
          description: "",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      }
      if (password === "" || confPassword === "" || password !== confPassword) {
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
    // reset logic here
    resetConform();
    setOtp("");
    setPassword("");
    setConfPassword("");
    setIsError(false);
  }
  return (
    <FormControl isInvalid={isError}>
      <FormLabel mt=".3rem" fontSize=".9rem" display="flex" flexDir="row" justifyContent="space-between">
        <Text>OTP</Text>
        {
          minutes ===0 && seconds ===0 ? <Text cursor="pointer" color="purple" onClick={resendOTP}>Resend OTP</Text>:<Text>{
            minutes < 10 ? `0${minutes}` : minutes}:
              {seconds < 10 ? `0${seconds}` : seconds
        }</Text>
}
        
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
        <Text fontSize=".7rem" color="gary" fontWeight="600" onClick={()=>navigate("/login")} cursor="pointer">
          Back to Login
        </Text>
      </Box>
    </FormControl>
  );
}

const NewPassword = ({ resetConform }: {resetConform: ()=>void}) => {
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
      <Text
        textAlign="center"
        as="p"
        color="gray"
        fontSize=".8rem"
        fontWeight="semibold"
      >
        we sent a password reset OTP to user@gmail.com
      </Text>
      <NewPasswordInput resetConform={resetConform} />
    </Box>
  );
};

export default NewPassword;
