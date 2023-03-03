import { Box, Button, Text } from "@chakra-ui/react";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userAction } from "../Redux/userReducer";
import useInput from "../Hook/UserInput";

import { toast, ToastContainer } from "react-toastify";
import { CustomInputContainer, ToastOption } from "./Register";
import "react-toastify/dist/ReactToastify.css";
import { LoginAPI } from "../utils/ApiRoutes";
import { BsDot } from "react-icons/bs";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Submitted = async () => {
    const localUserData = {
      email: emailInputValue,
      password: passwordInputValue,
    };
    if (!localUserData.email || !localUserData.password) {
      toast.error("Please Provide required field.", ToastOption);
    }
    const response = await fetch(LoginAPI, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(localUserData),
    });
    if (response.status === 500) {
      let error = await response.json();
      toast.error(error.errorMessage, ToastOption);
    } else if (response.status === 400) {
      let error = await response.json();
      toast.error(error.errorMessage, ToastOption);
    } else if (response.status === 403) {
      let error = await response.json();
      toast.error(error.errorMessage, ToastOption);
    } else if (response.status === 200) {
      let data = await response.json();
      toast.info("Login Successful", ToastOption);
      dispatch(userAction.addUserToStorage(data.user));
      navigate("/");
    }
  };

  const {
    value: emailInputValue,
    hasError: emailInputHasError,
    handleEnteredValueChange: handleEmailChnage,
    handleBlur: handleEmailBlur,
    // reset: emailReset,
  } = useInput((value) => value.includes("@"));
  const {
    value: passwordInputValue,
    hasError: passwordInputHasError,
    handleEnteredValueChange: handlePasswordChnage,
    handleBlur: handlePasswordBlur,
    // reset: passwordReset,
  } = useInput((value) => value.trim().length >= 6 && value.trim() !== "");

  function handleSubmit() {
    const isFormInvalid =
      emailInputHasError ||
      passwordInputHasError ||
      !emailInputValue ||
      !passwordInputValue;

    if (isFormInvalid) {
      return;
    } else {
      Submitted();
      //emailReset();
    }
  }

  return (
    <>
      <ToastContainer />
      <Box
        width="100wvw"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          display="flex"
          flexDir="column"
          alignItems="center"
          boxShadow="1px 1px 5px 1px lightgrey"
          borderRadius="5px"
          width={["90%", "90%", "40%", "40%", "30%", "30%"]}
          py="10px"
          gap="0.8rem"
        >
          {/* Title Area */}
          <Box margin="auto">
            <Text fontSize="1.3rem" fontWeight="semibold" pb="2.5" width="100%">
              Login with an account
            </Text>
          </Box>

          {/* Form Area box */}
          <Box
            display="flex"
            flexDir="column"
            justifyContent="center"
            alignItems="center"
            width="100%"
            gap="0.6rem"
          >
            {/* Email Box */}
            <CustomInputContainer
              name="Email"
              type="email"
              placeHolder="Enter Email here."
              inputHasError={emailInputHasError}
              inputValue={emailInputValue}
              handleChnage={handleEmailChnage}
              handleBlur={handleEmailBlur}
            />

            {/* Password Field */}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDir="column"
              width="91%"
            >
              {/* Password Box */}
              <CustomInputContainer
                name="Password"
                type="password"
                placeHolder="Enter Password here."
                inputHasError={passwordInputHasError}
                inputValue={passwordInputValue}
                handleChnage={handlePasswordChnage}
                handleBlur={handlePasswordBlur}
              />
            </Box>

            {/* redirect Link Box */}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDir="column"
              gap="1"
            >
              <Box fontSize="0.8rem" display="flex" gap="0.5">
                <Text>Don't have an account ?</Text>
                <Text
                  cursor="pointer"
                  fontWeight="semibold"
                  color="blue.600"
                  onClick={() => navigate("/register")}
                >
                  Signup here
                </Text>
              </Box>
            </Box>
            {/* Login Button Box */}
            <Box
              width="100%"
              display="flex"
              flexDir="column"
              alignItems="center"
            >
              <Button
                variant="solid"
                colorScheme="twitter"
                width="45%"
                color="white"
                size="sm"
                onClick={handleSubmit}
              >
                LogIn
              </Button>
            </Box>
            {/* Forgot password Container */}
            <Box
              width="77%"
              display="flex"
              flexDir="row"
              justifyContent="center"
              alignItems="center"
              // to="/forgotPassword"
              cursor="pointer"
              color="linkedin.700"
              fontSize="0.9rem"
              onClick={() => navigate("/forgotPassword")}
            >
              <BsDot />
              <Text>Reset Password</Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Login;
