import { Box, Button, Input, Select, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userAction } from "../Redux/userReducer";
import useInput from "../Hook/UserInput";
import { toast, ToastContainer, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RegisterAPI } from "../utils/ApiRoutes";
import { BiHide, BiShow } from "react-icons/bi";
export const ToastOption: ToastOptions = {
  position: "top-left",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //const [isFormInvalid,setIsFormInvalid] = useState(true)

  const {
    value: nameInputValue,
    hasError: nameInputHasError,
    handleEnteredValueChange: handleNameChnage,
    handleBlur: handleNameBlur,
    reset: nameReset,
  } = useInput((value) => value.trim() !== "");

  const {
    value: emailInputValue,
    hasError: emailInputHasError,
    handleEnteredValueChange: handleEmailChnage,
    handleBlur: handleEmailBlur,
    reset: emailReset,
  } = useInput((value) => value.includes("@"));

  const {
    value: dobInputValue,
    hasError: dobInputHasError,
    handleEnteredValueChange: handleDOBChnage,
    handleBlur: handleDOBBlur,
    reset: dobReset,
  } = useInput((value) => value.trim() !== "");

  const {
    value: passwordInputValue,
    hasError: passwordInputHasError,
    handleEnteredValueChange: handlePasswordChnage,
    handleBlur: handlePasswordBlur,
    reset: passwordReset,
  } = useInput((value) => value.trim().length >= 6 && value.trim() !== "");

  const {
    value: passwordConfInputValue,
    hasError: passwordConfInputHasError,
    handleEnteredValueChange: handleConfPasswordChnage,
    handleBlur: handleConfPasswordBlur,
    reset: passwordConfReset,
  } = useInput((value) => value === passwordInputValue);

  const {
    value: genderInputValue,
    // hasError: genderInputHasError,
    handleEnteredValueChange: handleGenderChnage,
    handleBlur: handleGenderBlur,
    // reset: genderReset,
  } = useInput((value) => value === "true");

  const Submitted = async () => {
    const localUserData = {
      name: nameInputValue,
      email: emailInputValue,
      password: passwordInputValue,
      dob: dobInputValue,
      gender: genderInputValue,
    };

    let response = await fetch(RegisterAPI, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(localUserData),
    });

    if (response.status === 500) {
      let error = await response.json();
      toast.error(error.errorMessage, ToastOption);
      //alert('Error at server side')
    } else if (response.status === 400) {
      let error = await response.json();
      toast.error(error.errorMessage, ToastOption);
    } else if (response.status === 201) {
      let data = await response.json();
      toast.info("Signup Successful", ToastOption);
      dispatch(userAction.addUserToStorage(data.user));
      navigate("/");
      handleReset();
    }
  };

  function handleReset() {
    nameReset();
    emailReset();
    passwordReset();
    passwordConfReset();
    dobReset();
  }

  function handleFormSubmit() {
    const isFormInvalid =
      nameInputHasError ||
      emailInputHasError ||
      passwordInputHasError ||
      dobInputHasError ||
      passwordConfInputHasError ||
      !nameInputValue ||
      !emailInputValue ||
      !passwordInputValue ||
      !passwordConfInputValue ||
      !dobInputValue;

    if (isFormInvalid) {
      return;
    } else {
      Submitted();
    }
  }

  return (
    <>
      <ToastContainer></ToastContainer>
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
          {/* Title Box */}
          <Box margin="auto">
            <Text fontSize="1.3rem" fontWeight="semibold" pb="2.5" width="100%">
              Create an account
            </Text>
          </Box>

          {/* Form Area */}
          <Box
            display="flex"
            flexDir="column"
            justifyContent="center"
            alignItems="center"
            width="100%"
            gap="0.6rem"
          >
            {/* Input Box */}
            <CustomInputContainer
              name="Name"
              type="text"
              placeHolder="Enter Your Name."
              inputHasError={nameInputHasError}
              inputValue={nameInputValue}
              handleChnage={handleNameChnage}
              handleBlur={handleNameBlur}
            />

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

            {/* Dob and Gender box */}
            <Box
              display="flex"
              flexDir="row"
              justifyContent="space-evenly"
              alignItems="center"
              width="80%"
            >
              <Box display="flex" flexDir="column" width="45%">
                <Text fontSize="0.9rem">Gender:</Text>
                <Select
                  variant="flushed"
                  value={genderInputValue}
                  onChange={handleGenderChnage}
                  onBlur={handleGenderBlur}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </Box>
              <Box display="flex" flexDir="column" width="45%">
                <Text fontSize="0.9rem">DOB:</Text>
                <Input
                  type="date"
                  variant="flushed"
                  focusBorderColor={dobInputHasError ? "red.300" : ""}
                  borderBottomColor={dobInputHasError ? "red.300" : ""}
                  value={dobInputValue}
                  onChange={handleDOBChnage}
                  onBlur={handleDOBBlur}
                />
              </Box>
            </Box>

            {/* Password and Confirm password */}
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
                placeHolder="Enter Password here"
                inputHasError={passwordInputHasError}
                inputValue={passwordInputValue}
                handleChnage={handlePasswordChnage}
                handleBlur={handlePasswordBlur}
              />

              {/* ConfirmPassword Box */}
              <CustomInputContainer
                name="Confirm Password"
                type="password"
                placeHolder="Enter Password again.."
                inputHasError={passwordConfInputHasError}
                inputValue={passwordConfInputValue}
                handleChnage={handleConfPasswordChnage}
                handleBlur={handleConfPasswordBlur}
              />
            </Box>

            {/* redirect to login box */}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDir="column"
              gap="1"
            >
              <Box fontSize="0.8rem" display="flex" gap="0.5">
                <Text>Already have an account ?</Text>
                <Text
                  cursor="pointer"
                  fontWeight="semibold"
                  color="blue.600"
                  onClick={() => navigate("/login")}
                >
                  Login here
                </Text>
              </Box>
            </Box>

            {/* Submit Button */}
            <Box width="100%" display="flex" justifyContent="center">
              <Button
                variant="solid"
                colorScheme="twitter"
                width="45%"
                color="white"
                size="sm"
                // onClick={Submitted}
                onClick={handleFormSubmit}
              >
                SignUp
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

interface ICustomInputContainerProps {
  name: string;
  type: string;
  placeHolder: string;
  inputHasError: boolean;
  inputValue: string;
  handleChnage: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | undefined
  ) => void;
  handleBlur: () => void;
}

export const CustomInputContainer = ({
  name,
  type,
  placeHolder,
  inputHasError,
  inputValue,
  handleChnage,
  handleBlur,
}: ICustomInputContainerProps) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  return (
    <Box
      width="100%"
      height="fit-content"
      display="flex"
      justifyContent="center"
    >
      <Box
        display="flex"
        flexDir="column"
        justifyContent="flex-end"
        alignItems="start"
        width="75%"
      >
        <Text fontSize="0.9rem">{name}:</Text>
        <Input
          pb="0rem"
          type={type === "password" ? (isShow ? "text" : "password") : type}
          fontSize="0.8rem"
          variant="flushed"
          focusBorderColor={inputHasError ? "red.300" : ""}
          borderBottomColor={inputHasError ? "red.300" : ""}
          placeholder={placeHolder}
          value={inputValue}
          onChange={handleChnage}
          onBlur={handleBlur}
        />
      </Box>
      {type === "password" ? (
        <Box
          alignSelf="end"
          fontSize="1.2rem"
          height="fit-content"
          width="fit-content"
          px="5px"
          py="3px"
          _hover={{
            backgroundColor: "#e7e7e7",
            boxShadow: "0px 0px 5px 1px lightgray",
          }}
          cursor="pointer"
          onClick={() => setIsShow(!isShow)}
        >
          {isShow ? <BiHide /> : <BiShow />}
        </Box>
      ) : null}
    </Box>
  );
};

export default Register;
